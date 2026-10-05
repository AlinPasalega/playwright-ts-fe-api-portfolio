import { test, expect } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';
import { BookingSchema, CreateBookingResponseSchema } from '../../api/schemas';
import { createBookingData } from '../../api/testData';

test.describe('API Booking', () => {
  test('full booking lifecycle', { tag: '@smoke' }, async ({ request }) => {
    const client = new BookingClient(request);
    let token: string;
    let bookingId: number;
    const bookingData = createBookingData();

    await test.step('Authenticate', async () => {
      token = await client.getToken();
      expect(token).toBeTruthy();
    });

    await test.step('Create booking', async () => {
      const response = await client.createBooking(bookingData);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(() => CreateBookingResponseSchema.parse(body)).not.toThrow();
      bookingId = body.bookingid;
      expect(body.booking).toMatchObject(bookingData);
    });

    await test.step('Get booking', async () => {
      const response = await client.getBooking(bookingId);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.firstname).toBe(bookingData.firstname);
      expect(() => BookingSchema.parse(body)).not.toThrow();
    });

    await test.step('Update booking', async () => {
      const response = await client.updateBooking(
        bookingId,
        { ...bookingData, firstname: 'Jane', totalprice: 200, additionalneeds: 'Lunch' },
        token,
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.firstname).toBe('Jane');
      expect(() => BookingSchema.parse(body)).not.toThrow();
    });

    await test.step('Delete booking', async () => {
      const response = await client.deleteBooking(bookingId, token);
      expect(response.status()).toBe(201);
    });

    await test.step('Confirm booking deletion', async () => {
      const response = await client.getBooking(bookingId);
      expect(response.status()).toBe(404);
    });
  });
});
