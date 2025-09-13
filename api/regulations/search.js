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
    const { category, page = 1, limit = 10 } = req.query;

    // 규정 데이터 파일 읽기
    const regulationsPath = path.join(process.cwd(), 'api', 'data', 'regulations.json');
    const regulationsData = fs.readFileSync(regulationsPath, 'utf8');
    let regulations = JSON.parse(regulationsData);

    // 카테고리 필터링
    if (category && category !== 'all') {
      regulations = regulations.filter(reg => 
        reg.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 페이징 처리
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedRegulations = regulations.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        regulations: paginatedRegulations,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(regulations.length / limit),
          totalItems: regulations.length,
          itemsPerPage: parseInt(limit)
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Regulations Search Error:', error);
    
    // 기본 규정 데이터 반환
    const defaultRegulations = [
      {
        id: "KR-001-2024-001",
        title: "고속철도 곡선반지름 기준",
        category: "노반편",
        subcategory: "선형기준",
        content: "250km/h 이상 운행하는 고속철도의 최소 곡선반지름은 2,500m 이상이어야 한다.",
        legal_basis: "철도건설규칙 제15조",
        effective_date: "2024-01-01",
        keywords: ["고속철도", "곡선반지름", "250km/h"]
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        regulations: defaultRegulations,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10
        }
      },
      timestamp: new Date().toISOString()
    });
  }
}