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

  test('partially updates a booking', { tag: '@regression' }, async ({ request }) => {
    const client = new BookingClient(request);
    const bookingData = createBookingData();
    const token = await client.getToken();

    const createResponse = await client.createBooking(bookingData);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = await createResponse.json();

    await test.step('Patch firstname and totalprice', async () => {
      const response = await client.partialUpdateBooking(
        bookingid,
        { firstname: 'Patched', totalprice: 999 },
        token,
      );
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(() => BookingSchema.parse(body)).not.toThrow();
      expect(body.firstname).toBe('Patched');
      expect(body.totalprice).toBe(999);
      expect(body.lastname).toBe(bookingData.lastname);
    });

    await test.step('Clean up', async () => {
      const response = await client.deleteBooking(bookingid, token);
      expect(response.status()).toBe(201);
    });
  });

  test('Filter by firstname and lastname', { tag: '@regression' }, async ({ request }) => {
    const client = new BookingClient(request);
    const bookingData = createBookingData();
    const token = await client.getToken();

    const createResponse = await client.createBooking(bookingData);
    expect(createResponse.status()).toBe(200);
    const { bookingid } = await createResponse.json();

    await test.step('Filter by firstname', async () => {
      const response = await client.getBookingIds({
        firstname: bookingData.firstname,
        lastname: bookingData.lastname,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ bookingid })]));
    });

    await test.step('Clean up', async () => {
      const response = await client.deleteBooking(bookingid, token);
      expect(response.status()).toBe(201);
    });
  });
});
