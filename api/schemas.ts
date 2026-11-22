import { z } from 'zod';

const isRealDate = (s: string) => {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(s);
};

export const DateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(isRealDate, { message: 'not a real calendar date' });

export const BookingSchema = z
  .object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    totalprice: z.number(),
    depositpaid: z.boolean(),
    bookingdates: z.object({
      checkin: DateString,
      checkout: DateString,
    }),
    additionalneeds: z.string().optional(),
  })
  .refine((b) => b.bookingdates.checkout > b.bookingdates.checkin, {
    message: 'checkout must be after checkin',
    path: ['bookingdates', 'checkout'],
  });

export const CreateBookingResponseSchema = z.object({
  bookingid: z.number(),
  booking: BookingSchema,
});
