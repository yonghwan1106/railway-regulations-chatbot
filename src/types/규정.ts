// 규정 관련 타입 정의
export interface Regulation {
  id: string;
  title: string;
  content: string;
  category: string;
  article_number: string;
  source_document: string;
  last_updated: string;
  priority_level: number;
}

export interface RegulationSearchResult {
  regulation: Regulation;
  relevance_score: number;
  matched_content: string;
  conflicts?: RegulationConflict[];
}

export interface RegulationConflict {
  conflicting_regulation: Regulation;
  conflict_type: 'contradiction' | 'superseded' | 'specification_difference';
  priority_resolution: string;
  explanation: string;
}

export interface SearchQuery {
  query: string;
  context?: string;
  user_id?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  regulations?: RegulationSearchResult[];
  conflicts?: RegulationConflict[];
}