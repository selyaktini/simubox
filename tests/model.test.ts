import { describe, it, expect } from 'vitest';
import { defaults, derivative, initial, step, validParameters } from '../simulations/lorenz/model';
describe('Lorenz model', () => {
  it('computes the documented derivative', () => expect(derivative({x:1,y:2,z:3}, defaults)).toEqual({x:10,y:23,z: -6}));
  it('integrates a stable small step', () => { const result = step(initial, defaults); expect(result.x).toBeGreaterThan(0); expect(result.y).toBeGreaterThan(0); expect(result.z).toBeGreaterThanOrEqual(0); });
  it('rejects unstable or nonfinite parameters', () => { expect(validParameters({...defaults,dt:0.5})).toBe(false); expect(validParameters({...defaults,rho:NaN})).toBe(false); expect(() => step(initial,{...defaults,dt:0.5})).toThrow(RangeError); });
  it('retains the zero equilibrium', () => expect(step({x:0,y:0,z:0},defaults)).toEqual({x:0,y:0,z:0}));
});
