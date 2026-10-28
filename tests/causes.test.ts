import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { causeOf, sameCause, uniqueById, groupByCause, readAs, type Report, type Tenant } from '../src/lib/kb/causes.ts';

const raw: Report[] = JSON.parse(fs.readFileSync('src/lib/data/reports-4471.json', 'utf8'));
const tenants: Tenant[] = fs.readdirSync('src/lib/data/tenants').map((f) => JSON.parse(fs.readFileSync(`src/lib/data/tenants/${f}`, 'utf8')));
const tenantOf = (r: { tenant: string }) => tenants.find((t) => t.handle === r.tenant);
const reports = uniqueById(raw).filter((r) => r.mergedInto === 4471);

test('overlapping pages count once per ID', () => {
  assert.equal(raw.length, 427);
  assert.equal(reports.length, 412);
  assert.equal(uniqueById([...reports, ...reports]).length, 412);
});

test('causes partition all reports using tenant data, not intake tags', () => {
  const groups = groupByCause(reports, tenantOf);
  assert.deepEqual(groups.map((g) => [g.cause, g.reports.length]), [['parser', 379], ['hint', 33]]);
  assert.equal(groups.reduce((n, g) => n + g.reports.length, 0), 412);
  assert.equal(groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0), 38);
  assert.equal(causeOf(reports.find((r) => r.id === 'R-41230')!, tenantOf({ tenant: 'copper.studio' })), 'hint');
});

test('one-day observations stay under parser without inventing another cause', () => {
  const notes = JSON.parse(fs.readFileSync('src/lib/data/desk-notes.json', 'utf8'));
  assert.deepEqual(groupByCause(reports, tenantOf).map((g) => readAs(g, notes.oneDayMove)), [5, 0]);
});

test('same subject can mean different causes; unknown tenant is not a duplicate', () => {
  const tenant = tenantOf({ tenant: 'alder.physio' });
  assert.equal(sameCause({ channel: 'app' }, tenant, { channel: 'form' }, tenant), false);
  assert.equal(sameCause({ channel: 'app' }, tenant, { channel: 'email' }, tenant), true);
  assert.equal(sameCause({ channel: 'email' }, undefined, { channel: 'email' }, undefined), false);
});
