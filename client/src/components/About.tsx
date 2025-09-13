import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: calc(100vh - 140px);
`;

const AboutHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  
  h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.2rem;
    line-height: 1.6;
  }
`;

const AboutBody = styled.div`
  padding: 3rem 2rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  h2 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: #6c757d;
    line-height: 1.7;
    margin-bottom: 1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.15);
  }
  
  .emoji {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }
  
  p {
    color: #6c757d;
    line-height: 1.6;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  
  .number {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .label {
    opacity: 0.9;
    font-size: 1rem;
  }
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
  
  .tech {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    padding: 0.8rem 1.2rem;
    border-radius: 25px;
    font-weight: 500;
    color: #495057;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #667eea;
      color: #667eea;
      transform: translateY(-2px);
    }
  }
`;

const ContactSection = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
  
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #6c757d;
    margin-bottom: 1.5rem;
  }
  
  .contact-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #495057;
      font-weight: 500;
    }
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <AboutHeader>
        <h1>🚄 KR-CODE 지능형 가이드</h1>
        <p>
          📋 <strong>국민참여 철도규제 개선제안 공모전 출품작</strong><br />
          AI 기반 철도건설규정 통합검색 시스템<br />
          복잡한 규정, 이제 간단한 질문으로 해결하세요
        </p>
      </AboutHeader>

      <AboutBody>
        <Section>
          <h2>🎯 프로젝트 개요</h2>
          <p>
            KR-CODE 지능형 가이드는 국가철도공단의 500개 이상의 복잡한 철도건설 규정을 
            AI 기술을 활용해 쉽고 빠르게 검색할 수 있는 혁신적인 서비스입니다.
          </p>
          <p>
            기존의 PDF 기반 수동 검색 방식에서 벗어나, 자연어 질문을 통해 
            정확한 규정 정보를 3초 내에 제공하여 업무 효율성을 획기적으로 향상시킵니다.
          </p>
        </Section>

        <Section>
          <h2>✨ 주요 기능</h2>
          <FeaturesGrid>
            <FeatureCard>
              <div className="emoji">🤖</div>
              <h3>AI 기반 자연어 검색</h3>
              <p>
                복잡한 키워드 검색 대신 자연스러운 질문으로 
                원하는 규정을 즉시 찾을 수 있습니다.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="emoji">⚠️</div>
              <h3>규정 상충 자동 검토</h3>
              <p>
                여러 규정 간 상충사항을 자동으로 감지하고 
                우선순위를 제시하여 설계 오류를 방지합니다.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="emoji">📱</div>
              <h3>모바일 최적화</h3>
              <p>
                현장에서도 편리하게 사용할 수 있도록 
                반응형 디자인으로 설계되었습니다.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="emoji">⚡</div>
              <h3>실시간 응답</h3>
              <p>
                평균 3초 내 응답으로 업무 흐름을 
                중단하지 않고 필요한 정보를 얻을 수 있습니다.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="emoji">🔍</div>
              <h3>상세한 근거 제시</h3>
              <p>
                답변과 함께 정확한 조문, 페이지 번호, 
                법적 근거를 제시하여 신뢰성을 보장합니다.
              </p>
            </FeatureCard>
            
            <FeatureCard>
              <div className="emoji">📊</div>
              <h3>신뢰도 표시</h3>
              <p>
                각 답변에 대한 AI의 신뢰도를 표시하여 
                사용자가 판단할 수 있도록 돕습니다.
              </p>
            </FeatureCard>
          </FeaturesGrid>
        </Section>

        <Section>
          <h2>📈 기대 효과</h2>
          <StatsGrid>
            <StatCard>
              <div className="number">95%</div>
              <div className="label">검색 시간 단축</div>
            </StatCard>
            
            <StatCard>
              <div className="number">52억원</div>
              <div className="label">연간 비용 절감</div>
            </StatCard>
            
            <StatCard>
              <div className="number">90%</div>
              <div className="label">설계변경 감소</div>
            </StatCard>
            
            <StatCard>
              <div className="number">1,600%</div>
              <div className="label">투자 대비 효과</div>
            </StatCard>
          </StatsGrid>
        </Section>

        <Section>
          <h2>🛠️ 기술 스택</h2>
          <p>최신 AI 기술과 웹 기술을 결합하여 안정적이고 확장 가능한 시스템을 구축했습니다.</p>
          <TechStack>
            <div className="tech">Claude API (Anthropic)</div>
            <div className="tech">React + TypeScript</div>
            <div className="tech">Node.js + Express</div>
            <div className="tech">Styled Components</div>
            <div className="tech">PostgreSQL</div>
            <div className="tech">Docker</div>
            <div className="tech">AWS/Azure</div>
          </TechStack>
        </Section>

        <Section>
          <h2>🎯 미션 & 비전</h2>
          <p>
            <strong>미션:</strong> AI 기술을 통해 복잡한 규정을 누구나 쉽게 이해하고 활용할 수 있도록 지원
          </p>
          <p>
            <strong>비전:</strong> 철도건설 생태계 전반의 디지털 혁신을 선도하고, 
            중소기업과 대기업이 공평하게 경쟁할 수 있는 환경 조성
          </p>
        </Section>

        <ContactSection>
          <h3>📞 문의 및 지원</h3>
          <p>서비스 이용 중 문의사항이나 개선 제안이 있으시면 언제든 연락해주세요.</p>
          <div className="contact-info">
            <div className="contact-item">
              <span>📧</span>
              <span>sanoramyun8@gmail.com</span>
            </div>
            <div className="contact-item">
              <span>📱</span>
              <span>010-7939-3123</span>
            </div>
            <div className="contact-item">
              <span>🏢</span>
              <span>국가철도공단 설계기술처</span>
            </div>
          </div>
        </ContactSection>
      </AboutBody>
    </AboutContainer>
  );
};

export default About;