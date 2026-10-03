import { test, expect } from '@playwright/test';

test.describe('API Booking Negative Tests', () => {
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
        const response = await request.post('/booking', { data: bookingData });
        expect(response.status()).toBe(200);
        bookingId = (await response.json()).bookingid;
    });


    test('Update booking without token', { tag: '@regression' }, async ({ request }) => {

        const response = await request.put(`/booking/${bookingId}`, {
            data: { ...bookingData, firstname: 'Jane', totalprice: 200, additionalneeds: 'Lunch' },
        });
        expect(response.status()).toBe(403);
    })

    test('Delete booking without token', async ({ request }) => {

        const response = await request.delete(`/booking/${bookingId}`);
        expect(response.status()).toBe(403);

    })
    test('Get booking with invalid ID', async ({ request }) => {

        const response = await request.get(`/booking/999999`);
        expect(response.status()).toBe(404);

    })
})
