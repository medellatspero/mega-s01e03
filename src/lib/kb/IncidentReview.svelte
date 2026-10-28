<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { groupByCause, uniqueById, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const parser = groups.find((g) => g.cause === 'parser');
  const hints = groups.find((g) => g.cause === 'hint');
  const tagErrors = groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0);
  const months = [...new Set(merged.map((r) => r.receivedAt.slice(0, 7)))].sort();
</script>

<p>The export contains {reports.length} rows, {unique.length} unique report IDs and {reports.length - unique.length} repeated rows. All {merged.length} unique reports are merged into #4471. Grouping by tenant locale, form and channel yields {groups.length} causes; intake tags disagree on {tagErrors} reports.</p>

<table>
  <thead><tr><th>Problem</th><th>Reports</th><th>Tenants</th><th>Received</th><th>Tracking issue</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr><td>{g.cause}</td><td>{g.reports.length}</td><td>{g.tenants}</td><td>{g.firstSeen} → {g.lastSeen}</td><td><a href={'https://github.com/medellatspero/mega-s01e03/issues/' + (g.cause === 'parser' ? '1' : '2')}>{g.cause === 'parser' ? 'Parser issue' : 'Hint issue'}</a></td></tr>
    {/each}
  </tbody>
</table>

<p>The {parser ? readAs(parser, notes.oneDayMove) : 0} one-day-move reports listed in desk-notes.json remain counted under parser, not as a separate cause. Their symptoms need investigation; the export does not prove a timezone bug. The hint group has {hints ? readAs(hints, notes.oneDayMove) : 0} such reports.</p>

<h3>Reports kept arriving</h3>
<table>
  <thead><tr><th>Received month</th><th>Unique reports</th></tr></thead>
  <tbody>{#each months as month (month)}<tr><td>{month}</td><td>{merged.filter((r) => r.receivedAt.startsWith(month)).length}</td></tr>{/each}</tbody>
</table>
<p>These are received dates, not merge dates. A batch of merges does not mark the start of the incident or show that a fix worked.</p>
