import { z } from 'zod';

export const AiBookingSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  totalprice: z.number().int().nonnegative(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
  additionalneeds: z.string(),
});

export type AiBooking = z.infer<typeof AiBookingSchema>;

export async function generateEdgeCaseBookings(count = 5): Promise<AiBooking[]> {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.XAI_MODEL,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content:
            'You generate test data. Reply with ONLY a JSON array, no markdown. Each item: {firstname, lastname, totalprice (int >= 0), depositpaid (bool), bookingdates {checkin, checkout} as YYYY-MM-DD with checkout after checkin, additionalneeds}.',
        },
        {
          role: 'user',
          content: `Give ${count} VALID but unusual hotel bookings: unicode names (Romanian diacritics, emoji, CJK), very long names, apostrophes and hyphens, price 0, leap-day dates, long additionalneeds.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`xAI API returned ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.choices[0].message.content.replace(/```json|```/g, '').trim();
  return z.array(AiBookingSchema).parse(JSON.parse(raw));
}
