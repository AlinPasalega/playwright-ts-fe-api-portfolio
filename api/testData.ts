import { faker } from '@faker-js/faker';

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function createBookingData() {
  const checkin = new Date();
  checkin.setUTCHours(0, 0, 0, 0);
  checkin.setUTCDate(checkin.getUTCDate() + faker.number.int({ min: 1, max: 60 }));

  const checkout = new Date(checkin);
  checkout.setUTCDate(checkout.getUTCDate() + faker.number.int({ min: 1, max: 14 }));

  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: isoDate(checkin),
      checkout: isoDate(checkout),
    },
    additionalneeds: faker.lorem.words({ min: 1, max: 4 }),
  };
}
