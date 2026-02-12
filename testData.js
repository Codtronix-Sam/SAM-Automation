// testData.js
const { faker } = require('@faker-js/faker');

module.exports = {
  dspName: 'For automation',
  filters: {
    customer: 'Amazon',
    customerFilterText: 'Customer Name: Amazon',
    expectedResult: '26 Drivers',
    depotName: 'Amazon Express Depot'
    // ModelName = ''
  },
  driver: {
    email: faker.internet.email().toLowerCase(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: '07' + faker.string.numeric(9),
    searchKeyword: 'Demos Driver'
  },
  vehicle: {
    regNum: 'LF21FMR',
  },
  adminRate: {
    name: "Darren Admin Rate fees",
    fee: 150,
    enableVAT: true,
    model: "invoicing",
    driverName: "Newtree next"
  },

  rateCard: {
    name: 'Delete it',
    name1: "Test rate card for copy",
    hours: 8,
    rate: 50,
    income: 400,
    deductionName: 'Tax Deduction',
    deductionRate: 10
  },

  systemRate: {
    name: 'Additional Pay'
  },

  invoiceData: {
    driverName: 'Import Tester',
    rateTitle: 'Admin fee rate for import tester with VAT',
    status: 'Incorrect',
    date: '28',
    incomeOption: '8 Hour route for import tester - £100',
    expectedIncome: '£100.00',
    expectedDeduction: '£25.20',
    expectedAdminFee: '£13.2',
    expectedNet: '£61.60'
  }
};
105645