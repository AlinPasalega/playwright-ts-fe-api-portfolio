import { z } from 'zod';

const isRealDate = (s: string) => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
};

const DateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(isRealDate, { message: 'not a real calendar date' });

export const AiBookingSchema = z
  .object({
    firstname: z.string().trim().min(1).max(200),
    lastname: z.string().trim().min(1).max(200),
    totalprice: z.number().int().nonnegative().max(1_000_000),
    depositpaid: z.boolean(),
    bookingdates: z.object({ checkin: DateString, checkout: DateString }),
    additionalneeds: z.string().max(1000),
  })
  .refine((b) => b.bookingdates.checkout > b.bookingdates.checkin, {
    message: 'checkout must be after checkin',
    path: ['bookingdates', 'checkout'],
  });

export type AiBooking = z.infer<typeof AiBookingSchema>;

const hasEdgeCase = (b: AiBooking) =>
  /[^\p{ASCII}]/u.test(b.firstname + b.lastname) || // unicode // unicode
  /['-]/.test(b.firstname + b.lastname) || // apostrophe / hyphen
  b.firstname.length + b.lastname.length > 40 || // long name
  b.totalprice === 0 || // price boundary
  b.bookingdates.checkin.endsWith('-02-29') || // leap day
  b.additionalneeds.length > 100; // long text

export function validateBookingList(list: AiBooking[], count: number): AiBooking[] {
  if (list.length !== count) {
    throw new Error(`Expected ${count} bookings, got ${list.length}`);
  }
  const keys = new Set(list.map((b) => `${b.firstname}|${b.lastname}`));
  if (keys.size !== list.length) {
    throw new Error('AI returned duplicate bookings');
  }
  const edgeCases = list.filter(hasEdgeCase).length;
  if (edgeCases < Math.ceil(count / 2)) {
    throw new Error(`Only ${edgeCases}/${count} bookings are real edge cases`);
  }
  return list;
}

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
            'You generate test data. Reply with ONLY a JSON array, no markdown. Each item: {firstname, lastname, totalprice (int >= 0), depositpaid (bool), bookingdates {checkin, checkout} as YYYY-MM-DD real calendar dates with checkout after checkin, additionalneeds}.',
        },
        {
          role: 'user',
          content: `Give exactly ${count} VALID but unusual, all different hotel bookings: unicode names (Romanian diacritics, emoji, CJK), very long names, apostrophes and hyphens, price 0, leap-day dates, long additionalneeds.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`xAI API returned ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const raw = data.choices[0].message.content.replace(/```json|```/g, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`AI did not return valid JSON:\n${raw.slice(0, 500)}`);
  }

  const result = z.array(AiBookingSchema).safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI data failed schema:\n${JSON.stringify(result.error.issues, null, 2)}`);
  }
  return validateBookingList(result.data, count);
}
