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

  const categories = [
    { id: "노반편", name: "노반편", description: "철도 노반 관련 규정", regulationCount: 2 },
    { id: "궤도편", name: "궤도편", description: "궤도 구조 및 시설 관련 규정", regulationCount: 2 },
    { id: "전력편", name: "전력편", description: "전력 공급 및 전철 시설 규정", regulationCount: 1 },
    { id: "신호통신편", name: "신호통신편", description: "신호 및 통신 시설 규정", regulationCount: 1 },
    { id: "건축편", name: "건축편", description: "역사 및 건축 시설 규정", regulationCount: 1 },
    { id: "기계설비편", name: "기계설비편", description: "기계 설비 및 시설 규정", regulationCount: 1 },
    { id: "차량시설편", name: "차량시설편", description: "차량시설 관련 규정", regulationCount: 1 },
    { id: "환경편", name: "환경편", description: "환경 보호 및 관리 규정", regulationCount: 1 }
  ];

  res.status(200).json({
    success: true,
    data: categories
  });
}