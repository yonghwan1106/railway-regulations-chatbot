const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');
const { generateMockResponse } = require("./mockResponse");

class ClaudeService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.regulations = null;
    this.categories = null;
    this.loadData();
  }

  async loadData() {
    try {
      const regulationsPath = path.join(__dirname, '../../data/regulations.json');
      const categoriesPath = path.join(__dirname, '../../data/categories.json');
      
      this.regulations = JSON.parse(await fs.readFile(regulationsPath, 'utf8'));
      this.categories = JSON.parse(await fs.readFile(categoriesPath, 'utf8'));
      
      console.log(`📚 Loaded ${this.regulations.length} regulations and ${this.categories.length} categories`);
    } catch (error) {
      console.error('❌ Error loading data:', error);
    }
  }

  // 관련 규정 검색
  searchRelevantRegulations(query) {
    if (!this.regulations) return [];

    const queryLower = query.toLowerCase();
    const relevantRegulations = this.regulations.filter(reg => {
      // 제목, 내용, 키워드에서 검색
      const titleMatch = reg.title.toLowerCase().includes(queryLower);
      const contentMatch = reg.content.toLowerCase().includes(queryLower);
      const keywordMatch = reg.keywords.some(keyword => 
        queryLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(queryLower)
      );
      
      return titleMatch || contentMatch || keywordMatch;
    });

    // 관련도 순으로 정렬 (제목 매치 > 키워드 매치 > 내용 매치)
    return relevantRegulations.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, queryLower);
      const bScore = this.calculateRelevanceScore(b, queryLower);
      return bScore - aScore;
    }).slice(0, 5); // 상위 5개만 반환
  }

  calculateRelevanceScore(regulation, query) {
    let score = 0;
    
    // 제목 매치 (가중치: 10)
    if (regulation.title.toLowerCase().includes(query)) score += 10;
    
    // 키워드 정확 매치 (가중치: 8)
    regulation.keywords.forEach(keyword => {
      if (query.includes(keyword.toLowerCase())) score += 8;
      if (keyword.toLowerCase().includes(query)) score += 5;
    });
    
    // 내용 매치 (가중치: 3)
    if (regulation.content.toLowerCase().includes(query)) score += 3;
    
    return score;
  }

  // 상충 규정 체크
  checkConflictingRegulations(regulations) {
    // 간단한 상충 체크 로직 (실제로는 더 복잡한 로직 필요)
    const conflicts = [];
    
    for (let i = 0; i < regulations.length; i++) {
      for (let j = i + 1; j < regulations.length; j++) {
        const reg1 = regulations[i];
        const reg2 = regulations[j];
        
        // 같은 카테고리에서 서로 다른 수치 기준이 있는지 체크
        if (reg1.category === reg2.category) {
          const conflict = this.detectNumericConflict(reg1, reg2);
          if (conflict) {
            conflicts.push({
              regulation1: reg1,
              regulation2: reg2,
              conflictType: conflict.type,
              description: conflict.description
            });
          }
        }
      }
    }
    
    return conflicts;
  }

  detectNumericConflict(reg1, reg2) {
    // 숫자 값이 포함된 내용에서 상충 체크
    const numberRegex = /(\d+(?:\.\d+)?)\s*([km|m|mm|시간|회|배|%])/g;
    
    const reg1Numbers = [...reg1.content.matchAll(numberRegex)];
    const reg2Numbers = [...reg2.content.matchAll(numberRegex)];
    
    // 같은 단위에서 다른 값이 있는지 체크
    for (const match1 of reg1Numbers) {
      for (const match2 of reg2Numbers) {
        if (match1[2] === match2[2] && match1[1] !== match2[1]) {
          return {
            type: 'numeric_difference',
            description: `${match1[2]} 단위에서 ${match1[1]}과 ${match2[1]}로 서로 다른 기준값`
          };
        }
      }
    }
    
    return null;
  }

  // Claude API를 사용한 응답 생성
  async generateResponse(userQuery) {
    // 관련 규정 검색
    const relevantRegulations = this.searchRelevantRegulations(userQuery);
    
    if (relevantRegulations.length === 0) {
      return {
        answer: "죄송합니다. 해당 질문과 관련된 규정을 찾을 수 없습니다. 다른 키워드로 다시 검색해 보시거나, 더 구체적인 질문을 해주세요.",
        regulations: [],
        conflicts: [],
        confidence: 0
      };
    }

    // 상충 규정 체크
    const conflicts = this.checkConflictingRegulations(relevantRegulations);

    try {

      // Claude에게 전달할 컨텍스트 구성
      const context = this.buildContext(relevantRegulations, conflicts);
      
      const prompt = `당신은 국가철도공단의 AI 기반 철도건설규정 전문 컨설턴트입니다. 
사용자의 질문에 대해 정확하고 실용적인 답변을 제공해주세요.

사용자 질문: ${userQuery}

관련 규정 정보:
${context}

답변 시 다음 사항을 고려해주세요:
1. 정확한 규정 조문과 수치를 인용해주세요
2. 근거 문서와 조항을 명시해주세요  
3. 관련된 추가 규정이 있다면 함께 안내해주세요
4. 상충되는 규정이 있다면 우선순위를 명확히 해주세요
5. 실무진이 바로 적용할 수 있도록 구체적으로 설명해주세요

답변은 친근하고 전문적인 톤으로 작성해주세요.`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return {
        answer: response.content[0].text,
        regulations: relevantRegulations,
        conflicts: conflicts,
        confidence: this.calculateConfidence(relevantRegulations, userQuery)
      };

    } catch (error) {
      console.error('❌ Claude API Error:', error);
      console.log('🔄 Falling back to mock response...');
      
      // API 오류 시 Mock 응답으로 fallback
      return generateMockResponse(userQuery, relevantRegulations, conflicts);
    }
  }

  buildContext(regulations, conflicts) {
    let context = '';
    
    regulations.forEach((reg, index) => {
      context += `\n[규정 ${index + 1}]
제목: ${reg.title}
분류: ${reg.category} > ${reg.subcategory}  
내용: ${reg.content}
상세내용: ${reg.detailed_content}
법적근거: ${reg.legal_basis}
키워드: ${reg.keywords.join(', ')}
`;
    });

    if (conflicts.length > 0) {
      context += '\n[상충 규정 주의사항]\n';
      conflicts.forEach((conflict, index) => {
        context += `상충 ${index + 1}: ${conflict.regulation1.title}과 ${conflict.regulation2.title} 간 ${conflict.description}\n`;
      });
    }

    return context;
  }

  calculateConfidence(regulations, query) {
    if (regulations.length === 0) return 0;
    
    const avgRelevanceScore = regulations.reduce((sum, reg) => 
      sum + this.calculateRelevanceScore(reg, query.toLowerCase()), 0) / regulations.length;
    
    // 0-100 스케일로 변환
    return Math.min(100, Math.round(avgRelevanceScore * 8));
  }

  // 규정 목록 반환
  getRegulations() {
    return this.regulations || [];
  }

  // 카테고리 목록 반환  
  getCategories() {
    return this.categories || [];
  }

  // 특정 카테고리의 규정 반환
  getRegulationsByCategory(categoryId) {
    if (!this.regulations) return [];
    return this.regulations.filter(reg => reg.category === categoryId);
  }
}

module.exports = new ClaudeService();