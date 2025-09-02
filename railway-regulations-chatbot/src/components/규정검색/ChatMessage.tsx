'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Bot, AlertTriangle, Bookmark, Copy, CheckCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types/규정';
import { cn } from '@/utils/cn';

interface ChatMessageProps {
  message: ChatMessageType;
  onBookmark?: (regulationId: string) => void;
  onCopy?: (content: string) => void;
}

export function ChatMessage({ message, onBookmark, onCopy }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasConflicts = message.conflicts && message.conflicts.length > 0;

  return (
    <div className={cn(
      "flex w-full gap-4 mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex gap-3 max-w-4xl w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser 
            ? "bg-blue-500 text-white" 
            : "bg-green-500 text-white"
        )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
        
        <div className={cn(
          "flex-1 space-y-2",
          isUser ? "items-end" : "items-start"
        )}>
          <Card className={cn(
            "max-w-full",
            isUser 
              ? "bg-blue-50 border-blue-200" 
              : "bg-gray-50 border-gray-200",
            hasConflicts && "border-amber-300"
          )}>
            <CardContent className="p-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
              
              {/* 규정 출처 표시 */}
              {message.regulations && message.regulations.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-medium text-gray-600 border-t pt-3">
                    관련 규정:
                  </div>
                  {message.regulations.map((result, index) => (
                    <div key={index} className="bg-white border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">
                            {result.regulation.title}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {result.regulation.source_document} - {result.regulation.article_number}
                          </div>
                          <div className="text-sm text-gray-700">
                            {result.matched_content}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onBookmark?.(result.regulation.id)}
                          >
                            <Bookmark className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onCopy?.(result.regulation.content)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 상충 규정 경고 */}
              {hasConflicts && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">
                      상충 규정 발견
                    </span>
                  </div>
                  {message.conflicts!.map((conflict, index) => (
                    <div key={index} className="mt-2 text-sm">
                      <div className="font-medium text-amber-900 mb-1">
                        {conflict.conflicting_regulation.title}
                      </div>
                      <div className="text-amber-700 mb-1">
                        충돌 유형: {conflict.conflict_type}
                      </div>
                      <div className="text-amber-600">
                        {conflict.explanation}
                      </div>
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-xs">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        우선 적용: {conflict.priority_resolution}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className={cn(
            "text-xs text-gray-500",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(message.timestamp).toLocaleTimeString('ko-KR')}
          </div>
        </div>
      </div>
    </div>
  );
}