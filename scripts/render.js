import { render } from 'svelte/server';
import { mkdir, writeFile } from 'node:fs/promises';

const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
for (const [path, page] of Object.entries(pages)) {
  const route = path.replace('/src/routes', '').replace('/+page.svx', '');
  const { head, body } = render(page.default);
  const dir = `rendered${route}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${body}</body></html>\n`);
  console.log(`Rendered ${route}`);
}
