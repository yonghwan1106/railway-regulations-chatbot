module.exports = async function handler(req, res) {
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // FAQ 데이터 반환
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

    res.status(200).json({
      success: true,
      data: faqData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('FAQ Error:', error);
    res.status(500).json({
      success: false,
      error: 'FAQ 데이터 조회 중 오류가 발생했습니다.'
    });
  }
}