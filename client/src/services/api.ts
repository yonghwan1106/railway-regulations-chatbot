import axios from 'axios';
import { 
  ApiResponse, 
  ChatResponse, 
  RegulationsResponse, 
  Category, 
  Regulation,
  FAQ,
  AutocompleteItem,
  StatsOverview
} from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (로딩 상태 등을 위해 사용 가능)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    return Promise.reject(error);
  }
);

// 채팅 API
export const chatAPI = {
  // 메시지 전송
  sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>('/chat/message', {
      message,
      sessionId: sessionId || 'default'
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || '채팅 서비스 오류');
  },

  // FAQ 조회
  getFAQ: async (): Promise<FAQ[]> => {
    const response = await apiClient.get<ApiResponse<FAQ[]>>('/chat/faq');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'FAQ 조회 오류');
  },

  // 자동완성 검색
  getAutocomplete: async (query: string): Promise<AutocompleteItem[]> => {
    const response = await apiClient.get<ApiResponse<AutocompleteItem[]>>('/chat/autocomplete', {
      params: { q: query }
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    return [];
  },

  // 채팅 세션 초기화
  resetSession: async (): Promise<void> => {
    await apiClient.post('/chat/reset');
  }
};

// 규정 API
export const regulationsAPI = {
  // 모든 규정 조회
  getRegulations: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<RegulationsResponse> => {
    const response = await apiClient.get<ApiResponse<RegulationsResponse>>('/regulations', {
      params
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || '규정 조회 오류');
  },

  // 특정 규정 상세 조회
  getRegulation: async (id: string): Promise<{ regulation: Regulation; relatedRegulations: Regulation[] }> => {
    const response = await apiClient.get<ApiResponse<{ regulation: Regulation; relatedRegulations: Regulation[] }>>(`/regulations/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || '규정 상세 조회 오류');
  },

  // 카테고리 목록 조회
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/regulations/categories/list');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || '카테고리 조회 오류');
  },

  // 특정 카테고리의 규정 조회
  getRegulationsByCategory: async (categoryId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<RegulationsResponse & { categoryId: string }> => {
    const response = await apiClient.get<ApiResponse<RegulationsResponse & { categoryId: string }>>(`/regulations/category/${categoryId}`, {
      params
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || '카테고리별 규정 조회 오류');
  },

  // 통계 정보 조회
  getStatsOverview: async (): Promise<StatsOverview> => {
    const response = await apiClient.get<ApiResponse<StatsOverview>>('/regulations/stats/overview');
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || '통계 조회 오류');
  }
};

// 일반적인 API 유틸리티
export const apiUtils = {
  // 헬스 체크
  healthCheck: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },

  // 네트워크 상태 확인
  isOnline: (): boolean => {
    return navigator.onLine;
  }
};

export default apiClient;