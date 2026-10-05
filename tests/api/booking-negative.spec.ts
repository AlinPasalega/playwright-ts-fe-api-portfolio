import { test, expect } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';
import { createBookingData } from '../../api/testData';

test.describe('API Booking Negative Tests', () => {
  let client: BookingClient;
  let bookingId: number;
  let bookingData: ReturnType<typeof createBookingData>;

  test.beforeEach(async ({ request }) => {
    client = new BookingClient(request);
    bookingData = createBookingData();
    const response = await client.createBooking(bookingData);
    expect(response.status()).toBe(200);
    bookingId = (await response.json()).bookingid;
  });

  test('Update booking without token', { tag: '@regression' }, async () => {
    const response = await client.updateBooking(bookingId, {
      ...bookingData,
      firstname: 'Jane',
      totalprice: 200,
      additionalneeds: 'Lunch',
    });
    expect(response.status()).toBe(403);
  });

  test('Delete booking without token', { tag: '@regression' }, async () => {
    const response = await client.deleteBooking(bookingId);
    expect(response.status()).toBe(403);
  });

  test('Get booking with invalid ID', { tag: '@regression' }, async () => {
    const response = await client.getBooking(999999);
    expect(response.status()).toBe(404);
  });
});
