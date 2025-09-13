# 🚀 KR-CODE 지능형 가이드 설치 및 실행 가이드

## ⚡ 빠른 실행 (5분 완성)

### 1단계: Claude API 키 준비
1. [Anthropic Console](https://console.anthropic.com/)에서 계정 생성
2. API 키 발급받기
3. API 키를 안전한 곳에 복사해두기

### 2단계: 프로젝트 설정
```bash
# 1. 프로젝트 폴더로 이동
cd railway-regulations-chatbot

# 2. 의존성 설치
npm install
cd server && npm install
cd ../client && npm install

# 3. 서버 환경변수 설정
cd ../server
cp .env.example .env
```

### 3단계: API 키 설정
`server/.env` 파일을 열어 Claude API 키를 입력:
```env
ANTHROPIC_API_KEY=여기에_실제_API_키_입력
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4단계: 실행
```bash
# 루트 폴더에서 실행 (서버+클라이언트 동시 실행)
cd ..
npm run dev
```

### 5단계: 접속
- 웹브라우저에서 http://localhost:3000 접속
- 🎉 완료! AI 챗봇에게 철도 규정을 질문해보세요

## 🔧 상세 설치 가이드

### 시스템 요구사항
- **Node.js**: 16.x 이상
- **npm**: 8.x 이상
- **운영체제**: Windows, macOS, Linux
- **메모리**: 최소 4GB RAM
- **디스크**: 최소 1GB 여유 공간

### 포트 정보
- **Frontend**: 3000 (React)
- **Backend**: 5000 (Express)
- **API 문서**: http://localhost:5000/api/health

### 개별 실행 방법

#### 서버만 실행
```bash
cd server
npm run dev
# 또는 npm start (프로덕션 모드)
```

#### 클라이언트만 실행
```bash
cd client
npm start
```

## 🐛 문제해결

### 일반적인 오류들

#### 1. Claude API 키 오류
```
Error: ANTHROPIC_API_KEY is required
```
**해결방법**: `server/.env` 파일에 올바른 API 키가 설정되었는지 확인

#### 2. 포트 충돌
```
Error: Port 5000 is already in use
```
**해결방법**: 
- 다른 프로그램이 5000번 포트를 사용 중인지 확인
- `.env` 파일에서 다른 포트로 변경

#### 3. 모듈을 찾을 수 없음
```
Module not found: Can't resolve 'react'
```
**해결방법**: 
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS 오류
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked
```
**해결방법**: 서버가 정상적으로 실행되었는지 확인

## 🧪 테스트 방법

### 1. 서버 상태 확인
```bash
curl http://localhost:5000/api/health
```
응답 예시:
```json
{
  "status": "OK",
  "timestamp": "2024-09-13T08:38:00.000Z",
  "service": "Railway Regulations Chatbot API"
}
```

### 2. 샘플 질문 테스트
웹 브라우저에서 다음 질문들을 시도해보세요:
- "250km/h 고속철도 최소곡선반지름은?"
- "터널 내 전철주 설치 간격은?"
- "KTX 승강장 길이는 얼마인가요?"

### 3. API 직접 테스트
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "고속철도 곡선반지름", "sessionId": "test"}'
```

## 📊 성능 모니터링

### 응답 시간 확인
- 정상: 3초 이내
- 느림: 3-10초 (네트워크/API 지연)
- 오류: 10초 이상 (문제 해결 필요)

### 메모리 사용량
- 서버: 약 50-100MB
- 클라이언트: 약 100-200MB

## 🚀 프로덕션 배포

### 1. 빌드 생성
```bash
# 클라이언트 빌드
cd client
npm run build

# 빌드 파일 확인
ls -la build/
```

### 2. 환경변수 설정
```bash
# 프로덕션 환경변수
export NODE_ENV=production
export ANTHROPIC_API_KEY=your_production_api_key
export PORT=80
```

### 3. 서버 실행
```bash
cd server
npm start
```

## 🔒 보안 설정

### API 키 관리
- ❌ **절대 하지 말 것**: API 키를 코드에 직접 입력
- ❌ **절대 하지 말 것**: API 키를 Git에 커밋
- ✅ **권장사항**: 환경변수로 관리
- ✅ **권장사항**: `.env` 파일을 `.gitignore`에 추가

### Rate Limiting
- 현재 설정: 15분당 100회 요청
- 초과 시: 429 에러 응답
- 필요 시 `server/index.js`에서 수정 가능

## 📞 도움이 필요하다면

### 1. 로그 확인
```bash
# 서버 로그
cd server
npm run dev

# 클라이언트 로그
cd client
npm start
```

### 2. 문제 신고
- **이메일**: sanoramyun8@gmail.com
- **연락처**: 010-7939-3123
- **이슈 제목**: [버그] 간단한 문제 설명
- **포함할 정보**: 
  - 운영체제 정보
  - Node.js 버전
  - 오류 메시지 전문
  - 재현 단계

## 🎉 성공적으로 실행되었다면

다음 기능들을 사용해보세요:

1. **💬 AI 채팅**: 자연어로 규정 질문
2. **📚 규정 검색**: 카테고리별 규정 탐색  
3. **ℹ️ 프로젝트 소개**: 상세 기능 및 기대효과 확인

---

**축하합니다! 🎊 KR-CODE 지능형 가이드가 성공적으로 실행되었습니다.**