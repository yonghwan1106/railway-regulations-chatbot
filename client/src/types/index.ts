// 규정 관련 타입
export interface Regulation {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  content: string;
  detailed_content: string;
  legal_basis: string;
  effective_date: string;
  keywords: string[];
  related_regulations: string[];
}

// 카테고리 관련 타입
export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
  regulationCount?: number;
}

// 채팅 관련 타입
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  regulations?: Regulation[];
  conflicts?: ConflictInfo[];
  confidence?: number;
}

export interface ConflictInfo {
  regulation1: Regulation;
  regulation2: Regulation;
  conflictType: string;
  description: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatResponse {
  message: string;
  regulations: Regulation[];
  conflicts: ConflictInfo[];
  confidence: number;
  timestamp: string;
  sessionId: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RegulationsResponse {
  regulations: Regulation[];
  pagination: PaginationInfo;
}

// FAQ 관련 타입
export interface FAQ {
  id: number;
  question: string;
  category: string;
  keywords: string[];
}

// 자동완성 관련 타입
export interface AutocompleteItem {
  text: string;
  type: 'title' | 'keyword';
  category: string;
}

// 통계 관련 타입
export interface StatsOverview {
  totalRegulations: number;
  totalCategories: number;
  categoryStats: CategoryStats[];
  recentRegulations: Regulation[];
  lastUpdated: string;
}

export interface CategoryStats {
  id: string;
  name: string;
  count: number;
}