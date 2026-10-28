# Reproduce the desk's view

This export originally contained only source files. The added build uses Svelte's server renderer and mdsvex to execute the actual pages and components, including computed tables and the signature-derived desk reference.

```sh
npm ci
npm test
npm run build
python3 -m http.server 8080 --directory rendered
```

Open http://localhost:8080/kb/decisions/0002-dedupe-by-cause/ for the new signed decision. All exported pages are rendered under `rendered/kb/`, preserving their links. The HTML is a static snapshot; interactive controls in the dedupe explorer show their initial state, while its computed test cases are rendered in full. Rebuild after updating data. No GitHub Pages deployment is needed.

The original accepted decision remains unchanged. Decision 0002 replaces it prospectively. Counts are computed from unique report IDs using the supplied tenant-aware cause logic, not intake tags or matching subjects.

Use Node 22. The dependency audit currently reports three low-severity development-only findings through the Svelte plugin's `deepmerge` dependency, with no upstream fix available. This project only builds trusted local source; it does not run a public build or development server.
