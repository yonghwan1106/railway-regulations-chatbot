import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

interface RequestBody {
  query: string;
  regulations: any[];
  userId?: string;
}

const SYSTEM_PROMPT = `당신은 철도건설 규정 전문가입니다. 사용자의 질문에 대해 제공된 규정 데이터를 바탕으로 정확하고 상세한 답변을 제공해야 합니다.

답변 시 다음 사항을 반드시 포함하세요:
1. 관련 규정의 구체적인 내용
2. 규정의 출처 (법령명, 조문 번호)
3. 실무 적용 시 주의사항
4. 관련된 다른 규정이나 기준이 있다면 언급

답변은 친근하고 이해하기 쉬운 한국어로 작성하되, 전문적인 정확성을 유지해주세요.
규정이 명확하지 않거나 추가 확인이 필요한 경우 이를 명시해주세요.`;

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body: RequestBody = await request.json();
    const { query, regulations, userId } = body;

    if (!query) {
      return NextResponse.json(
        { error: '검색 쿼리가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 규정 데이터를 컨텍스트로 구성
    const regulationsContext = regulations
      .map((reg, index) => 
        `[규정 ${index + 1}]
제목: ${reg.title}
출처: ${reg.source_document} ${reg.article_number}
분야: ${reg.category}
내용: ${reg.content}
---`
      )
      .join('\n');

    const userPrompt = `사용자 질문: "${query}"

관련 규정 정보:
${regulationsContext}

위의 규정 정보를 바탕으로 사용자의 질문에 대해 정확하고 상세한 답변을 제공해주세요. 답변에는 관련 규정의 구체적인 내용, 출처, 그리고 실무 적용 시 주의사항을 포함해주세요.`;

    // Anthropic Claude API 호출
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 2000,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API Error:', errorData);
      return NextResponse.json(
        { error: 'AI 서비스에서 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || '답변을 생성할 수 없습니다.';

    // 관련도 점수 계산 (간단한 키워드 매칭 기반)
    const relevanceScores: Record<string, number> = {};
    const queryKeywords = query.toLowerCase().split(' ').filter(word => word.length > 1);

    regulations.forEach(reg => {
      const contentLower = reg.content.toLowerCase();
      const titleLower = reg.title.toLowerCase();
      
      let score = 0;
      queryKeywords.forEach(keyword => {
        if (titleLower.includes(keyword)) score += 0.3;
        if (contentLower.includes(keyword)) score += 0.2;
      });
      
      relevanceScores[reg.id] = Math.min(score, 1.0);
    });

    return NextResponse.json({
      answer,
      relevanceScores,
      regulationsUsed: regulations.length,
    });

  } catch (error) {
    console.error('Claude API route error:', error);
    return NextResponse.json(
      { error: '서버에서 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}