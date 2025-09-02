@echo off
echo Supabase CLI를 통한 데이터베이스 설정

REM Supabase CLI 설치 확인
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo Supabase CLI가 설치되어 있지 않습니다.
    echo 설치 방법: npm install -g supabase
    pause
    exit /b 1
)

echo 🔗 Supabase 프로젝트에 연결 중...
supabase link --project-ref jwqsizuzywmephkjvatg

echo 📝 데이터베이스 스키마 적용 중...
supabase db push

echo 🎉 설정 완료!
pause