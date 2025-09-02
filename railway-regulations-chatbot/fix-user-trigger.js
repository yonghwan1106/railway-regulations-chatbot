const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixUserTrigger() {
  try {
    console.log('🔧 사용자 트리거 문제를 수정하는 중...');
    
    // 1. 기존 트리거 및 함수 제거
    console.log('1️⃣ 기존 트리거 제거 중...');
    await supabase.rpc('exec', {
      sql: 'DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;'
    }).catch(e => console.log('트리거 제거 (무시 가능):', e.message));
    
    await supabase.rpc('exec', {
      sql: 'DROP FUNCTION IF EXISTS handle_new_user();'
    }).catch(e => console.log('함수 제거 (무시 가능):', e.message));
    
    // 2. 새로운 트리거 함수 생성
    console.log('2️⃣ 새로운 트리거 함수 생성 중...');
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, name, organization, role)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
          COALESCE(NEW.raw_user_meta_data->>'organization', ''),
          'engineer'
        );
        
        INSERT INTO public.user_preferences (user_id)
        VALUES (NEW.id);
        
        RETURN NEW;
      EXCEPTION
        WHEN others THEN
          RAISE LOG 'Error in handle_new_user: %', SQLERRM;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    const { error: funcError } = await supabase.rpc('exec', { sql: createFunctionSQL });
    if (funcError) {
      console.error('❌ 함수 생성 실패:', funcError.message);
      throw funcError;
    }
    console.log('✅ 트리거 함수 생성 완료');
    
    // 3. 트리거 재생성
    console.log('3️⃣ 트리거 재생성 중...');
    const createTriggerSQL = `
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;
    
    const { error: triggerError } = await supabase.rpc('exec', { sql: createTriggerSQL });
    if (triggerError) {
      console.error('❌ 트리거 생성 실패:', triggerError.message);
      throw triggerError;
    }
    console.log('✅ 트리거 생성 완료');
    
    // 4. 권한 설정
    console.log('4️⃣ 권한 설정 중...');
    const grantSQL = `
      GRANT USAGE ON SCHEMA public TO anon, authenticated;
      GRANT ALL ON public.profiles TO anon, authenticated;
      GRANT ALL ON public.user_preferences TO anon, authenticated;
    `;
    
    await supabase.rpc('exec', { sql: grantSQL }).catch(e => 
      console.log('권한 설정 (무시 가능):', e.message)
    );
    
    console.log('🎉 트리거 수정 완료! 이제 회원가입이 정상 작동할 것입니다.');
    
  } catch (error) {
    console.error('❌ 트리거 수정 실패:', error.message);
    console.log('\n📝 수동 해결 방법:');
    console.log('1. SignUpForm.tsx에서 이미 수동 프로필 생성 코드를 추가했습니다.');
    console.log('2. 회원가입을 다시 시도해보세요.');
  }
}

// 실행
fixUserTrigger();