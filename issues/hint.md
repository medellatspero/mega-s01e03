## Problem and scope

**33 unique reports** wrongly merged into source ticket **#4471** belong to `hint`, across 3 tenants, received 2026-04-17 through 2026-09-22. For day-first tenants, booking-v3 prints **MM/DD/YYYY**, but the form interprets the entered date using the tenant's day-first convention. This is a distinct form-hint bug, not the shared parser issue.

## Evidence and reproduction

- Affected tenants: alder.physio (`de-DE`), copper.studio (`es-ES`), pale.harbour (`pt-PT`), all booking-v3, form channel.
- R-41230: copper.studio, form: 6 January became 1 June, even though intake guessed parser.
- R-41241: alder.physio, form: a 6 August booking became 8 June.
- Reproduction to verify in the product: on a day-first booking-v3 form, follow the MM/DD/YYYY hint and type `01/06/2026` intending 6 January. Expected: 6 January; reported interpretation: 1 June.
- Source: `DATE_HINT` and `causeOf` in `src/lib/kb/causes.ts`, joined to tenant settings, over `src/lib/data/reports-4471.json`.

## Counting

Deduplicate overlapping rows by report ID, filter `mergedInto === 4471`, and classify using tenant locale, booking form and channel. Here 18 reports were tagged hint and 15 parser; all 33 belong in this issue. Browser locale and subject are not cause evidence. Together with the parser issue's 379 reports, this accounts for all 412 unique reports exactly once.

## Fix and acceptance

- Correct the field hint to match the tenant-specific form parser, including day-first locales.
- Test the displayed hint and end-to-end form round-trip together, including ambiguous dates. Retain correct behavior for month-first tenants.
- Do not mark this resolved when only the shared parser fix ships.
- Route future matching form reports here by cause, not subject; track received dates separately from merges.

See the signed kb decision: `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`, with the actual rendered view at `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.
