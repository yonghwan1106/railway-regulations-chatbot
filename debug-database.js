const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugDatabase() {
  try {
    console.log('🔍 데이터베이스 상태 확인 중...');
    
    // 1. 테이블 존재 확인
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (tablesError) {
      console.error('테이블 조회 실패:', tablesError);
    } else {
      console.log('📊 존재하는 테이블:', tables.map(t => t.table_name));
    }
    
    // 2. profiles 테이블 확인
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
      
    if (profilesError) {
      console.error('❌ profiles 테이블 오류:', profilesError);
    } else {
      console.log('👤 profiles 데이터:', profiles?.length || 0, '개');
    }
    
    // 3. regulations 테이블 확인
    const { data: regulations, error: regulationsError } = await supabase
      .from('regulations')
      .select('*')
      .limit(3);
      
    if (regulationsError) {
      console.error('❌ regulations 테이블 오류:', regulationsError);
    } else {
      console.log('📋 regulations 데이터:', regulations?.length || 0, '개');
      if (regulations && regulations.length > 0) {
        console.log('첫 번째 규정:', regulations[0].title);
      }
    }
    
    // 4. 트리거 함수 존재 확인
    const { data: functions, error: funcError } = await supabase.rpc('sql_query', {
      query: "SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_name = 'handle_new_user'"
    }).catch(() => {
      // RPC 함수가 없을 수 있으므로 직접 쿼리
      return { data: null, error: 'RPC not available' };
    });
    
    if (funcError && !funcError.includes('RPC not available')) {
      console.error('함수 조회 실패:', funcError);
    } else if (functions) {
      console.log('🔧 handle_new_user 함수:', functions.length > 0 ? '존재함' : '없음');
    }
    
    console.log('✅ 데이터베이스 상태 확인 완료');
    
  } catch (error) {
    console.error('❌ 디버깅 실패:', error.message);
  }
}

debugDatabase();