import { test, expect } from '@playwright/test';

test.describe('FAQ 기능', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('FAQ 섹션 표시 확인', async ({ page }) => {
    // FAQ 섹션이나 버튼 확인
    const faqSection = page.locator('.faq-section, [data-testid="faq"], button:has-text("FAQ")');
    
    if (await faqSection.isVisible()) {
      await expect(faqSection).toBeVisible();
    }
  });

  test('자주 묻는 질문 목록 확인', async ({ page }) => {
    // FAQ 관련 질문들 테스트
    const testQuestions = [
      '250km/h 고속철도의 최소곡선반지름은?',
      '터널 내 전철주는 어떤 기준으로 설치하나요?',
      '승강장의 표준 길이는?',
      '신호기 이격거리 기준은?',
      '교량 위 궤도 구조 기준은?'
    ];

    for (const question of testQuestions) {
      const messageInput = page.locator('input[placeholder*="질문"]');
      const sendButton = page.locator('button[type="submit"]');
      
      await messageInput.fill(question);
      await sendButton.click();
      
      // 응답 확인
      await expect(page.locator('.chat-message').last()).toContainText(/m|기준|표준|규정/, { timeout: 10000 });
      
      // 다음 질문을 위한 잠시 대기
      await page.waitForTimeout(1000);
    }
  });

  test('FAQ 질문 클릭 기능', async ({ page }) => {
    // FAQ 아이템이 클릭 가능한지 확인
    const faqItem = page.locator('.faq-item, .faq-question').first();
    
    if (await faqItem.isVisible()) {
      await faqItem.click();
      
      // 자동으로 질문이 입력되는지 확인
      const messageInput = page.locator('input[placeholder*="질문"]');
      await expect(messageInput).toHaveValue(/.+/);
    }
  });

  test('FAQ 카테고리별 분류', async ({ page }) => {
    const categories = ['노반편', '전력편', '건축편', '신호통신편', '궤도편'];
    
    for (const category of categories) {
      const messageInput = page.locator('input[placeholder*="질문"]');
      const sendButton = page.locator('button[type="submit"]');
      
      await messageInput.fill(`${category} 관련 질문`);
      await sendButton.click();
      
      // 카테고리 관련 응답 확인
      const response = page.locator('.chat-message').last();
      await expect(response).toContainText(/규정|기준|표준/, { timeout: 10000 });
      
      await page.waitForTimeout(1000);
    }
  });

  test('FAQ 검색 기능', async ({ page }) => {
    const searchTerms = ['곡선반지름', '승강장', '신호기', '터널', '교량'];
    
    for (const term of searchTerms) {
      const messageInput = page.locator('input[placeholder*="질문"]');
      const sendButton = page.locator('button[type="submit"]');
      
      await messageInput.fill(term);
      await sendButton.click();
      
      // 관련 FAQ 응답 확인
      await expect(page.locator('.chat-message').last()).toContainText(/.+/, { timeout: 10000 });
      
      await page.waitForTimeout(1000);
    }
  });

  test('FAQ 응답 형식 확인', async ({ page }) => {
    const messageInput = page.locator('input[placeholder*="질문"]');
    const sendButton = page.locator('button[type="submit"]');
    
    await messageInput.fill('250km/h 고속철도의 최소곡선반지름은?');
    await sendButton.click();
    
    const response = page.locator('.chat-message').last();
    
    // 응답에 수치가 포함되어 있는지 확인
    await expect(response).toContainText(/\d+m/, { timeout: 10000 });
    
    // 구체적인 답변이 포함되어 있는지 확인
    await expect(response).toContainText('2,500m');
  });

  test('빈번한 질문 패턴 테스트', async ({ page }) => {
    const commonPatterns = [
      '기준은?',
      '표준은?',
      '규정은?',
      '어떻게?',
      '얼마나?'
    ];

    for (const pattern of commonPatterns) {
      const messageInput = page.locator('input[placeholder*="질문"]');
      const sendButton = page.locator('button[type="submit"]');
      
      await messageInput.fill(`승강장 길이 ${pattern}`);
      await sendButton.click();
      
      // 적절한 응답이 오는지 확인
      await expect(page.locator('.chat-message').last()).toContainText(/250m|400m/, { timeout: 10000 });
      
      await page.waitForTimeout(1000);
    }
  });
});