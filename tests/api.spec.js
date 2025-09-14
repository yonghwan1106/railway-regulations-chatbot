import { test, expect } from '@playwright/test';

test.describe('API 엔드포인트 테스트', () => {
  const baseURL = 'https://railway-regulations-chatbot.vercel.app';

  test('Health Check API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/health`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('OK');
    expect(data.service).toContain('Railway');
  });

  test('Chat Message API', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/chat/message`, {
      data: {
        message: '고속철도 곡선반지름에 대해 알려주세요'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.answer).toContain('곡선반지름');
    expect(data.data.confidence).toBeGreaterThan(0);
  });

  test('Regulations Search API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/regulations/search?category=노반편&page=1&limit=10`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.regulations).toBeDefined();
    expect(data.data.pagination).toBeDefined();
  });

  test('Categories API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/regulations/categories`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('FAQ API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/chat/faq`);
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
  });

  test('빈 메시지 에러 처리', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/chat/message`, {
      data: {
        message: ''
      }
    });
    
    expect(response.status()).toBe(400);
    
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('메시지가 필요');
  });

  test('잘못된 HTTP 메소드 에러', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/chat/message`);
    
    expect(response.status()).toBe(405);
    
    const data = await response.json();
    expect(data.error).toContain('Method not allowed');
  });

  test('CORS 헤더 확인', async ({ request }) => {
    const response = await request.options(`${baseURL}/api/chat/message`);
    
    expect(response.status()).toBe(200);
    expect(response.headers()['access-control-allow-origin']).toBe('*');
    expect(response.headers()['access-control-allow-methods']).toContain('POST');
  });

  test('응답 시간 테스트', async ({ request }) => {
    const startTime = Date.now();
    
    const response = await request.post(`${baseURL}/api/chat/message`, {
      data: {
        message: '테스트 질문'
      }
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(10000); // 10초 이내
  });

  test('Rate Limiting 테스트', async ({ request }) => {
    // 여러 요청을 빠르게 보내서 rate limit 테스트
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        request.post(`${baseURL}/api/chat/message`, {
          data: {
            message: `테스트 메시지 ${i}`
          }
        })
      );
    }
    
    const responses = await Promise.all(promises);
    
    // 대부분의 요청이 성공해야 함
    const successCount = responses.filter(r => r.status() === 200).length;
    expect(successCount).toBeGreaterThan(0);
  });
});