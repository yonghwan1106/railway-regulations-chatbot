'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic } from 'lucide-react';

interface SearchBarProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSubmit, isLoading = false, placeholder = "철도규정에 대해 질문해보세요. 예: '250km/h 곡선반지름이 얼마나 되나요?'" }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-4xl gap-2">
      <div className="relative flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="pr-12 h-12 text-base"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-10 w-10"
          disabled={isLoading}
          onClick={() => {
            // TODO: 음성 입력 기능 구현
            console.log('음성 입력 기능 구현 예정');
          }}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
      <Button 
        type="submit" 
        disabled={!query.trim() || isLoading}
        size="lg"
        className="h-12 px-6"
      >
        <Send className="h-4 w-4 mr-2" />
        질문하기
      </Button>
    </form>
  );
}