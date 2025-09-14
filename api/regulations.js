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

  const regulations = [
    {
      id: "KR-001-2024-001",
      title: "고속철도 곡선반지름 기준",
      category: "노반편",
      subcategory: "선형기준",
      content: "250km/h 이상 운행하는 고속철도의 최소 곡선반지름은 2,500m 이상이어야 한다.",
      legal_basis: "철도건설규칙 제15조",
      effective_date: "2024-01-01",
      keywords: ["고속철도", "곡선반지름", "250km/h"]
    },
    {
      id: "KR-002-2024-001",
      title: "터널 내 전철주 설치기준",
      category: "전력편",
      subcategory: "전차선로",
      content: "터널 내에서는 터널 중심선으로부터 2.5m 이상 이격하여 전철주를 설치하여야 한다.",
      legal_basis: "전기철도설계기준 제4장",
      effective_date: "2024-01-01",
      keywords: ["터널", "전철주", "설치기준"]
    }
  ];

  res.status(200).json({
    success: true,
    data: {
      regulations: regulations,
      pagination: {
        page: 1,
        limit: 20,
        total: regulations.length,
        totalPages: 1
      }
    }
  });
}