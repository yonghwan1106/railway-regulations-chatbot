'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/components/사용자관리/AuthProvider';
import { LoginForm } from '@/components/사용자관리/LoginForm';
import { SignUpForm } from '@/components/사용자관리/SignUpForm';
import { ChatInterface } from '@/components/규정검색/ChatInterface';
import { RegulationSearchService } from '@/services/규정검색Service';
import { Button } from '@/components/ui/button';
import { LogOut, User, BookMarked, History } from 'lucide-react';

function AuthenticatedApp() {
  const { user, signOut } = useAuth();

  const handleSearch = async (query: string) => {
    return await RegulationSearchService.searchRegulations(query, user?.id);
  };

  const handleBookmark = async (regulationId: string) => {
    if (user) {
      try {
        await RegulationSearchService.addBookmark(user.id, regulationId);
        console.log('Bookmark added successfully');
      } catch (error) {
        console.error('Failed to add bookmark:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">철</span>
              </div>
              <span className="font-semibold text-gray-900">철도규정 AI 챗봇</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4 mr-2" />
              검색기록
            </Button>
            <Button variant="ghost" size="sm">
              <BookMarked className="h-4 w-4 mr-2" />
              북마크
            </Button>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Chat Interface */}
      <main className="h-[calc(100vh-64px)]">
        <ChatInterface 
          onSearch={handleSearch}
          onBookmark={handleBookmark}
        />
      </main>
    </div>
  );
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">철</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              철도규정 AI 챗봇
            </h1>
          </div>
          <p className="text-gray-600">
            철도건설 규정을 쉽고 빠르게 검색하는 AI 어시스턴트
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onToggleMode={() => setIsLogin(true)} />
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 철도규정 AI 챗봇. 모든 권리 보유.</p>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <AuthPage />;
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
