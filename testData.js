// testData.js
const { faker } = require('@faker-js/faker');

module.exports = {
  dspName: 'SAM Onboarding Team',
  filters: {
    customer: 'Amazon',
    customerFilterText: 'Customer Name: Amazon',
    expectedResult: '17 Drivers'
  },
  driver: {
    email: faker.internet.email().toLowerCase(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: '07' + faker.string.numeric(9),
    searchKeyword: 'Demo Driver'
  },
  vehicle: {
    regNum: 'LF21FMR',
  }
};
105645