## Problem and scope

**379 unique reports** in source ticket **#4471** belong to `parser`, across 11 tenants, received 2026-04-01 through 2026-10-04. The shared parser reads month first although these tenants write day first. This issue covers app/email and booking-v2 form paths for day-first tenants; booking-v3 form hint reports belong in the separate hint issue.

## Evidence and reproduction

- R-41200: harbour.dental (`en-GB`, booking-v2), app: 7 April became 4 July.
- R-41201: the same tenant and channel, a different subject, reports the reverse swap.
- Reproduction to verify in the product: configure a day-first tenant, submit `07/04/2026` through the shared parser path, and compare the resulting date. Expected: 7 April; reported failure: 4 July.
- Source logic: `src/lib/kb/causes.ts`, `causeOf`, joined to `src/lib/data/tenants/*.json`; input: `src/lib/data/reports-4471.json`.

## Counting

Deduplicate rows by report ID before filtering `mergedInto === 4471`. The whole export has 427 rows but 412 unique reports. Tenant locale/form plus channel determines cause, not browser locale, subject or `meta.intakeTag`. In this group, intake tagged 356 parser and 23 hint; all 379 belong here under the supplied model.

The five IDs in `desk-notes.json` describe a one-day move and remain in this count. They are observations requiring investigation, not proof of a third timezone cause. Do not subtract or count them twice.

## Fix and acceptance

- Make the shared parser respect tenant date conventions; test ambiguous and unambiguous dates across affected locales and channels.
- Reproduce the one-day reports independently before assuming this fix resolves them.
- Verify the fix with regression tests and new received reports, not merge activity or the historical known status.
- Keep booking-v3 hint correction separate; one queued parser fix does not cover both causes.

See the signed kb decision: `src/routes/kb/decisions/0002-dedupe-by-cause/+page.svx`, with the actual rendered view at `rendered/kb/decisions/0002-dedupe-by-cause/index.html`.
