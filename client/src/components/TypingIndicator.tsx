import React from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const TypingContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

const TypingBubble = styled.div`
  background: #f8f9fa;
  border-radius: 20px 20px 20px 5px;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite;
  
  &:nth-child(1) {
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const TypingText = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
  margin-left: 0.5rem;
`;

const TypingIndicator: React.FC = () => {
  return (
    <TypingContainer>
      <TypingBubble>
        <Dot />
        <Dot />
        <Dot />
        <TypingText>AI가 답변을 생성 중입니다...</TypingText>
      </TypingBubble>
    </TypingContainer>
  );
};

export default TypingIndicator;