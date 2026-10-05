import { faker } from '@faker-js/faker';

export function createBookingData() {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    totalprice: faker.number.int({ min: 50, max: 1000 }),
    depositpaid: faker.datatype.boolean(),
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-10',
    },
    additionalneeds: 'Breakfast',
  };
}