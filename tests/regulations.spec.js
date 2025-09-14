import { test, expect } from '@playwright/test';

test.describe('규정 검색 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('카테고리별 규정 검색', async ({ page }) => {
    // 카테고리 필터가 있는지 확인
    const categoryFilter = page.locator('select[name="category"], .category-filter');
    
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('노반편');
      
      // 검색 결과 확인
      await expect(page.locator('.regulation-item, .search-result')).toContainText('노반');
    }
  });

  test('키워드 기반 규정 검색', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="검색"], .search-input');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('곡선반지름');
      await searchInput.press('Enter');
      
      // 검색 결과 확인
      await expect(page.locator('.search-result, .regulation-item')).toContainText('곡선반지름');
    }
  });

  test('규정 상세 정보 표시', async ({ page }) => {
    // 특정 규정 질문
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('고속철도 곡선반지름 기준');
    await sendButton.click();
    
    // 상세 정보 요소들 확인
    const response = page.locator('.chat-message').last();
    await expect(response).toContainText('법적 근거', { timeout: 10000 });
    await expect(response).toContainText('시행일');
    await expect(response).toContainText('키워드');
  });

  test('여러 규정 결과 처리', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('철도 안전');
    await sendButton.click();
    
    // 여러 규정이 반환되는지 확인
    const response = page.locator('.chat-message').last();
    await expect(response).toContainText('관련 규정', { timeout: 10000 });
  });

  test('규정 없음 응답 처리', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('존재하지않는규정xyz123');
    await sendButton.click();
    
    // 규정을 찾을 수 없다는 메시지 확인
    const response = page.locator('.chat-message').last();
    await expect(response).toContainText('찾을 수 없습니다', { timeout: 10000 });
  });

  test('규정 카테고리 표시', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('승강장');
    await sendButton.click();
    
    // 카테고리 정보 확인
    const response = page.locator('.chat-message').last();
    await expect(response).toContainText('건축편', { timeout: 10000 });
  });

  test('규정 ID 및 메타데이터 확인', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('250km/h 고속철도');
    await sendButton.click();
    
    // 규정 ID 또는 참조 번호 확인
    const response = page.locator('.chat-message').last();
    await expect(response).toContainText(/KR-\d+|철도건설규칙/, { timeout: 10000 });
  });
});