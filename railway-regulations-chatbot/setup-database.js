const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 환경변수 로드
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDatabase() {
  try {
    console.log('🚀 Supabase 데이터베이스 설정을 시작합니다...');
    
    // schema-fixed.sql 파일 읽기
    const schemaPath = path.join(__dirname, 'src', 'supabase', 'schema-fixed.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // SQL을 세미콜론으로 분할하여 개별 쿼리 실행
    const queries = schemaSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);
    
    console.log(`📝 ${queries.length}개의 SQL 쿼리를 실행합니다...`);
    
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.length > 0) {
        console.log(`⏳ 쿼리 ${i + 1}/${queries.length} 실행 중...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: query + ';'
        });
        
        if (error) {
          console.error(`❌ 쿼리 실행 실패:`, error.message);
          // 일부 오류는 무시 (이미 존재하는 테이블 등)
          if (!error.message.includes('already exists')) {
            throw error;
          }
        } else {
          console.log(`✅ 쿼리 ${i + 1} 완료`);
        }
      }
    }
    
    console.log('🎉 데이터베이스 설정이 완료되었습니다!');
    
    // 샘플 데이터 확인
    const { data, error } = await supabase
      .from('regulations')
      .select('count', { count: 'exact' });
      
    if (error) {
      console.error('샘플 데이터 확인 실패:', error);
    } else {
      console.log(`📊 regulations 테이블에 ${data?.length || 0}개의 레코드가 있습니다.`);
    }
    
  } catch (error) {
    console.error('❌ 데이터베이스 설정 실패:', error.message);
    process.exit(1);
  }
}

// 실행
setupDatabase();