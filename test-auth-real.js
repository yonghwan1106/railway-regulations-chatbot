const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRealAuth() {
  try {
    console.log('📧 실제 이메일로 회원가입 테스트...');
    
    // Gmail 등 실제 도메인 사용
    const testEmail = 'test.railway@gmail.com';
    const testPassword = 'test123456';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test Railway User',
          organization: 'Test Railway Company'
        }
      }
    });
    
    if (signUpError) {
      console.error('❌ 실제 이메일 회원가입 실패:', signUpError.message);
      console.log('\n🔧 가능한 해결 방법:');
      console.log('1. Supabase 대시보드 → Authentication → Settings');
      console.log('2. "Enable email confirmations" 설정 확인');
      console.log('3. "Allow user signups" 설정 확인');
      console.log('4. Site URL과 Redirect URLs 설정 확인');
      
      // 로그인도 테스트
      console.log('\n🔐 기존 계정 로그인 테스트...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (signInError) {
        console.error('❌ 로그인도 실패:', signInError.message);
      } else {
        console.log('✅ 로그인은 성공! (기존 계정)');
      }
      
    } else {
      console.log('✅ 실제 이메일 회원가입 성공!');
      console.log('사용자 ID:', signUpData.user?.id);
      
      if (!signUpData.user?.email_confirmed_at) {
        console.log('📧 이메일 인증이 필요합니다. 이메일을 확인하세요.');
      }
    }
    
  } catch (error) {
    console.error('❌ 테스트 중 오류:', error.message);
  }
}

testRealAuth();