// testData.js
const { faker } = require('@faker-js/faker');

module.exports = {
  dspName: 'SAM Onboarding Team',
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
  },

  paymentsSettings: {
    depotName: 'Amazon Express Depot',
    // "Newtree next" is already assigned to a pre-existing admin fee on this depot -
    // used directly for the already-assigned indicator test, no setup needed.
    alreadyAssignedDriverSearchTerm: 'Newtree',
    systemRateCardName: 'Auto system',
    driverOverrideRateCard: {
      name: 'Auto normal DA and User',
      hours: 8,
      roleRate: 100,
      roleIncome: 150,
      // "New next" is confirmed unassigned/available on this depot.
      driverSearchTerm: 'New next',
      driverOverrideRate: 125,
      driverOverrideIncome: 50,
      deductionName: 'Auto deduction 1',
      deductionRoleRate: 10,
      deductionDriverOverrideRate: 12.5
    },
    generalSettings: {
      currentPayDay: 'Tuesday',
      newPayDay: 'Wednesday',
      currentArrears: '2 week',
      newArrears: '1 week',
      nmwrRate: 11.44
    }
  },

  newInvoice: {
    // Values confirmed live against Amazon Express Depot - the original codegen
    // recording used a different depot (RTW Share Code Tracking Depot) where
    // "AAMIR ARIF MALLU" and "Auto normal DA and User" existed; neither does here.
    depotName: 'Amazon Express Depot',
    driverButtonName: 'New next',
    adminFeeButtonName: 'To be deleted',
    // No weekOptionName - selectInvoiceWeek() takes the first available week when
    // this is unset, since the exact list of weeks shifts with the calendar.
    weekOptionName: null,
    incomeSearchTerm: 'Auto system',
    incomeButtonName: 'Auto system',
    incomeQuantity: 2,
    deductionSearchText: 'DE0112',
    deductionAmount: 10,
    repaymentAmount: 10
  },

  importPayments: {
    depotName: 'Amazon Express Depot',
    weekLabel: 'Week 33',
    driverName: 'Joshua Smith',
    sheetAPath: 'fixtures/import-payments/week33-driver-A.xlsx',
    sheetBPath: 'fixtures/import-payments/week33-driver-B.xlsx',
    // Row order on the invoice detail page: incomeRows.0 = Other Pay, incomeRows.1 = Spendify.
    sheetA: { otherPayQty: '10.00', spendifyQty: '10.00', totalIncome: 'Total Income: £550.00' },
    sheetB: { otherPayQty: '10.00', spendifyQty: '20.00', totalIncome: 'Total Income: £1,200.00' }
  }
};
105645