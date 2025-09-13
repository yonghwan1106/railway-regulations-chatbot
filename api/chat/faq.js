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
        question: "250km/h 고속철도의 최소곡선반지름은?",
        answer: "2,500m 이상입니다. 지형 여건상 불가피한 경우 2,000m까지 허용됩니다.",
        category: "노반편"
      },
      {
        id: 2,
        question: "터널 내 전철주는 어떤 기준으로 설치하나요?",
        answer: "터널 중심선으로부터 2.5m 이상 이격하여 설치해야 하며, 터널 단면에 따른 안전거리를 확보해야 합니다.",
        category: "전력편"
      },
      {
        id: 3,
        question: "승강장의 표준 길이는?",
        answer: "고속철도는 400m, 일반철도는 250m가 표준입니다.",
        category: "건축편"
      },
      {
        id: 4,
        question: "신호기 이격거리 기준은?",
        answer: "궤도 중심선으로부터 2.0m 이상 이격하여 설치해야 합니다.",
        category: "신호통신편"
      },
      {
        id: 5,
        question: "교량 위 궤도 구조 기준은?",
        answer: "콘크리트 도상 또는 직결궤도 구조를 표준으로 하며, 소음·진동을 고려해야 합니다.",
        category: "궤도편"
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