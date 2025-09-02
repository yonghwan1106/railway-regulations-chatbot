const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔍 Supabase 설정 확인 중...');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MISSING');
console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'OK' : 'MISSING');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testAuth() {
  try {
    console.log('\n🧪 Auth 테스트 시작...');
    
    // 1. 간단한 연결 테스트
    const { data, error } = await supabase.from('regulations').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ 데이터베이스 연결 실패:', error.message);
    } else {
      console.log('✅ 데이터베이스 연결 성공');
    }
    
    // 2. Auth 설정 확인
    console.log('\n🔑 Auth 설정 확인...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Auth 설정 문제:', sessionError.message);
    } else {
      console.log('✅ Auth 설정 정상');
    }
    
    // 3. 회원가입 테스트 (테스트용 이메일)
    console.log('\n📝 회원가입 테스트...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'test123456';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: 'Test User',
          organization: 'Test Company'
        }
      }
    });
    
    if (signUpError) {
      console.error('❌ 회원가입 실패:', signUpError.message);
      
      // 구체적인 에러 분석
      if (signUpError.message.includes('email')) {
        console.log('💡 이메일 관련 문제: Supabase 프로젝트의 Auth 설정을 확인하세요');
      }
      if (signUpError.message.includes('password')) {
        console.log('💡 비밀번호 관련 문제: 비밀번호 정책을 확인하세요');
      }
    } else {
      console.log('✅ 회원가입 성공!');
      console.log('사용자 ID:', signUpData.user?.id);
      console.log('이메일 확인 필요:', !signUpData.user?.email_confirmed_at);
    }
    
  } catch (error) {
    console.error('❌ 테스트 중 오류:', error.message);
  }
}

testAuth();