import { test as base } from '@playwright/test';
import { BookingClient } from '../api/BookingClient';

type BookingFixtures = {
  client: BookingClient;
  token: string;
  trackBooking: (id: number) => void;
};

export const test = base.extend<BookingFixtures>({
  client: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ client }, use) => {
    await use(await client.getToken());
  },

  trackBooking: async ({ client, token }, use) => {
    const ids: number[] = [];
    await use((id) => ids.push(id));

    // teardown: always runs, even if the test failed
    for (const id of ids) {
      const res = await client.deleteBooking(id, token);
      if (![201, 404, 405].includes(res.status())) {
        console.warn(`Cleanup failed for booking ${id}: ${res.status()}`);
      }
    }
  },
});

export { expect } from '@playwright/test';
