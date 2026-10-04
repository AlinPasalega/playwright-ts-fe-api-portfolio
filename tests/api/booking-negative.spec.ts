import { test, expect } from '@playwright/test';
import { BookingClient } from '../../api/BookingClient';

test.describe('API Booking Negative Tests', () => {
    let client: BookingClient
    let bookingId: number;
    const bookingData = {
        firstname: 'Johny',
        lastname: 'Doey',
        totalprice: 155,
        depositpaid: true,
        bookingdates: { checkin: '2024-01-01', checkout: '2024-01-10' },
        additionalneeds: 'Breakfast',
    };
    test.beforeEach(async ({ request }) => {
        client = new BookingClient(request);
        const response = await client.createBooking(bookingData);
        expect(response.status()).toBe(200);
        bookingId = (await response.json()).bookingid;

    });


    test('Update booking without token', { tag: '@regression' }, async ({ }) => {
        const response = await client.updateBooking(bookingId, { ...bookingData, firstname: 'Jane', totalprice: 200, additionalneeds: 'Lunch' });
        expect(response.status()).toBe(403);
    })

    test('Delete booking without token', { tag: '@regression' }, async () => {
        const response = await client.deleteBooking(bookingId);
        expect(response.status()).toBe(403);

    })
    test('Get booking with invalid ID', { tag: '@regression' }, async ({ }) => {

        const response = await client.getBooking(999999);
        expect(response.status()).toBe(404);

    })
})
