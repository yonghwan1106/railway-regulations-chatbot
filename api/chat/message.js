const fs = require('fs');
const path = require('path');

// Mock response generator
function generateMockResponse(userQuery, regulations, conflicts) {
  if (!regulations || regulations.length === 0) {
    return {
      answer: "죄송합니다. 해당 질문과 관련된 규정을 찾을 수 없습니다.",
      regulations: [],
      conflicts: [],
      confidence: 0
    };
  }

  const mainRegulation = regulations[0];
  
  let answer = `📋 **${mainRegulation.title}**에 대한 정보를 찾았습니다.\n\n`;
  answer += `${mainRegulation.content}\n\n`;
  
  if (mainRegulation.detailed_content) {
    answer += `**📖 상세 내용:**\n${mainRegulation.detailed_content}\n\n`;
  }
  
  answer += `**⚖️ 법적 근거:** ${mainRegulation.legal_basis}\n`;
  answer += `**📅 시행일:** ${mainRegulation.effective_date}\n`;
  
  if (mainRegulation.keywords && mainRegulation.keywords.length > 0) {
    answer += `**🔍 관련 키워드:** ${mainRegulation.keywords.join(', ')}\n\n`;
  }
  
  if (conflicts && conflicts.length > 0) {
    answer += `⚠️ **주의사항:** ${conflicts[0].description}\n\n`;
  }
  
  if (regulations.length > 1) {
    answer += `📚 **관련 규정 ${regulations.length - 1}개 추가 발견**\n`;
    regulations.slice(1, 3).forEach((reg, index) => {
      answer += `${index + 2}. ${reg.title}\n`;
    });
    answer += `\n`;
  }
  
  answer += `💡 이 정보가 도움이 되셨나요? 추가 질문이 있으시면 언제든 말씀해주세요.\n\n`;
  answer += `🤖 *현재 AI 서비스 일시 점검 중으로 기본 검색 결과를 제공드렸습니다.*`;

  return {
    answer,
    regulations,
    conflicts,
    confidence: 85
  };
}

// 규정 검색 함수
function searchRelevantRegulations(query, regulations) {
  if (!regulations || !query) return [];

  const queryLower = query.toLowerCase();
  const relevantRegulations = regulations.filter(reg => {
    const titleMatch = reg.title.toLowerCase().includes(queryLower);
    const contentMatch = reg.content.toLowerCase().includes(queryLower);
    const keywordMatch = reg.keywords && reg.keywords.some(keyword => 
      queryLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(queryLower)
    );
    
    return titleMatch || contentMatch || keywordMatch;
  });

  return relevantRegulations.slice(0, 5);
}

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: '메시지가 필요합니다.'
      });
    }

    // 규정 데이터 로드
    let regulations = [];
    try {
      const regulationsPath = path.join(process.cwd(), 'api', 'data', 'regulations.json');
      const regulationsData = fs.readFileSync(regulationsPath, 'utf8');
      regulations = JSON.parse(regulationsData);
    } catch (error) {
      console.log('Using default regulations data');
      // 기본 규정 데이터
      regulations = [
        {
          id: "KR-001-2024-001",
          title: "고속철도 곡선반지름 기준",
          category: "노반편",
          subcategory: "선형기준",
          content: "250km/h 이상 운행하는 고속철도의 최소 곡선반지름은 2,500m 이상이어야 한다. 다만, 지형 여건상 불가피한 경우 2,000m까지 허용할 수 있다.",
          detailed_content: "1. 설계속도 250km/h 구간: 최소곡선반지름 2,500m\n2. 설계속도 200km/h 구간: 최소곡선반지름 2,000m\n3. 설계속도 160km/h 구간: 최소곡선반지름 1,600m\n4. 완화곡선의 길이는 곡선반지름의 1/3 이상으로 한다.",
          legal_basis: "철도건설규칙 제15조",
          effective_date: "2024-01-01",
          keywords: ["고속철도", "곡선반지름", "250km/h", "설계속도", "선형"]
        }
      ];
    }

    // 관련 규정 검색
    const relevantRegulations = searchRelevantRegulations(message, regulations);
    
    // Mock 응답 생성
    const response = generateMockResponse(message, relevantRegulations, []);

    res.status(200).json({
      success: true,
      data: {
        ...response,
        timestamp: new Date().toISOString(),
        sessionId: 'default'
      }
    });

  } catch (error) {
    console.error('Chat Message Error:', error);
    res.status(500).json({
      success: false,
      error: '메시지 처리 중 오류가 발생했습니다.'
    });
  }
}