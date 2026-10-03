import { test, expect } from '@playwright/test';

test.describe('API Booking', () => {
  const bookingData = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2024-01-01', checkout: '2024-01-10' },
    additionalneeds: 'Breakfast',
  };

  test('full booking lifecycle', async ({ request }) => {
    let token: string;
    let bookingId: number;

    await test.step('Authenticate', async () => {
      const response = await request.post('/auth', {
        data: { username: 'admin', password: 'password123' },
      });
      expect(response.status()).toBe(200);
      token = (await response.json()).token;
    });

    await test.step('Create booking', async () => {
      const response = await request.post('/booking', { data: bookingData });
      expect(response.status()).toBe(200);
      const body = await response.json();
      bookingId = body.bookingid;
      expect(body.booking).toMatchObject(bookingData);
    });

    await test.step('Get booking', async () => {
      const response = await request.get(`/booking/${bookingId}`);
      expect(response.status()).toBe(200);
      expect((await response.json()).firstname).toBe('John');
    });

    await test.step('Update booking', async () => {
      const response = await request.put(`/booking/${bookingId}`, {
        headers: { Cookie: `token=${token}` },
        data: { ...bookingData, firstname: 'Jane', totalprice: 200, additionalneeds: 'Lunch' },
      });
      expect(response.status()).toBe(200);
      expect((await response.json()).firstname).toBe('Jane');
    });

    await test.step('Delete booking', async () => {
      const response = await request.delete(`/booking/${bookingId}`, {
        headers: { Cookie: `token=${token}` },
      });
      expect(response.status()).toBe(201);
    });

    await test.step('Confirm booking deletion', async () => {
      const response = await request.get(`/booking/${bookingId}`);
      expect(response.status()).toBe(404);
    });
  });
});