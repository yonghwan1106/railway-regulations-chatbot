export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    }
  ];

  res.status(200).json({
    success: true,
    data: faqData
  });
}