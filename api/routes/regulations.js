const express = require('express');
const router = express.Router();
const claudeService = require('../services/claudeService');

// 모든 규정 조회
router.get('/', (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    let regulations = claudeService.getRegulations();
    
    // 카테고리 필터링
    if (category) {
      regulations = regulations.filter(reg => reg.category === category);
    }
    
    // 검색 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      regulations = regulations.filter(reg => 
        reg.title.toLowerCase().includes(searchLower) ||
        reg.content.toLowerCase().includes(searchLower) ||
        reg.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      );
    }
    
    // 페이징
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedRegulations = regulations.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        regulations: paginatedRegulations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: regulations.length,
          totalPages: Math.ceil(regulations.length / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching regulations:', error);
    res.status(500).json({
      success: false,
      error: '규정 조회 중 오류가 발생했습니다.'
    });
  }
});

// 특정 규정 상세 조회
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const regulations = claudeService.getRegulations();
    
    const regulation = regulations.find(reg => reg.id === id);
    
    if (!regulation) {
      return res.status(404).json({
        success: false,
        error: '해당 규정을 찾을 수 없습니다.'
      });
    }
    
    // 관련 규정 찾기
    const relatedRegulations = regulations.filter(reg => 
      regulation.related_regulations.includes(reg.id) ||
      (reg.category === regulation.category && reg.id !== regulation.id)
    ).slice(0, 5);
    
    res.json({
      success: true,
      data: {
        regulation,
        relatedRegulations
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching regulation:', error);
    res.status(500).json({
      success: false,
      error: '규정 상세 조회 중 오류가 발생했습니다.'
    });
  }
});

// 카테고리 목록 조회
router.get('/categories/list', (req, res) => {
  try {
    const categories = claudeService.getCategories();
    const regulations = claudeService.getRegulations();
    
    // 각 카테고리별 규정 개수 추가
    const categoriesWithCount = categories.map(category => ({
      ...category,
      regulationCount: regulations.filter(reg => reg.category === category.id).length
    }));
    
    res.json({
      success: true,
      data: categoriesWithCount
    });
    
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: '카테고리 조회 중 오류가 발생했습니다.'
    });
  }
});

// 특정 카테고리의 규정 조회
router.get('/category/:categoryId', (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const regulations = claudeService.getRegulationsByCategory(categoryId);
    
    if (regulations.length === 0) {
      return res.status(404).json({
        success: false,
        error: '해당 카테고리의 규정을 찾을 수 없습니다.'
      });
    }
    
    // 페이징
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedRegulations = regulations.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        regulations: paginatedRegulations,
        categoryId,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: regulations.length,
          totalPages: Math.ceil(regulations.length / parseInt(limit))
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching category regulations:', error);
    res.status(500).json({
      success: false,
      error: '카테고리별 규정 조회 중 오류가 발생했습니다.'
    });
  }
});

// 규정 통계 정보
router.get('/stats/overview', (req, res) => {
  try {
    const regulations = claudeService.getRegulations();
    const categories = claudeService.getCategories();
    
    // 카테고리별 통계
    const categoryStats = categories.map(category => ({
      id: category.id,
      name: category.name,
      count: regulations.filter(reg => reg.category === category.id).length
    }));
    
    // 최근 업데이트된 규정 (가상 데이터이므로 모든 규정이 2024-01-01)
    const recentRegulations = regulations
      .sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date))
      .slice(0, 5);
    
    res.json({
      success: true,
      data: {
        totalRegulations: regulations.length,
        totalCategories: categories.length,
        categoryStats,
        recentRegulations,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: '통계 정보 조회 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;