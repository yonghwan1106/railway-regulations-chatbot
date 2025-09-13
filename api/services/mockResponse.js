// Mock 응답 생성기 (API 오류 시 사용)

function generateMockResponse(userQuery, regulations, conflicts) {
  if (!regulations || regulations.length === 0) {
    return {
      answer: "죄송합니다. 해당 질문과 관련된 규정을 찾을 수 없습니다.",
      regulations: [],
      conflicts: [],
      confidence: 0
    };
  }

  const mainRegulation = regulations[0];
  
  let answer = `📋 **${mainRegulation.title}**에 대한 정보를 찾았습니다.\n\n`;
  answer += `${mainRegulation.content}\n\n`;
  
  if (mainRegulation.detailed_content) {
    answer += `**📖 상세 내용:**\n${mainRegulation.detailed_content}\n\n`;
  }
  
  answer += `**⚖️ 법적 근거:** ${mainRegulation.legal_basis}\n`;
  answer += `**📅 시행일:** ${mainRegulation.effective_date}\n`;
  
  if (mainRegulation.keywords && mainRegulation.keywords.length > 0) {
    answer += `**🔍 관련 키워드:** ${mainRegulation.keywords.join(', ')}\n\n`;
  }
  
  if (conflicts && conflicts.length > 0) {
    answer += `⚠️ **주의사항:** ${conflicts[0].description}\n\n`;
  }
  
  if (regulations.length > 1) {
    answer += `📚 **관련 규정 ${regulations.length - 1}개 추가 발견**\n`;
    regulations.slice(1, 3).forEach((reg, index) => {
      answer += `${index + 2}. ${reg.title}\n`;
    });
    answer += `\n`;
  }
  
  answer += `💡 이 정보가 도움이 되셨나요? 추가 질문이 있으시면 언제든 말씀해주세요.\n\n`;
  answer += `🤖 *현재 AI 서비스 일시 점검 중으로 기본 검색 결과를 제공드렸습니다.*`;

  return {
    answer,
    regulations,
    conflicts,
    confidence: 85
  };
}

module.exports = { generateMockResponse };