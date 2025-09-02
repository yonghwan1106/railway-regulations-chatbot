'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from './AuthProvider';
import { supabase } from '@/supabase/client';
import { Loader2, UserPlus } from 'lucide-react';

interface SignUpFormProps {
  onToggleMode: () => void;
}

export function SignUpForm({ onToggleMode }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(email, password, {
        name,
        organization,
      });
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // 수동으로 프로필 생성
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name,
            organization: organization || null,
            role: 'engineer'
          });
          
        const { error: prefsError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: data.user.id
          });
          
        if (profileError || prefsError) {
          console.error('Profile creation error:', profileError || prefsError);
        }
        
        setSuccess(true);
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-600">회원가입 완료</CardTitle>
          <CardDescription>
            이메일을 확인하여 계정을 활성화해주세요.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onToggleMode} className="w-full">
            로그인으로 돌아가기
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          회원가입
        </CardTitle>
        <CardDescription>
          철도규정 챗봇 서비스 계정을 생성하세요
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름 *
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              이메일 *
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="organization" className="text-sm font-medium">
              소속 기관
            </label>
            <Input
              id="organization"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="한국철도공사, 한국철도시설공단 등"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호 *
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상의 비밀번호"
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleMode}
              disabled={loading}
            >
              이미 계정이 있으신가요? 로그인
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}