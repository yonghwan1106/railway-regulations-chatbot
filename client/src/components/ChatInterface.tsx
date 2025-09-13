import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import FAQSection from './FAQSection';

const ChatContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: calc(100vh - 140px);
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem 2rem;
  text-align: center;
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
`;

const InputArea = styled.div`
  padding: 1rem 2rem 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(248, 249, 250, 0.8);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 50px;
  max-height: 120px;
  padding: 1rem 1.2rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  line-height: 1.4;
  resize: none;
  outline: none;
  background: white;
  font-family: inherit;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  
  .emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    color: #495057;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage.content, sessionId);
      
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        type: 'bot',
        content: response.message,
        timestamp: new Date(response.timestamp),
        regulations: response.regulations,
        conflicts: response.conflicts,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        type: 'bot',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    setMessages([]);
    try {
      await chatAPI.resetSession();
    } catch (error) {
      console.error('Failed to reset session:', error);
    }
  };

  const handleFAQClick = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  // 텍스트 영역 자동 높이 조절
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // 자동 높이 조절
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h2>🤖 AI 철도규정 컨설턴트</h2>
        <p>철도건설 규정에 대해 무엇이든 물어보세요</p>
      </ChatHeader>

      <ChatBody>
        <MessagesArea>
          {messages.length === 0 ? (
            <EmptyState>
              <div className="emoji">💬</div>
              <h3>안녕하세요!</h3>
              <p>
                KR-CODE 지능형 가이드입니다.<br />
                철도건설 규정에 대한 궁금한 점을 자연어로 질문해주세요.
              </p>
              <FAQSection onQuestionClick={handleFAQClick} />
            </EmptyState>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </MessagesArea>

        <InputArea>
          <InputContainer>
            <InputWrapper>
              <TextInput
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="예: 250km/h 고속철도 최소곡선반지름은?"
                disabled={isLoading}
                rows={1}
              />
            </InputWrapper>
            <SendButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              title="메시지 전송 (Enter)"
            >
              {isLoading ? '⏳' : '🚀'}
            </SendButton>
          </InputContainer>
          
          {messages.length > 0 && (
            <ClearButton onClick={handleClearChat}>
              🗑️ 대화 초기화
            </ClearButton>
          )}
        </InputArea>
      </ChatBody>
    </ChatContainer>
  );
};

export default ChatInterface;