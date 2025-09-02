import { supabase } from '@/supabase/client';
import { Regulation, RegulationSearchResult, ChatMessage, RegulationConflict } from '@/types/규정';

export class RegulationSearchService {
  private static readonly ANTHROPIC_API_ENDPOINT = '/api/claude-search';
  private static readonly MAX_RESULTS = 5;

  static async searchRegulations(query: string, userId?: string): Promise<ChatMessage> {
    try {
      // 1. 데이터베이스에서 기본적인 텍스트 매칭으로 관련 규정 찾기
      const { data: regulations, error: dbError } = await supabase
        .from('regulations')
        .select('*')
        .or(`content.ilike.%${query}%,title.ilike.%${query}%`)
        .limit(this.MAX_RESULTS);

      if (dbError) {
        console.error('Database search error:', dbError);
        throw new Error('규정 검색 중 오류가 발생했습니다.');
      }

      // 2. Claude API를 통한 고급 자연어 처리 및 답변 생성
      const response = await fetch(this.ANTHROPIC_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          regulations: regulations || [],
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Claude API 호출에 실패했습니다.');
      }

      const result = await response.json();

      // 3. 검색 기록 저장 (사용자가 로그인한 경우)
      if (userId) {
        await this.saveSearchHistory(userId, query, (regulations?.length || 0));
      }

      // 4. 상충 규정 검토
      const conflicts = await this.checkConflicts(regulations || []);

      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.answer || '검색 결과를 찾을 수 없습니다.',
        timestamp: new Date().toISOString(),
        regulations: (regulations || []).map(reg => ({
          regulation: reg,
          relevance_score: result.relevanceScores?.[reg.id] || 0.5,
          matched_content: this.extractMatchedContent(reg.content, query),
        })),
        conflicts: conflicts.length > 0 ? conflicts : undefined,
      };

      return chatMessage;
    } catch (error) {
      console.error('Search service error:', error);
      throw error;
    }
  }

  private static async saveSearchHistory(userId: string, query: string, resultsCount: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('search_history')
        .insert({
          user_id: userId,
          query,
          results_count: resultsCount,
        });

      if (error) {
        console.error('Failed to save search history:', error);
      }
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  private static extractMatchedContent(content: string, query: string): string {
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 1);
    const sentences = content.split(/[.!?]/);
    
    // 쿼리 단어가 포함된 문장 찾기
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      if (queryWords.some(word => lowerSentence.includes(word))) {
        return sentence.trim();
      }
    }
    
    // 매칭된 문장이 없으면 첫 번째 문장 반환
    return sentences[0]?.trim() || content.substring(0, 100) + '...';
  }

  private static async checkConflicts(regulations: Regulation[]): Promise<RegulationConflict[]> {
    if (regulations.length < 2) return [];

    const conflicts: RegulationConflict[] = [];

    // 간단한 상충 검사 로직 (실제로는 더 복잡한 로직이 필요)
    for (let i = 0; i < regulations.length; i++) {
      for (let j = i + 1; j < regulations.length; j++) {
        const reg1 = regulations[i];
        const reg2 = regulations[j];

        // 같은 카테고리이면서 다른 수치가 언급되는 경우 상충 가능성 체크
        if (reg1.category === reg2.category && 
            this.hasNumericDifferences(reg1.content, reg2.content)) {
          conflicts.push({
            conflicting_regulation: reg2,
            conflict_type: 'specification_difference',
            priority_resolution: this.determinePriority(reg1, reg2),
            explanation: `${reg1.title}과(와) ${reg2.title} 간에 서로 다른 기준값이 명시되어 있습니다.`,
          });
        }
      }
    }

    return conflicts;
  }

  private static hasNumericDifferences(content1: string, content2: string): boolean {
    const numbers1 = content1.match(/\d+(?:\.\d+)?/g) || [];
    const numbers2 = content2.match(/\d+(?:\.\d+)?/g) || [];
    
    return numbers1.length > 0 && numbers2.length > 0 && 
           !numbers1.some(num => numbers2.includes(num));
  }

  private static determinePriority(reg1: Regulation, reg2: Regulation): string {
    // 우선순위 결정 로직 (priority_level이 높을수록 우선)
    if (reg1.priority_level > reg2.priority_level) {
      return `${reg1.title} (${reg1.source_document})의 규정이 우선 적용됩니다.`;
    } else if (reg2.priority_level > reg1.priority_level) {
      return `${reg2.title} (${reg2.source_document})의 규정이 우선 적용됩니다.`;
    } else {
      return '더 최신 규정을 확인하여 적용하시기 바랍니다.';
    }
  }

  // 북마크 관련 메서드들
  static async addBookmark(userId: string, regulationId: string, note?: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: userId,
        regulation_id: regulationId,
        note,
      });

    if (error) {
      throw new Error('북마크 저장에 실패했습니다.');
    }
  }

  static async removeBookmark(userId: string, regulationId: string): Promise<void> {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, regulation_id: regulationId });

    if (error) {
      throw new Error('북마크 삭제에 실패했습니다.');
    }
  }

  static async getUserBookmarks(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        regulations (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('북마크 조회에 실패했습니다.');
    }

    return data || [];
  }

  // 검색 기록 관련 메서드들
  static async getUserSearchHistory(userId: string, limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('검색 기록 조회에 실패했습니다.');
    }

    return data || [];
  }
}