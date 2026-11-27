import { parseManifest, validateCatalogue } from './catalogue';
const manifests = import.meta.glob('../../../simulations/manifests/*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const content = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const scientificContent = Object.fromEntries(Object.entries(content).map(([path, text]) => [path.split('/').pop()!.replace('.md', ''), text]));
export const catalogue = Object.entries(manifests).map(([path, text]) => parseManifest(text, path));
validateCatalogue(catalogue, new Set(Object.keys(scientificContent)));
