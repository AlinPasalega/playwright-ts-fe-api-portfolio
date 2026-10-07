import { APIRequestContext } from '@playwright/test';

export class BookingClient {
  constructor(private request: APIRequestContext) {}

  async getToken(username = 'admin', password = 'password123') {
    // POST /auth, return the token string
    const response = await this.request.post('/auth', {
      data: { username, password },
    });
    return (await response.json()).token;
  }

  async createBooking(data: object) {
    return this.request.post('/booking', { data });
  }

  async getBooking(id: number) {
    return this.request.get(`/booking/${id}`);
  }

  async updateBooking(id: number, data: object, token?: string) {
    return this.request.put(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
      data,
    });
  }
  async getBookingIds(params?: Record<string, string>) {
    return this.request.get('/booking', { params });
  }

  async deleteBooking(id: number, token?: string) {
    // DELETE with the Cookie header only if a token is given
    return this.request.delete(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
    });
  }
  async partialUpdateBooking(id: number, data: object, token?: string) {
    return this.request.patch(`/booking/${id}`, {
      headers: token ? { Cookie: `token=${token}` } : {},
      data,
    });
  }
}
