# 천안아트네트워크 구현 가이드
**Claude Code + Next.js + Vercel 버전**

---

## 🚀 구현 전략

### 기술 스택 (수정)
```
Frontend: Next.js 14 (React 18)
Styling: Tailwind CSS
State Management: React Context + useState
Data: Mock JSON 데이터
Authentication: Local State (세션 시뮬레이션)
Deployment: Vercel
```

---

## 📁 프로젝트 구조

```
cheonan-art-network/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Card.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Sidebar.jsx
│   └── features/
│       ├── auth/
│       ├── profile/
│       ├── matching/
│       └── messaging/
├── data/
│   ├── mockArtists.js
│   ├── mockCurators.js
│   ├── mockProjects.js
│   └── mockAudience.js
├── pages/
│   ├── index.js (랜딩)
│   ├── login.js
│   ├── register.js
│   ├── dashboard/
│   │   ├── artist.js
│   │   └── curator.js
│   ├── profile/
│   │   └── [id].js
│   ├── projects/
│   │   ├── index.js
│   │   └── [id].js
│   └── matching/
│       └── results.js
├── context/
│   └── AppContext.js
├── utils/
│   └── matchingAlgorithm.js
├── styles/
│   └── globals.css
└── public/
    └── images/
```

---

## 🗃️ 가상 데이터 구조

### 1. Mock Artists 데이터
```javascript
// data/mockArtists.js
export const mockArtists = [
  {
    id: 'artist_001',
    name: '김민수',
    email: 'minsu.kim@email.com',
    profileImage: '/images/artists/artist1.jpg',
    genres: ['painting', 'sculpture'],
    experienceYears: 5,
    workStyle: ['abstract', 'contemporary'],
    location: '천안',
    bio: '추상화와 조각을 통해 현대인의 감정을 표현하는 작가입니다.',
    portfolio: [
      {
        id: 'work_001',
        title: '도시의 리듬',
        imageUrl: '/images/portfolio/work1.jpg',
        description: '도시의 빠른 변화를 추상적으로 표현한 작품',
        year: 2023,
        medium: 'Oil on Canvas',
        size: '100x80cm'
      },
      {
        id: 'work_002', 
        title: '침묵의 소리',
        imageUrl: '/images/portfolio/work2.jpg',
        description: '현대인의 고독을 주제로 한 설치 작품',
        year: 2024,
        medium: 'Mixed Media',
        size: '150x200x100cm'
      }
    ],
    ratings: {
      averageScore: 4.2,
      reviewCount: 15
    },
    awards: [
      '2023 천안미술대전 우수상',
      '2022 충남도전 입선'
    ],
    exhibitions: [
      '2024 천안문화재단 기획전 "새로운 시각"',
      '2023 갤러리 아트스페이스 개인전'
    ],
    availability: {
      startDate: '2025-09-01',
      endDate: '2025-12-31'
    },
    preferredBudget: {
      min: 3000000,
      max: 10000000
    },
    tags: ['실험적', '감성적', '현대적', '도전적']
  },
  {
    id: 'artist_002',
    name: '박지영',
    email: 'jiyoung.park@email.com', 
    profileImage: '/images/artists/artist2.jpg',
    genres: ['music', 'performance'],
    experienceYears: 8,
    workStyle: ['classical', 'fusion'],
    location: '천안',
    bio: '클래식과 국악의 퓨전을 통해 새로운 음악적 경험을 선사합니다.',
    portfolio: [
      {
        id: 'work_003',
        title: '한국의 소리, 세계의 울림',
        imageUrl: '/images/portfolio/work3.jpg',
        description: '국악기와 서양 악기의 협연',
        year: 2024,
        medium: 'Live Performance',
        duration: '45분'
      }
    ],
    ratings: {
      averageScore: 4.8,
      reviewCount: 23
    },
    awards: [
      '2024 천안음악제 대상',
      '2023 충남국악경연대회 금상'
    ],
    exhibitions: [
      '2024 천안아트센터 정기공연',
      '2023 서울국악원 초청공연'
    ],
    availability: {
      startDate: '2025-10-01', 
      endDate: '2026-03-31'
    },
    preferredBudget: {
      min: 5000000,
      max: 15000000  
    },
    tags: ['혁신적', '전통과현대', '감동적', '전문적']
  }
  // ... 더 많은 예술가 데이터
];
```

### 2. Mock Curators 데이터
```javascript
// data/mockCurators.js
export const mockCurators = [
  {
    id: 'curator_001',
    name: '이수진',
    email: 'sujin.lee@cfac.or.kr',
    profileImage: '/images/curators/curator1.jpg',
    organization: '천안문화재단',
    position: '기획팀장',
    experienceYears: 12,
    specialization: ['exhibition', 'cultural_event'],
    bio: '지역 문화 발전과 시민 문화 향유 증진에 힘쓰는 기획자입니다.',
    pastProjects: [
      {
        id: 'project_001',
        title: '2024 천안청년작가전',
        year: 2024,
        budget: '50,000,000원',
        description: '지역 청년 작가들의 작품을 소개하는 기획전',
        participants: 15,
        visitorCount: 3200,
        satisfaction: 4.5
      },
      {
        id: 'project_002',
        title: '천안역사문화축제',
        year: 2023, 
        budget: '200,000,000원',
        description: '천안의 역사와 문화를 체험할 수 있는 대형 축제',
        participants: 50,
        visitorCount: 15000,
        satisfaction: 4.7
      }
    ],
    preferences: {
      preferredGenres: ['painting', 'sculpture', 'installation'],
      preferredStyles: ['contemporary', 'experimental'],
      targetAudience: ['young_adult', 'family'],
      budgetRange: {
        min: 10000000,
        max: 100000000
      }
    },
    ratings: {
      averageScore: 4.6,
      reviewCount: 28
    },
    workingStyle: ['collaborative', 'detail_oriented', 'innovative'],
    tags: ['경험풍부', '소통잘함', '창의적기획', '예산관리우수']
  }
  // ... 더 많은 기획자 데이터  
];
```

### 3. Mock Projects 데이터
```javascript
// data/mockProjects.js
export const mockProjects = [
  {
    id: 'project_001',
    curatorId: 'curator_001',
    title: '2025 천안 신진작가 발굴전',
    description: '천안 지역의 재능 있는 신진 작가들을 발굴하고 지원하는 기획전시입니다. 회화, 조각, 설치미술 등 다양한 장르의 작품을 선보일 예정입니다.',
    genre: 'exhibition',
    categories: ['painting', 'sculpture', 'installation'],
    budget: {
      min: 30000000,
      max: 50000000,
      currency: 'KRW'
    },
    timeline: {
      applicationDeadline: '2025-09-15',
      selectionNotification: '2025-09-30', 
      preparationPeriod: {
        start: '2025-10-01',
        end: '2025-11-30'
      },
      eventPeriod: {
        start: '2025-12-01',
        end: '2025-12-31'
      }
    },
    requirements: {
      experienceLevel: 'beginner_to_intermediate',
      ageRange: { min: 20, max: 40 },
      location: ['천안', '충남', '수도권'],
      portfolioMinimum: 3,
      additionalRequirements: [
        '작품 설명서 제출',
        '작가 인터뷰 참여 가능자',
        '전시 기간 중 작가 토크 참여'
      ]
    },
    venue: {
      name: '천안시립미술관',
      address: '천안시 동남구 문화로 100',
      space: '제1전시실 (200평)',
      facilities: ['조명시설', '보안시설', '작품보관실']
    },
    targetAudience: {
      primary: ['art_lover', 'young_adult'],
      secondary: ['family', 'tourist'],
      expectedVisitors: 2000
    },
    selectionCriteria: [
      { criteria: '작품성', weight: 40 },
      { criteria: '창의성', weight: 25 },
      { criteria: '완성도', weight: 20 },
      { criteria: '전시 적합성', weight: 15 }
    ],
    benefits: [
      '작품 제작비 지원 (작가당 300만원)',
      '도록 제작 및 배포',
      '언론 홍보 지원',
      '작품 판매 수수료 면제',
      '다음 기획전 우선 추천'
    ],
    status: 'recruiting',
    applicantCount: 0,
    maxParticipants: 8,
    tags: ['신진작가', '전시기회', '제작비지원', '판매가능'],
    createdAt: '2025-08-24',
    updatedAt: '2025-08-24'
  }
  // ... 더 많은 프로젝트 데이터
];
```

---

## 🧮 매칭 알고리즘 구현

```javascript
// utils/matchingAlgorithm.js
export function calculateMatchingScore(artist, project, curator, audienceData) {
  let totalScore = 0;
  const weights = {
    basicCompatibility: 0.4,    // 40%
    stylePreference: 0.25,      // 25%
    experienceMatch: 0.2,       // 20% 
    audiencePrediction: 0.15    // 15%
  };

  // 1. 기본 호환성 (40점)
  const basicScore = calculateBasicCompatibility(artist, project);
  
  // 2. 스타일 선호도 매칭 (25점)  
  const styleScore = calculateStyleMatch(artist, curator);
  
  // 3. 경력 수준 적합성 (20점)
  const experienceScore = calculateExperienceMatch(artist, project);
  
  // 4. 예상 관객 반응 (15점)
  const audienceScore = predictAudienceReaction(artist, project, audienceData);

  totalScore = (
    basicScore * weights.basicCompatibility +
    styleScore * weights.stylePreference + 
    experienceScore * weights.experienceMatch +
    audienceScore * weights.audiencePrediction
  );

  return {
    totalScore: Math.round(totalScore),
    breakdown: {
      basicCompatibility: Math.round(basicScore),
      stylePreference: Math.round(styleScore),
      experienceMatch: Math.round(experienceScore), 
      audiencePrediction: Math.round(audienceScore)
    },
    explanation: generateMatchingExplanation(basicScore, styleScore, experienceScore, audienceScore)
  };
}

function calculateBasicCompatibility(artist, project) {
  let score = 0;
  
  // 장르 일치도 (50%)
  const genreMatch = artist.genres.some(genre => 
    project.categories.includes(genre)
  );
  score += genreMatch ? 50 : 0;
  
  // 예산 범위 (25%)
  const budgetFit = (
    artist.preferredBudget.min <= project.budget.max &&
    artist.preferredBudget.max >= project.budget.min
  );
  score += budgetFit ? 25 : 0;
  
  // 일정 가능 (25%)
  const timelineFit = (
    new Date(artist.availability.startDate) <= new Date(project.timeline.preparationPeriod.start) &&
    new Date(artist.availability.endDate) >= new Date(project.timeline.eventPeriod.end)
  );
  score += timelineFit ? 25 : 0;
  
  return score;
}

function calculateStyleMatch(artist, curator) {
  const artistStyles = new Set(artist.workStyle);
  const curatorPreferences = new Set(curator.preferences.preferredStyles);
  
  const intersection = [...artistStyles].filter(style => 
    curatorPreferences.has(style)
  );
  
  const matchRatio = intersection.length / Math.max(artistStyles.size, curatorPreferences.size);
  return matchRatio * 100;
}

function calculateExperienceMatch(artist, project) {
  const artistExp = artist.experienceYears;
  
  switch(project.requirements.experienceLevel) {
    case 'beginner':
      return artistExp <= 3 ? 100 : Math.max(0, 100 - (artistExp - 3) * 20);
    case 'intermediate': 
      return artistExp >= 3 && artistExp <= 8 ? 100 : Math.max(0, 100 - Math.abs(artistExp - 5.5) * 15);
    case 'expert':
      return artistExp >= 8 ? 100 : Math.max(0, artistExp * 12.5);
    case 'beginner_to_intermediate':
      return artistExp <= 8 ? 100 : Math.max(0, 100 - (artistExp - 8) * 15);
    default:
      return 70; // 기본값
  }
}

function predictAudienceReaction(artist, project, audienceData) {
  // 가상의 관객 만족도 예측 로직
  const artistRating = artist.ratings.averageScore;
  const genrePopularity = getGenrePopularity(artist.genres[0], audienceData);
  const locationBonus = artist.location === '천안' ? 10 : 0;
  
  const predictedScore = (
    (artistRating / 5) * 60 +  // 작가 평점을 60점 만점으로 변환
    genrePopularity * 30 +      // 장르 인기도 30점
    locationBonus               // 지역 보너스 10점
  );
  
  return Math.min(100, predictedScore);
}

function getGenrePopularity(genre, audienceData) {
  const popularityMap = {
    'painting': 0.8,
    'sculpture': 0.6,
    'music': 0.9,
    'performance': 0.7,
    'installation': 0.5,
    'digital_art': 0.4
  };
  
  return (popularityMap[genre] || 0.5) * 100;
}

function generateMatchingExplanation(basicScore, styleScore, experienceScore, audienceScore) {
  const explanations = [];
  
  if (basicScore >= 80) {
    explanations.push('프로젝트 기본 요구사항과 완벽하게 일치합니다.');
  } else if (basicScore >= 60) {
    explanations.push('프로젝트 요구사항과 대부분 일치합니다.');
  } else {
    explanations.push('프로젝트 요구사항과 일부 차이가 있습니다.');
  }
  
  if (styleScore >= 70) {
    explanations.push('기획자의 선호 스타일과 잘 맞습니다.');
  } else if (styleScore >= 40) {
    explanations.push('기획자 선호도와 적당히 일치합니다.');
  } else {
    explanations.push('새로운 스타일 도전의 기회가 될 수 있습니다.');
  }
  
  if (experienceScore >= 80) {
    explanations.push('요구되는 경력 수준에 적합합니다.');
  } else {
    explanations.push('경력 수준에 약간의 차이가 있지만 성장 가능성이 있습니다.');
  }
  
  if (audienceScore >= 70) {
    explanations.push('관객들의 높은 만족도가 예상됩니다.');
  } else {
    explanations.push('관객들에게 새로운 경험을 제공할 수 있습니다.');
  }
  
  return explanations.join(' ');
}

// 매칭 결과 생성 함수
export function generateMatchingResults(project, allArtists, curator, audienceData) {
  const results = allArtists.map(artist => {
    const matchingResult = calculateMatchingScore(artist, project, curator, audienceData);
    return {
      artist,
      ...matchingResult
    };
  });
  
  // 점수 순으로 정렬
  return results.sort((a, b) => b.totalScore - a.totalScore);
}
```

---

## 🎨 주요 컴포넌트 구현

### 1. 매칭 결과 카드
```javascript
// components/matching/ArtistMatchCard.jsx
import { Star, MapPin, Calendar, Palette } from 'lucide-react';

export default function ArtistMatchCard({ matchResult, onViewDetails }) {
  const { artist, totalScore, breakdown, explanation } = matchResult;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };
  
  const getScoreText = (score) => {
    if (score >= 80) return '매우 적합';
    if (score >= 60) return '적합';
    return '보통';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={artist.profileImage || '/images/default-profile.jpg'}
            alt={artist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{artist.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {artist.location}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {artist.genres.slice(0, 2).map(genre => (
                <span 
                  key={genre}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* 매칭 점수 */}
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(totalScore)}`}>
            {totalScore}점
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getScoreText(totalScore)}
          </div>
        </div>
      </div>
      
      {/* 작가 정보 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            경력 {artist.experienceYears}년
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
            {artist.ratings.averageScore} ({artist.ratings.reviewCount}리뷰)
          </div>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-2">
          {artist.bio}
        </p>
      </div>
      
      {/* 매칭 상세 점수 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">기본 호환성</div>
          <div className="font-semibold">{breakdown.basicCompatibility}점</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">스타일 매칭</div>
          <div className="font-semibold">{breakdown.stylePreference}점</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">경력 적합성</div>
          <div className="font-semibold">{breakdown.experienceMatch}점</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">관객 반응</div>
          <div className="font-semibold">{breakdown.audiencePrediction}점</div>
        </div>
      </div>
      
      {/* 매칭 설명 */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          💡 {explanation}
        </p>
      </div>
      
      {/* 액션 버튼 */}
      <div className="flex space-x-3">
        <button
          onClick={() => onViewDetails(artist)}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          상세 프로필 보기
        </button>
        <button className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
          협업 제안하기
        </button>
      </div>
    </div>
  );
}
```

---

## 🚀 Claude Code 실행 단계

### 1단계: 프로젝트 초기화
```bash
# Claude Code에서 실행
npx create-next-app@latest cheonan-art-network --tailwind --eslint --app
cd cheonan-art-network
npm install lucide-react
```

### 2단계: 기본 구조 생성
```bash
# 폴더 구조 생성
mkdir -p components/common components/layout components/features data utils context
mkdir -p components/features/auth components/features/profile components/features/matching
mkdir -p app/dashboard app/profile app/projects app/matching
mkdir -p public/images/artists public/images/curators public/images/portfolio
```

### 3단계: 가상 데이터 및 유틸리티 구현
- 위에서 작성한 mockData 파일들을 data 폴더에 생성
- matchingAlgorithm.js를 utils 폴더에 생성
- AppContext.js로 전역 상태 관리 설정

### 4단계: 페이지 구현 순서
1. **랜딩 페이지** (app/page.js)
2. **회원가입/로그인** (app/auth/)
3. **대시보드** (app/dashboard/)
4. **매칭 결과** (app/matching/)
5. **프로필 페이지** (app/profile/)

### 5단계: Vercel 배포
```bash
# Git 초기화 및 푸시
git init
git add .
git commit -m "Initial commit: 천안아트네트워크 프로토타입"
git branch -M main
git remote add origin [GitHub Repository URL]
git push -u origin main

# Vercel CLI로 배포
npm i -g vercel
vercel --prod
```

---

## 📋 구현 체크리스트

### Phase 1: 기본 구조 (1주)
- [ ] Next.js 프로젝트 설정
- [ ] Tailwind CSS 설정
- [ ] 기본 레이아웃 컴포넌트
- [ ] 가상 데이터 구조 완성
- [ ] 라우팅 설정

### Phase 2: 핵심 기능 (2주) 
- [ ] 사용자 인증 시뮬레이션
- [ ] 프로필 페이지 구현
- [ ] 매칭 알고리즘 구현
- [ ] 매칭 결과 페이지
- [ ] 기본 인터랙션

### Phase 3: UI/UX 완성 (1주)
- [ ] 반응형 디자인
- [ ] 로딩 상태 처리  
- [ ] 에러 페이지
- [ ] 애니메이션 효과
- [ ] 접근성 개선

### Phase 4: 배포 및 테스트 (1주)
- [ ] Vercel 배포 설정
- [ ] 성능 최적화
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 테스트
- [ ] 사용자 피드백 수집

**이제 Claude Code로 단계별 구현을 시작해보세요! 어떤 부분부터 시작하시겠습니까?** 🚀