const fs = require('fs');
const path = require('path');

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
    // 카테고리 데이터 파일 읽기
    const categoriesPath = path.join(process.cwd(), 'api', 'data', 'categories.json');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    res.status(200).json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Categories Error:', error);
    
    // 파일 읽기 실패 시 기본 카테고리 반환
    const defaultCategories = [
      { id: "earthwork", name: "노반편", description: "철도 노반 관련 규정" },
      { id: "track", name: "궤도편", description: "궤도 구조 및 시설 관련 규정" },
      { id: "power", name: "전력편", description: "전력 공급 및 전철 시설 규정" },
      { id: "signal", name: "신호통신편", description: "신호 및 통신 시설 규정" },
      { id: "building", name: "건축편", description: "역사 및 건축 시설 규정" },
      { id: "mechanical", name: "기계편", description: "기계 설비 및 시설 규정" },
      { id: "safety", name: "안전편", description: "안전 관리 및 시설 규정" },
      { id: "environment", name: "환경편", description: "환경 보호 및 관리 규정" }
    ];

    res.status(200).json({
      success: true,
      data: defaultCategories,
      timestamp: new Date().toISOString()
    });
  }
}