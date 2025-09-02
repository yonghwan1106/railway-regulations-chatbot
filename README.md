# 철도건설규정 AI 챗봇

AI 기반 철도건설규정 통합검색 챗봇으로, 철도건설 설계·검토 실무에서 필요한 규정·근거를 사용자 질의에 맞춰 빠르게 찾아주고, 상충 규정 점검을 지원하는 B2B/B2G 전문 서비스입니다.

## 🎯 주요 기능

- **자연어 규정 질의응답 챗봇**: 복잡한 철도건설 규정을 쉬운 언어로 질문하고 답변 받기
- **상충 규정 자동 검토**: 관련 규정 간 충돌을 자동 감지하고 우선순위 안내
- **규정 데이터 통합 검색**: 여러 문서에 흩어진 규정을 한 번에 검색
- **즐겨찾기 및 검색 기록**: 자주 사용하는 규정과 검색 기록 관리
- **실시간 규정 변경 알림**: 관심 규정의 개정 사항 자동 알림 (예정)

## 🚀 기술 스택

### Frontend
- **Next.js 15**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성을 위한 정적 타입 언어
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트 라이브러리
- **Lucide React**: 아이콘 라이브러리

### Backend & Database
- **Supabase**: PostgreSQL 기반 BaaS (Backend as a Service)
- **Row Level Security (RLS)**: 데이터 보안을 위한 행 레벨 보안
- **실시간 구독**: Supabase Realtime을 통한 실시간 업데이트

### AI & Data Processing
- **Anthropic Claude API**: 자연어 처리 및 규정 검색을 위한 AI 모델
- **@tanstack/react-query**: 서버 상태 관리 및 캐싱
- **Full-text Search**: PostgreSQL 기반 한국어 전문 검색

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   └── claude-search/ # Claude API 통합
│   ├── globals.css        # 전역 스타일
│   └── page.tsx          # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   ├── 규정검색/          # 규정 검색 관련 컴포넌트
│   └── 사용자관리/        # 사용자 관리 컴포넌트
├── services/             # 비즈니스 로직 서비스
├── supabase/            # Supabase 설정 및 스키마
├── types/               # TypeScript 타입 정의
└── utils/              # 유틸리티 함수
```

## 🛠️ 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
git clone <repository-url>
cd railway-regulations-chatbot
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 3. 데이터베이스 설정

Supabase 프로젝트를 생성한 후, `src/supabase/schema.sql` 파일의 내용을 Supabase SQL 편집기에서 실행하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 👥 사용자 페르소나

### 주요 타겟 사용자

1. **설계 엔지니어 (김철수, 32세)**
   - 철도건설 프로젝트 설계 담당
   - 빠르고 정확한 규정 확인 필요

2. **공단 담당자 (박영희, 28세)**
   - 철도공단 소속 검토 담당자
   - 설계 검토 시 규정 준수 확인

3. **중소 설계업체 실무자 (이스타트, 35세)**
   - 제한된 인력으로 다양한 프로젝트 수행
   - 효율적인 규정 검색 도구 필요

## 📊 성능 목표 (KPI)

- **답변 정확도**: 90% 이상
- **평균 응답시간**: 3초 이내
- **반복 사용률**: 60% 이상
- **서비스 가용성**: 99.9% 이상

## 🚀 배포

Vercel을 사용한 배포를 권장합니다:

1. Vercel 계정 연결 및 프로젝트 import
2. 환경 변수 설정 (Vercel Dashboard)
3. 자동 배포 실행

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

---

© 2024 철도건설규정 AI 챗봇. 모든 권리 보유.
