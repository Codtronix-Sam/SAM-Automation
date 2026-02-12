# Payments Module — Test Plan

## Executive Summary

This document describes a comprehensive test plan for the Payments module available from the Admin Dashboard (path: /admin/dashboard → Payments). The plan focuses on these core capabilities:

- Add Invoice (happy path)
- Invoice field validation (negative / boundary cases)
- Pay Day selection UI and behavior
- Create invoice with driver-priority rate-card
- Verify payday is applied correctly in the listing

Each scenario includes: title, assumptions (fresh state), preconditions, step-by-step instructions, expected results, success criteria, failure conditions, and relevant edge cases. Use the `tests/seed.spec.js` seed test to initialize the environment before running generated tests.

Target audience: QA engineers, automation generator agents, and developers implementing/maintaining the Payments feature.

File: `specs/payments-plan.md`

---

## Test Data Suggestions

- DSP name: use `testData.dspName` (or a sandbox DSP created specifically for tests).
- Invoice-related values: small integers (1–10), large integers (10000+), zero, negative values, decimals if allowed.
- Driver and depot names: `Saad`, `Amz Express Depot` (use fixtures from existing tests or create test-specific entries).
- User role: Admin with permissions to view/manage payments and create invoices.

Store test-specific data in a fixture or `testData` object and reset state between scenarios when possible.

---

## Global Assumptions

- Tests run against a staging or dev environment pointed to by `process.env.BASE_URL`.
- The seed test `tests/seed.spec.js` will navigate to the base URL and perform any required authentication (or tests will include the login step if not global).
- The running user has Admin permissions and the DSP used in tests exists and is accessible.
- The environment is in a fresh state at the start of each scenario (no leftover invoices from previous runs) or the test will create and then clean up any created invoices.
- Network and backend services required by the Payments module are available and responsive.

---

## Scenario 1 — Add Invoice (Happy Path)

Title: Add Invoice — Happy Path

Assumptions / Starting state:
1. Admin user is logged in and on `Admin Dashboard`.
2. Target DSP exists and is visible via dashboard search.
3. Payments module is reachable via the dashboard panel.

Preconditions:
- Use `tests/seed.spec.js` to reach the dashboard and open the DSP panel.

Steps:
1. From the Admin Dashboard, search and open the target DSP.
2. Click to open the DSP panel and choose `Payments` module.
3. Open the depot: `Amz Express Depot` (or equivalent depot used by tests).
4. Expand the `Payments and Invoices` dropdown.
5. Click `Add Invoice` (or equivalent button/link to open the Add Invoice form).
6. Fill invoice form fields with valid data (example):
   - Name: `Saad`
   - Field1..FieldN: valid positive integers (use test data values), required text fields populated
7. Submit the invoice form by clicking `Save` / `Submit`.
8. Wait for success notification (toast / inline) and refresh/list to locate the new invoice.
9. Open the newly created invoice and verify details match the submitted values.

Expected Results:
- After submitting, a success message appears.
- New invoice appears in the listing with correct values and status (`Pending` / `Created`).
- Details view reflects all values entered in the form.

Success Criteria:
- Invoice visible in list within X seconds (X = timeout your app uses, e.g., 10s).
- All fields in the invoice detail page match the submitted values.
- No error messages during submission.

Failure Conditions:
- Form submission returns validation error for valid data.
- Invoice does not appear in the list within the expected timeout.
- Details page shows incorrect or truncated values.

Edge Cases (also add as separate negative scenarios):
- Very large numeric values (10,000+).
- Special characters in text fields.
- Simultaneous create requests (concurrency) — race conditions.

Notes / Cleanup:
- Delete the created invoice by API or UI at the end of the test to preserve fresh state.

---

## Scenario 2 — Invoice Field Validation (Negative & Boundary Cases)

Title: Invoice Validation — Required fields, boundaries and invalid input

Assumptions / Starting state:
- Admin user logged in and on DSP Payments module.

Preconditions:
- Access to the Add Invoice form.

Test Cases (each should be independent):

Case 2.1: Required fields empty
Steps:
1. Open Add Invoice form.
2. Clear or leave required fields empty (e.g., Name, amount fields).
3. Click Submit.
Expected Results:
- Form displays inline validation messages for required fields.
- No invoice is created.
Success Criteria:
- Validation messages are specific and present for each required field.
Failure Conditions:
- Form submits successfully despite missing required values.

Case 2.2: Invalid numeric inputs (letters, symbols)
Steps:
1. Open Add Invoice form.
2. Enter non-numeric values into numeric fields.
3. Submit.
Expected Results:
- Numeric fields show validation errors or the UI prevents non-numeric input.
- No invoice is created.

Case 2.3: Boundary values (zero, negative, extremely large)
Steps:
1. For each boundary value, open Add Invoice form, set numeric fields to the boundary value, submit.
2. Observe behavior.
Expected Results:
- If zero/negative values are not allowed, validation should block submission with clear messages.
- If large values are allowed, ensure system accepts them without overflow or truncation.

Case 2.4: Missing optional fields
Steps:
1. Leave optional fields empty and submit with required fields only.
Expected Results:
- Submission completes successfully if optional fields are truly optional.

Case 2.5: Duplicate invoice prevention
Steps:
1. Create an invoice with a unique external id/reference.
2. Attempt to create another invoice with the same unique id.
Expected Results:
- System blocks duplicate creation or creates a separate record with visually distinct id and audit info.

Notes:
- Log exact validation messages to ensure they meet product requirements.

---

## Scenario 3 — Pay Day Selection

Title: Pay Day Selection — UI and Behavior

Assumptions:
- Admin is on Payments module and can open depot view.

Preconditions:
- At least one invoice exists for the depot or you can create a new invoice as part of the test.

Steps:
1. Go to Payments module and open depot `Amz Express Depot`.
2. Open `Payments and Invoices` dropdown (or the UI that contains Pay Day selection).
3. Interact with the Pay Day selection control:
   - Choose a pay day option (e.g., `Monday`, `15th of month`, or any UI-specific option).
   - Save or apply selection.
4. Observe UI confirmation (toast / inline message).
5. Refresh or re-open listing to verify payday value persists.
6. Optionally: Create an invoice and verify the selected payday is associated or used in calculations (if applicable).

Expected Results:
- Pay Day selection control accepts input and confirms change.
- The selection persists across page reloads.
- Subsequent invoices or listings reflect the selected payday (if business logic applies).

Success Criteria:
- Change persists and is visible within the listing or the depot settings.
- No errors shown when saving selection.

Failure Conditions:
- Selection does not persist after reload.
- UI displays error on save or selection causes other UI elements to break.

Edge Cases:
- Selecting invalid or unsupported dates (e.g., 31st on a 30-day month) — ensure system normalizes or rejects appropriately.
- Concurrency: two admins changing payday at the same time — confirm last-writer-wins semantics or locking.

---

## Scenario 4 — Create Invoice with Driver-Priority Rate Card

Title: Create Invoice — Driver-Priority Rate Card

Assumptions:
- Driver-priority rate card exists for the depot / DSP and is selectable in the invoice flow.
- Admin has access to rate card selection.

Preconditions:
- Ensure a driver-priority rate card configuration is present; if not, the test should create one via API or precondition step.

Steps:
1. Navigate to Payments module and the depot.
2. Click `Add Invoice`.
3. In the invoice form, select `Driver-Priority Rate Card` as the rate type.
4. Fill other required fields (driver name, amounts, etc.).
5. Submit the invoice.
6. Verify success message and listing entry contains a reference to `Driver-Priority` or shows calculated values according to the rate card.
7. Open invoice detail and verify computed amounts match the expected rate-card calculation.

Expected Results:
- Invoice created successfully and labelled as driver-priority.
- Calculations (if any) reflect the rate-card rules.

Success Criteria:
- Invoice appears and is computable according to rate definitions.
- UI indicates rate-card type in details/listing.

Failure Conditions:
- Rate-card selection ignored and defaulted to another rate.
- Computation mismatches expected results.

Edge Cases:
- Rate card contains conditional rules (time-of-day, surcharges) — validate behavior for different conditions.

---

## Scenario 5 — Verify Payday Is Applied Correctly in Listing

Title: Payday Applied in Listing — Verification

Assumptions:
- There is at least one invoice created with an expected payday value (e.g., created using Scenario 1 or 4).

Preconditions:
- The payday selection was previously set and should be applied to invoices.

Steps:
1. Navigate to Payments module and open the depot listing.
2. Locate invoices created in previous scenarios (by ID or filter for test-created items).
3. For each invoice, open the listing row or detail view and check the payday field.
4. Confirm payday value matches the one selected in Pay Day selection, or that logic used to determine payday (e.g., nearest payday after invoice date) matches product rules.

Expected Results:
- Each invoice shows the correct payday in the listing or detail view.

Success Criteria:
- Payday display matches product's business rules and persisted selection.

Failure Conditions:
- Payday shows incorrect values, or is blank when it should be set.

Edge Cases:
- Invoices created across month boundaries (invoice date at end of month) — confirm payday logic handles month transitions.

---

## Cross-cutting Scenarios & Additional Tests

1. Permissions: Verify that non-admin roles cannot access Add Invoice or Pay Day settings. Attempt operations as a viewer or limited user and confirm appropriate errors/forbidden UI.
2. Performance: Measure response times when loading Payments listing with 1000+ invoices; ensure pagination or lazy-loading behaves correctly.
3. Accessibility: Ensure form controls, error messages and listing rows are navigable by keyboard and labeled for screen readers.
4. Audit & Logging: Verify created/updated invoices have audit metadata (created by, timestamps) visible in UI or available via API.
5. Export/Print/PDF: If the module supports invoice export, verify exported document matches UI values.

---

## Test Execution Notes

- Each scenario should be independent where possible. If independence is not feasible, clearly name data created by tests (prefix with `e2e-` or `auto-`) and delete at the end of the test.
- Use API calls to precondition or clean up data when UI actions are slow or flaky.
- For flaky flows (uploads, PDF renderings), increase retries or use Healer agent to propose timeout/selector improvements.

---

## Where to Save & Next Steps

- The Planner should save this document as: `specs/payments-plan.md` (already created).
- Next: use the Generator agent to convert the scenarios into Playwright test files (one spec per scenario or group similar scenarios). Recommended filenames:
  - `tests/payments.add-invoice.spec.js`
  - `tests/payments.validation.spec.js`
  - `tests/payments.payday.spec.js`
  - `tests/payments.ratecard.spec.js`
  - `tests/payments.listing.spec.js`

- After generation, run tests locally:
```bash
npx playwright test tests/payments.*.spec.js --headed
```

---

## Completion Checklist for QA

- [ ] Seed test `tests/seed.spec.js` present and validated.
- [ ] `specs/payments-plan.md` present (this file).
- [ ] Generator run to convert each scenario into Playwright tests.
- [ ] Tests executed in CI against staging environment.
- [ ] Cleanup automation for created invoices.

---

## Appendix — Quick Prompts for Generator and Healer

Generator prompt (example):
```
Generator: Create Playwright tests from `specs/payments-plan.md`. Use existing fixtures and page objects where possible (AdminDashboardPage, PaymentsPage). Generate separate spec files grouped by scenario. Use the project's style (common `setup(page)` function). Place tests under `tests/` and include comments mapping tests to plan sections.
```

Healer prompt (example):
```
Healer: One or more tests are flaky in `tests/payments.*.spec.js`. Analyze failing traces and propose improvements to selectors and timeouts. Prefer more resilient locators and retry-safe steps.
```

---

_Last updated: ${new Date().toISOString()}_
