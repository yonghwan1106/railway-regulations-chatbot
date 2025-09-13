import React, { useState } from 'react';
import styled from 'styled-components';
import { ChatMessage } from '../types';

const MessageContainer = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
`;

const BubbleWrapper = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  
  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
    : '#f8f9fa'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  padding: 1rem 1.5rem;
  border-radius: ${props => props.$isUser 
    ? '20px 20px 5px 20px' 
    : '20px 20px 20px 5px'};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  line-height: 1.5;
`;

const MessageInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
`;

const ConfidenceBadge = styled.span<{ $confidence: number }>`
  background: ${props => 
    props.$confidence >= 80 ? '#28a745' : 
    props.$confidence >= 60 ? '#ffc107' : '#dc3545'};
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const RegulationsSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const RegulationCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.9;
    line-height: 1.4;
  }
  
  .category {
    font-size: 0.7rem;
    opacity: 0.7;
    margin-top: 0.3rem;
  }
`;

const ConflictsSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 10px;
  border-left: 4px solid #dc3545;
  
  h4 {
    color: #dc3545;
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .conflict-item {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
`;

const ExpandButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0.3rem 0.8rem;
  font-size: 0.7rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubbleComponent: React.FC<MessageBubbleProps> = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isUser = message.type === 'user';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <MessageContainer $isUser={isUser}>
      <BubbleWrapper $isUser={isUser}>
        <MessageBubble $isUser={isUser}>
          <div>{message.content}</div>
          
          {/* 봇 메시지인 경우 추가 정보 표시 */}
          {!isUser && message.regulations && message.regulations.length > 0 && (
            <RegulationsSection>
              <h4>📚 관련 규정 ({message.regulations.length}개)</h4>
              {message.regulations.slice(0, isExpanded ? undefined : 2).map((regulation) => (
                <RegulationCard key={regulation.id}>
                  <h4>{regulation.title}</h4>
                  <p>{regulation.content}</p>
                  <div className="category">{regulation.category} &gt; {regulation.subcategory}</div>
                </RegulationCard>
              ))}
              
              {message.regulations.length > 2 && (
                <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? '접기' : `${message.regulations.length - 2}개 더 보기`}
                </ExpandButton>
              )}
            </RegulationsSection>
          )}
          
          {/* 상충 규정 경고 */}
          {!isUser && message.conflicts && message.conflicts.length > 0 && (
            <ConflictsSection>
              <h4>⚠️ 상충 규정 주의사항</h4>
              {message.conflicts.map((conflict, index) => (
                <div key={index} className="conflict-item">
                  <strong>{conflict.regulation1.title}</strong>과 
                  <strong> {conflict.regulation2.title}</strong> 간 {conflict.description}
                </div>
              ))}
            </ConflictsSection>
          )}
        </MessageBubble>
        
        <MessageInfo>
          <span>{formatTime(message.timestamp)}</span>
          {!isUser && message.confidence !== undefined && (
            <ConfidenceBadge $confidence={message.confidence}>
              신뢰도 {message.confidence}%
            </ConfidenceBadge>
          )}
        </MessageInfo>
      </BubbleWrapper>
    </MessageContainer>
  );
};

export default MessageBubbleComponent;