import { readFile, readdir, access } from 'node:fs/promises';
import { parseManifest, validateCatalogue } from '../site/src/lib/catalogue.ts';
const files = (await readdir('simulations/manifests')).filter(x => x.endsWith('.yaml'));
const items = await Promise.all(files.map(async file => parseManifest(await readFile(`simulations/manifests/${file}`, 'utf8'), file)));
const contentNames = new Set((await readdir('site/src/content')).filter(x => x.endsWith('.md')).map(x => x.slice(0, -3)));
validateCatalogue(items, contentNames);
for (const item of items) {
  try { await access(`site/public${item.preview.image}`); } catch { throw new Error(`${item.id}: missing preview ${item.preview.image}`); }
  if (item.origin === 'first-party') {
    try { await access(`site/public${item.entryPoint}`); } catch { throw new Error(`${item.id}: missing entry point ${item.entryPoint}`); }
  }
}
console.log(`Validated ${items.length} simulation manifests and scientific content references.`);
