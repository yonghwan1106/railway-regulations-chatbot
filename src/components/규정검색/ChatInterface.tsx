'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SearchBar } from './SearchBar';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '@/types/규정';
import { Button } from '@/components/ui/button';
import { RotateCcw, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  onSearch: (query: string) => Promise<ChatMessageType>;
  onBookmark?: (regulationId: string) => void;
}

export function ChatInterface({ onSearch, onBookmark }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (query: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await onSearch(query);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Search failed:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 검색 중 오류가 발생했습니다. 다시 시도해 주세요.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              철도건설규정 AI 챗봇
            </h1>
            <p className="text-sm text-gray-600">
              철도 건설 관련 규정을 쉽고 빠르게 찾아보세요
            </p>
          </div>
          {messages.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearChat}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              대화 초기화
            </Button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                철도규정 검색을 시작해보세요
              </h3>
              <p className="text-gray-600 mb-6">
                궁금한 철도건설 규정에 대해 자연어로 질문해주세요.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  className="p-4 h-auto text-left justify-start"
                  onClick={() => handleSubmit('고속철도 최소 곡선반지름이 얼마인가요?')}
                >
                  <div>
                    <div className="font-medium">곡선반지름 문의</div>
                    <div className="text-sm text-gray-500">고속철도 최소 곡선반지름이 얼마인가요?</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="p-4 h-auto text-left justify-start"
                  onClick={() => handleSubmit('터널 내공단면적 기준을 알려주세요')}
                >
                  <div>
                    <div className="font-medium">터널 설계 기준</div>
                    <div className="text-sm text-gray-500">터널 내공단면적 기준을 알려주세요</div>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onBookmark={onBookmark}
                  onCopy={handleCopy}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        규정을 검색하고 있습니다...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 p-4 border-t bg-white">
        <div className="max-w-6xl mx-auto">
          <SearchBar 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}