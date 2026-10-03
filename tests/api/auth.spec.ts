import { test, expect } from '@playwright/test';


test.describe('API Authentication', () => {
  
    test('returns token for valid credentials', async ({ request }) => {
      const response = await request.post('/auth', {
        data: {
          username: 'admin',
          password: 'password123'
        }
      });
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.token).toBeTruthy();
      expect(typeof responseBody.token).toBe('string');
    });


    test('no token available for invalid credentials', async ({ request }) => {
      const response = await request.post('/auth', {
        data: {
          username: 'admin',
          password: 'wrongpassword'
        }
      });
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.token).toBeUndefined();
      expect(responseBody.reason).toBe('Bad credentials');
    });
});
