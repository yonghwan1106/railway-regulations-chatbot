import { test, expect } from '@playwright/test';

test.describe('Railway Regulations Chatbot', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지 로딩 및 기본 UI 요소 확인', async ({ page }) => {
    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/철도규정 챗봇/);
    
    // 헤더 확인
    await expect(page.locator('h1')).toContainText('철도규정 챗봇');
    
    // 챗봇 입력창 확인
    const messageInput = page.locator('input[placeholder*="질문"]');
    await expect(messageInput).toBeVisible();
    
    // 전송 버튼 확인
    const sendButton = page.locator('button[type="submit"]');
    await expect(sendButton).toBeVisible();
  });

  test('챗봇 기본 대화 기능 테스트', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    // 질문 입력
    await messageInput.fill('고속철도 곡선반지름에 대해 알려주세요');
    await sendButton.click();
    
    // 응답 대기
    await expect(page.locator('.chat-message')).toContainText('고속철도 곡선반지름', { timeout: 10000 });
    
    // 응답 내용 확인
    const response = page.locator('.chat-message').last();
    await expect(response).toContainText('2,500m');
  });

  test('빈 메시지 전송 방지 테스트', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    // 빈 메시지로 전송 시도
    await sendButton.click();
    
    // 에러 메시지 또는 전송 방지 확인
    await expect(messageInput).toBeFocused();
  });

  test('연속 질문 테스트', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    // 첫 번째 질문
    await messageInput.fill('터널 관련 규정');
    await sendButton.click();
    await page.waitForTimeout(2000);
    
    // 두 번째 질문
    await messageInput.fill('승강장 길이');
    await sendButton.click();
    
    // 대화 히스토리 확인
    const messages = page.locator('.chat-message');
    await expect(messages).toHaveCountGreaterThan(2);
  });

  test('로딩 상태 표시 확인', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('테스트 질문');
    await sendButton.click();
    
    // 로딩 인디케이터 확인
    await expect(page.locator('.loading, .spinner, [data-testid="loading"]')).toBeVisible({ timeout: 1000 });
  });

  test('에러 상황 처리 테스트', async ({ page }) => {
    // 네트워크 에러 시뮬레이션
    await page.route('**/api/chat/**', route => route.abort());
    
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('네트워크 에러 테스트');
    await sendButton.click();
    
    // 에러 메시지 확인
    await expect(page.locator('.error-message, .alert-error')).toBeVisible({ timeout: 5000 });
  });

  test('반응형 디자인 테스트 - 모바일', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 모바일에서도 UI 요소들이 적절히 표시되는지 확인
    await expect(page.locator('input[placeholder*="질문"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('키보드 단축키 테스트', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    
    await messageInput.fill('엔터키 전송 테스트');
    await messageInput.press('Enter');
    
    // 메시지 전송 확인
    await expect(page.locator('.chat-message')).toContainText('규정', { timeout: 10000 });
  });
});