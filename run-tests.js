#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚄 Railway Regulations Chatbot - Playwright Test Suite');
console.log('=====================================================\n');

const BASE_URL = 'https://railway-regulations-chatbot.vercel.app';

// 테스트 실행 옵션
const testOptions = {
  production: {
    baseURL: BASE_URL,
    headed: false,
    workers: 4
  },
  development: {
    baseURL: 'http://localhost:3000',
    headed: true,
    workers: 1
  }
};

function runCommand(command, description) {
  console.log(`\n▶️ ${description}`);
  console.log(`   Command: ${command}\n`);
  
  try {
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd: __dirname,
      encoding: 'utf8'
    });
    console.log(`✅ ${description} - 완료\n`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} - 실패`);
    console.error(`Error: ${error.message}\n`);
    return null;
  }
}

function main() {
  const args = process.argv.slice(2);
  const environment = args.includes('--dev') ? 'development' : 'production';
  const headed = args.includes('--headed');
  const ui = args.includes('--ui');
  
  console.log(`🎯 테스트 환경: ${environment}`);
  console.log(`🌐 Base URL: ${testOptions[environment].baseURL}`);
  
  if (ui) {
    console.log('🔧 UI 모드로 실행 중...');
    runCommand('npx playwright test --ui', 'Playwright UI 모드 실행');
    return;
  }

  // 기본 테스트 실행
  let command = 'npx playwright test';
  
  if (headed) {
    command += ' --headed';
  }
  
  if (environment === 'development') {
    command += ' --workers=1';
  }

  // 테스트 실행
  const testResult = runCommand(command, '전체 테스트 실행');
  
  if (testResult !== null) {
    console.log('📊 테스트 보고서 생성 중...');
    runCommand('npx playwright show-report', '테스트 보고서 표시');
  }

  console.log('\n🎉 테스트 실행 완료!');
  console.log('\n추가 명령어:');
  console.log('  npm run test:headed  - 브라우저 창을 보면서 테스트');
  console.log('  npm run test:ui      - UI 모드로 테스트');
  console.log('  npm run test:report  - 테스트 보고서 보기');
}

if (require.main === module) {
  main();
}

module.exports = { runCommand, testOptions };