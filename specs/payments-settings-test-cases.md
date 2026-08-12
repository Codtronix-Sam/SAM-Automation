# Payments Settings — Test Cases (Manual + Automated)

Source material: `SAM_Test_Cases - Payments Settings.csv` (73 rows, QA-authored,
with a pass/fail/discussion status column) + a live exploratory walkthrough
(Admin Fee Rate scenarios, a role+driver-override Rate Card, and an end-to-end
invoice for that driver) recorded via `npm run test:e2e:codegen` on
2026-08-04 against staging.

Automation follows the existing POM structure: `pageObjects/SuperAdminSettings.js`
(Admin Fee Rate, Rate Card, General Settings, depot selection) and
`pageObjects/PaymentsPage.js` (Invoicing), exercised from
`tests/superAdminSettings.spec.js` and `tests/payments.spec.js`.

Not every CSV row is automated — only the scenarios that came out of the live
walkthrough, per the "automate the meaningful journey, not every row" scope
agreed with the team. Rows describing UI text/layout only, or a currently
*undefined* behavior (Discussion/On hold/Pending in the CSV), are left manual.

## Legend
- **Automated** — has a POM method + a `test()` block, listed with its number/name.
- **Manual** — worth testing, but not covered by this pass (no locators captured,
  or it depends on a feature not yet built, e.g. invoicing).
- **Skipped (known bug)** — CSV already documents this as broken; not worth a
  flaky assertion against intended-but-unimplemented behavior. Re-add once fixed.

---

## 1. Navigation & Depot Selection

| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 1 | Navigate to Settings → Payments from main menu | — | Manual |
| 2 | All available depots listed in block format | — | Manual (visual layout) |
| 3 | **Selecting a depot loads its Admin Fee Rate / Rate Card / General Settings tabs** | — | **Automated — Test 1**: `selectDepot()` + `navigateToSuperAdminSettings(depotName)`, spec: "Select a depot and land on Admin Payment Settings" |
| 4 | Selected depot name shown read-only | — | Manual |
| 5 | Must return to depot selection to switch depots | — | Manual |

## 2. Admin Fee Rate Tab

### Viewing
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 6 | Cards show name/rate/VAT/rate-after-VAT | Pass | Manual |
| 7 | Pagination works | Pass | Manual |

### Creating
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 8 | Create New opens slide-in with mandatory fields | Pass | Already automated (pre-existing `addAdminRateFee`) |
| 9 | Validation messages on empty required fields | Fail (wrong message for invoicing model) | Skipped (known bug) |
| 10 | VAT toggle makes "after VAT" read-only | Pass | Manual |
| 11 | Only eligible drivers shown per invoicing model | Pass | Manual |
| 12 | **Assigned driver shows "already assigned" indicator** | Fail (can still be reassigned - not actually disabled) | **Automated — Test 5**: `searchAlreadyAssignedDriver()`, documents current (buggy) behavior rather than the intended disabled state |
| 13 | Save persists + success toast | Pass | Already automated (pre-existing `addAdminRateFee`) |
| 14 | Cancel closes without saving | Pass | Manual |

### Editing
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 15 | Edit pre-fills existing details | Pass | Manual |
| 16 | Update prompts confirmation modal | Fail (no confirmation exists) | Skipped (known bug) |
| 17 | Proceed updates rate, future invoices reflect it | On hold (invoices not implemented) | Skipped |
| 18 | **Cancel dismisses edit, returns to list** | No confirmation modal (per CSV) | **Automated — Test 6**: `cancelAdminFeeRateEdit()` |

### Deleting
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 19 | **Delete shows confirmation modal** | Pass | Already automated (pre-existing `deleteAdminRateFee`) |
| 20 | **Delete blocked when a driver is still assigned** | (implied by test 15's bug note) | **Automated — Test 3**: `verifyDeleteBlockedForAssignedAdminFee()` |
| 21 | Proceeding with delete removes + refreshes list | Pass | Already automated (pre-existing `deleteAdminRateFee`, unlink-then-delete path) |

### Copying / Copy to Depot
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 22 | Copy pre-fills with "Copy of -" prefix | Pass | Already automated (pre-existing `copyAdminFeeRate`) |
| 23 | Drivers not pre-selected in copy | Fail (pre-selected but hidden) | Skipped (known bug) |
| 24 | Copy to Depot opens searchable multi-select | Pass | Manual |
| 25 | Selected depots receive copy without drivers | Fail (only one depot saves) | Skipped (known bug) - pre-existing `copyAdminFeeRate` only ever targeted one depot |

### Search & Filter
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 26 | Search filters by name in real-time | Pass | Manual |
| 27 | VAT Status filter [All/Yes/No] | Fail | Skipped (known bug) |

## 3. Rate Card Tab

### Viewing / Search
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 28 | Tile shows name/hours/VAT/rates/deductions/actions | — | Manual |
| 29 | Popovers show role/driver count details | — | Manual |
| 30 | Pagination | — | Manual |
| 31 | Search by name or hours | — | Manual |

### Creating
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 32 | Create New opens slide-in, mandatory fields | Pass | Already automated (pre-existing `addRateCard`) |
| 33 | Validation on empty mandatory fields | Pass | Manual |
| 34 | Rates auto-populate per role, editable individually | Discussion | Skipped |
| 35 | **Drivers added via search + multi-select** | Fail (no search) | **Automated — Test 9**: `addRateCardWithDriverOverride()`, documents the actual search-and-check flow that exists today |
| 36 | Deductions with mandatory fields (name/rate/VAT) | Pass | Already automated (pre-existing `addRateCard`) |
| 37 | Add persists + success toast | Pass | Already automated (pre-existing `addRateCard`) |
| 38 | Driver-level rate priority over role-level in invoices | Pending (needs invoices) | Partially covered — Test 15 uses a driver-specific admin fee, but full priority-in-invoice math is not asserted |
| — | **System rate card creation (via "system" checkbox)** | (not a CSV row - found in walkthrough) | **Automated — Test 7**: `addSystemRateCard()` |
| — | **Role-based rate (e.g. Driver role)** | (not a CSV row) | **Automated — Test 8**: part of `addRateCardWithDriverOverride()` |
| — | **Per-driver rate override on top of role rate** | (not a CSV row) | **Automated — Test 9**: part of `addRateCardWithDriverOverride()` |
| — | **Deduction with role rate + per-driver override** | (not a CSV row) | **Automated — Test 10**: part of `addRateCardWithDriverOverride()` |

### Editing / Deleting / Copying
| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 39 | Edit pre-fills existing data | Pass | Manual |
| 40 | Save prompts confirmation, updates future invoices | No confirmation modal | Skipped (known bug) |
| 41 | Delete shows confirmation modal | Pass | Already automated (pre-existing `deleteRateCard`, currently commented out in spec) |
| 42 | Copy creates duplicate with "Copy -" prefix | — | Already automated (pre-existing `copyRateCard`) |
| 43 | Copy to Depot, multi-select, no driver assignments | — | Manual (pre-existing `copyRateCard` only targets one hardcoded depot) |

## 4. General Settings Tab (zero prior automation - new this pass)

| # | Scenario | CSV Status | Coverage |
|---|---|---|---|
| 44 | Pay Day dropdown lists Sunday–Saturday | Pass | Manual |
| 45 | **Change Pay Day successfully** | Pass | **Automated — Test 11**: `setPayDay(currentDay, newDay)` |
| 46 | Arrears dropdown [1/2/3/4 Week] | Fail (only 1 & 2 week exist) | Skipped (known bug) |
| 47 | "1 Week" selected by default, uneditable | Fail (2 Week is default) | Skipped (known bug) |
| 48 | Pay day/cutoff date text is correct | Fail (dummy text shown) | Skipped (known bug) |
| — | **Change Arrears weeks** | (not a CSV pass/fail row directly - see #46/47) | **Automated — Test 12**: `setArrearsWeeks()`, asserts the value actually changes (doesn't assert which options exist, since that's the known-broken part) |
| 49 | DSP sees Cut-Off Day read-only | Fail (DSP has no settings access at all) | Skipped (needs a DSP-role login, not available) |
| 50 | Super Admin can configure Cut-Off Day | Pass | Manual |
| 51 | **Cut-Off Day auto-calculates as Pay Day − 1** | Pass | **Automated — Test 13**: `getCutOffDayText()` reads the display; does not independently verify the Pay-Day-minus-1 math |
| 52 | Cut-off time locked before deadline | Discussion | Skipped |
| 53 | Cut-off extendable in 30-min intervals after deadline | Discussion | Skipped |
| 54 | Extension popup options (this week/next/all upcoming) | Discussion | Skipped |
| 55 | Changes blocked once Pay Day has passed | Discussion | Skipped |
| 56 | Super Admin uploads past-week invoices, assigns Pay Day | Will be tested once invoicing implemented | Skipped |
| — | **Set NMWR rate and Save** | (not a CSV row) | **Automated — Test 14**: `setNmwrRateAndSave()` |

## 5. Invoicing (out of original CSV scope, but walked through live)

| # | Scenario | Coverage |
|---|---|---|
| — | **Create new invoice: select driver + their admin fee rate** | **Automated — Test 15**: `openAddNewInvoice()` + `selectDriverForNewInvoice()` + `selectAdminFeeForInvoice()` |
| — | **Select the pay week** | **Automated — Test 16**: `selectInvoiceWeek()` |
| — | **Add an income line item (search + quantity)** | **Automated — Test 17**: `addIncomeLineItem()` |
| — | **Assign an existing deduction with an amount** | **Automated — Test 18**: `assignDeductionToInvoice()` — ⚠️ reconstructed from an inconsistent exploratory recording, re-verify against a clean walkthrough before trusting in CI |
| — | **Add a repayment deduction** | **Automated — Test 19**: `addRepaymentDeduction()` |
| — | **Submit "Create Invoice"** | **Automated — Test 20**: `submitCreateInvoice()` |

All six wired together as one `test()` (not independently reachable) in
`tests/payments.spec.js`: "Create a new invoice for a driver with income and
deductions".

---

## Summary

- **20 automated scenarios** this pass, across `SuperAdminSettings.js` (14) and
  `PaymentsPage.js` (6, chained into one invoicing flow).
- **9 CSV rows deliberately skipped** as known/documented product bugs rather
  than asserted against their intended (unimplemented) behavior - re-enable
  once the underlying bug is fixed.
- Everything else in the CSV remains **manual** - either it's a visual/layout
  check, wasn't exercised in the live walkthrough (no reliable locators to
  build from), or depends on a feature (invoicing math, DSP-role login) not
  yet available to automate against.
- Test 18 (deduction assignment) carries a known reliability caveat - flagged
  inline in the code and here.

## Live validation results (2026-08-04)

The suite's normal auth path (`auth/setupAuth.js` storage-state replay) is
currently broken against staging - `POST /api/auth/refresh-token` returns 401
on replay regardless of freshness or worker count, so `npm run test` fails
all 17 tests in this file, old and new alike. This needs separate
investigation before the suite is CI-usable; it is not a defect in this
pass's test code.

To validate the actual test logic despite that, every method below was
exercised directly against staging with a fresh (non-storage-state) login.
Bugs found this way were fixed in the committed code, not worked around:

- **Confirmed passing, fresh-login-verified:** Tests 1, 3, 5, 6, 7, 8, 9, 10
  (test 8-10 additionally confirmed via the `POST /api/rate-card/create`
  response payload, not just UI state), 11, 12, 13, 14, 15, 16, 17.
- **Real bugs found and fixed in existing/new code along the way:**
  - `superAdminSettingsTab` matched stale text ("Payment Settings" vs actual
    "Admin Payment Settings")
  - Depot selection was clicking an unrelated dashboard widget that happened
    to contain matching text - real flow is Active-cell -> "Select Depot"
    button -> option list
  - `cutOffDayText` and `vatCheckbox` were strict-mode violations (matched 2
    elements) - both pre-existing locators, not introduced this pass
  - `driverCheckbox` used a hardcoded `[4]` index that no longer matched the
    actual checkbox count - replaced with a `.last()` scoped to the driver
    search result
  - `confirmYesBtn` targeted a `<li>"yes"` that doesn't exist - the real
    confirmation is a dialog with a "Delete" button
  - `addRateCardWithDriverOverride` was missing a "Select Users" click after
    "Add User" - the button only adds an empty row, it doesn't open the
    picker itself
  - Several test fixtures (depot name, arrears current/new values, invoice
    driver/admin-fee/week/income names) were copied from the original codegen
    recording's *different* depot (`RTW Share Code Tracking Depot`) and
    didn't exist on `Amazon Express Depot`, the depot actually used for
    validation - swapped to real, confirmed-available values
  - Discovered that driver-assignment state on this depot is shared/heavily
    contended (most drivers are already assigned to something); Tests 3 and 5
    were redesigned to use stable existing fixtures instead of creating fresh
    assignments, after an earlier attempt accidentally deleted and had to
    restore the `testData.adminRate.name` fixture rate
- **Not fully verified - genuinely unresolved:** Tests 18, 19, 20 (deduction
  assignment, repayment deduction, final submit). The deduction-picker's
  amount field appears locked/disabled until some additional row-selection
  interaction happens first (unclear which); this matches the reliability
  caveat already called out for Test 18. Needs either more live debugging
  time or a fresh, clean codegen recording of just this sub-flow.
