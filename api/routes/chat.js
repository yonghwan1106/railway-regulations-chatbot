const express = require('express');
const router = express.Router();
const claudeService = require('../services/claudeService');

// 채팅 메시지 처리
router.post('/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: '메시지가 비어있습니다.'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        error: '메시지가 너무 깁니다. 1000자 이내로 입력해주세요.'
      });
    }

    console.log(`📨 User query: ${message}`);

    // Claude API를 통한 응답 생성
    const response = await claudeService.generateResponse(message);

    // 응답 로깅
    console.log(`🤖 Bot response confidence: ${response.confidence}%`);
    console.log(`📚 Found ${response.regulations.length} relevant regulations`);
    console.log(`⚠️ Found ${response.conflicts.length} conflicts`);

    res.json({
      success: true,
      data: {
        message: response.answer,
        regulations: response.regulations,
        conflicts: response.conflicts,
        confidence: response.confidence,
        timestamp: new Date().toISOString(),
        sessionId: sessionId || 'default'
      }
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || '챗봇 서비스에 오류가 발생했습니다.'
    });
  }
});

// 자주 묻는 질문 (FAQ)
router.get('/faq', (req, res) => {
  const faqData = [
    {
      id: 1,
      question: "250km/h 고속철도 최소곡선반지름은?",
      category: "노반편",
      keywords: ["고속철도", "곡선반지름", "250km/h"]
    },
    {
      id: 2, 
      question: "터널 내 전철주 설치 간격 기준은?",
      category: "전력편",
      keywords: ["터널", "전철주", "설치간격"]
    },
    {
      id: 3,
      question: "KTX 승강장 유효길이는 얼마인가요?",
      category: "건축편", 
      keywords: ["승강장", "KTX", "유효길이"]
    },
    {
      id: 4,
      question: "신호기 설치 시 선로 이격거리는?",
      category: "신호통신편",
      keywords: ["신호기", "이격거리", "설치기준"]
    },
    {
      id: 5,
      question: "교량 상 궤도 설계 시 주의사항은?",
      category: "궤도편",
      keywords: ["교량", "궤도", "설계기준"]
    },
    {
      id: 6,
      question: "지하역사 환기시설 기준은?",
      category: "기계설비편",
      keywords: ["지하역사", "환기", "환기량"]
    }
  ];

  res.json({
    success: true,
    data: faqData
  });
});

// 검색어 자동완성
router.get('/autocomplete', (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
    return res.json({
      success: true,
      data: []
    });
  }

  const regulations = claudeService.getRegulations();
  const suggestions = [];

  // 제목에서 검색
  regulations.forEach(reg => {
    if (reg.title.toLowerCase().includes(q.toLowerCase())) {
      suggestions.push({
        text: reg.title,
        type: 'title',
        category: reg.category
      });
    }
  });

  // 키워드에서 검색
  regulations.forEach(reg => {
    reg.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(q.toLowerCase()) && 
          !suggestions.some(s => s.text === keyword)) {
        suggestions.push({
          text: keyword,
          type: 'keyword',
          category: reg.category
        });
      }
    });
  });

  res.json({
    success: true,
    data: suggestions.slice(0, 10) // 최대 10개
  });
});

// 채팅 세션 초기화
router.post('/reset', (req, res) => {
  res.json({
    success: true,
    message: '새로운 대화를 시작합니다.',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;