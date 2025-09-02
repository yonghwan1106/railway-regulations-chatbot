// 사용자 관련 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: 'engineer' | 'government_official' | 'contractor' | 'admin';
  created_at: string;
  last_login: string;
}

export interface UserPreferences {
  user_id: string;
  favorite_regulations: string[];
  search_history_enabled: boolean;
  notification_preferences: {
    regulation_updates: boolean;
    system_announcements: boolean;
  };
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  results_count: number;
  timestamp: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  regulation_id: string;
  note?: string;
  created_at: string;
}