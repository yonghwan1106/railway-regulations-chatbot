import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { chatAPI } from '../services/api';
import { FAQ } from '../types';

const FAQContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FAQTitle = styled.h3`
  color: #495057;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FAQCard = styled.button`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  }
  
  h4 {
    color: #333;
    margin: 0 0 0.8rem 0;
    font-size: 1rem;
    line-height: 1.4;
    font-weight: 600;
  }
  
  .category {
    display: inline-block;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    font-size: 0.75rem;
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .keywords {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.8rem;
  }
  
  .keyword {
    background: #f8f9fa;
    color: #6c757d;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  color: #6c757d;
  padding: 2rem;
  
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorState = styled.div`
  text-align: center;
  color: #dc3545;
  padding: 1rem;
  font-size: 0.9rem;
`;

interface FAQSectionProps {
  onQuestionClick: (question: string) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onQuestionClick }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const faqData = await chatAPI.getFAQ();
      setFaqs(faqData);
    } catch (err) {
      setError('FAQ를 불러오는 중 오류가 발생했습니다.');
      console.error('FAQ loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingState>
        <div className="spinner"></div>
        자주 묻는 질문을 불러오는 중...
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState>
        {error}
      </ErrorState>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <FAQContainer>
      <FAQTitle>💡 자주 묻는 질문</FAQTitle>
      <FAQGrid>
        {faqs.map((faq) => (
          <FAQCard
            key={faq.id}
            onClick={() => onQuestionClick(faq.question)}
          >
            <div className="category">{faq.category}</div>
            <h4>{faq.question}</h4>
            <div className="keywords">
              {faq.keywords.map((keyword, index) => (
                <span key={index} className="keyword">
                  {keyword}
                </span>
              ))}
            </div>
          </FAQCard>
        ))}
      </FAQGrid>
    </FAQContainer>
  );
};

export default FAQSection;