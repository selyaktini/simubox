import { z } from 'zod';
import YAML from 'yaml';

export const categories = ['Mathematics', 'Physics', 'Dynamical systems', 'Computer science', 'Probability and statistics', 'Numerical methods', 'Complex systems', 'Computational science'] as const;
const safePath = /^\/(?!\/)(?!.*(?:^|\/)\.\.?\/)[a-z0-9/_-]+\.html$/;
const author = z.object({ name: z.string().trim().min(1), url: z.url().startsWith('https://').optional() }).strict();
const base = z.object({
  id: z.string().regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/), title: z.string().trim().min(3), summary: z.string().trim().min(20),
  category: z.enum(categories), tags: z.array(z.string().trim().min(2)).min(1), authors: z.array(author).min(1),
  sourceUrl: z.url().startsWith('https://'), sourceCommit: z.string().regex(/^[a-f0-9]{40}$/).optional(),
  license: z.enum(['Pending', 'MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0-only', 'CC-BY-4.0']),
  preview: z.object({ label: z.string().trim().min(1).max(30) }).strict(),
  capabilities: z.array(z.enum(['Canvas 2D', 'WebGL2', 'WebAssembly', 'Workers'])),
  content: z.string().regex(/^[a-z][a-z0-9-]+$/),
}).strict();
export const manifestSchema = z.discriminatedUnion('origin', [
  base.extend({ origin: z.literal('first-party'), status: z.literal('playable'), entryPoint: z.string().regex(safePath) }),
  base.extend({ origin: z.literal('external'), status: z.enum(['candidate', 'verified']), sourceCommit: z.string().regex(/^[a-f0-9]{40}$/), entryPoint: z.never().optional() }),
]);
export type Manifest = z.infer<typeof manifestSchema>;
export function parseManifest(text: string, filename: string): Manifest {
  let raw: unknown;
  try { raw = YAML.parse(text, { uniqueKeys: true }); } catch (error) { throw new Error(`${filename}: invalid YAML: ${String(error)}`); }
  const result = manifestSchema.safeParse(raw);
  if (!result.success) throw new Error(`${filename}: ${result.error.issues.map(i => `${i.path.join('.') || 'manifest'}: ${i.message}`).join('; ')}`);
  return result.data;
}
export function validateCatalogue(items: Manifest[], contentNames: Set<string>): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) throw new Error(`Duplicate simulation id: ${item.id}`);
    seen.add(item.id);
    if (!contentNames.has(item.content)) throw new Error(`${item.id}: missing scientific content ${item.content}.md`);
    if (item.origin === 'external' && item.status === 'verified') throw new Error(`${item.id}: verified external integration requires a reviewed artifact and hosting configuration; candidate status is required for this bootstrap`);
  }
}
export function filterCatalogue(items: Manifest[], query: string, category: string): Manifest[] {
  const q = query.trim().toLocaleLowerCase();
  return items.filter(item => (category === 'all' || item.category === category) && (!q || [item.title, item.summary, item.category, ...item.tags].join(' ').toLocaleLowerCase().includes(q)));
}
