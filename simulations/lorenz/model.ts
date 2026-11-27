export interface State { x: number; y: number; z: number }
export interface Parameters { sigma: number; rho: number; beta: number; dt: number }
export const defaults: Parameters = { sigma: 10, rho: 28, beta: 8 / 3, dt: 0.005 };
export const initial: State = { x: 0.1, y: 0, z: 0 };
export function validParameters(p: Parameters): boolean {
  return Number.isFinite(p.sigma) && p.sigma >= 0 && p.sigma <= 30 && Number.isFinite(p.rho) && p.rho >= 0 && p.rho <= 60 && Number.isFinite(p.beta) && p.beta > 0 && p.beta <= 10 && Number.isFinite(p.dt) && p.dt > 0 && p.dt <= 0.01;
}
export function derivative(s: State, p: Parameters): State {
  return { x: p.sigma * (s.y - s.x), y: s.x * (p.rho - s.z) - s.y, z: s.x * s.y - p.beta * s.z };
}
function add(a: State, b: State, scale: number): State { return { x: a.x + b.x * scale, y: a.y + b.y * scale, z: a.z + b.z * scale }; }
export function step(s: State, p: Parameters): State {
  if (!validParameters(p)) throw new RangeError('Lorenz parameters are outside the supported range');
  const k1 = derivative(s, p), k2 = derivative(add(s, k1, p.dt / 2), p), k3 = derivative(add(s, k2, p.dt / 2), p), k4 = derivative(add(s, k3, p.dt), p);
  return { x: s.x + p.dt * (k1.x + 2*k2.x + 2*k3.x + k4.x)/6, y: s.y + p.dt * (k1.y + 2*k2.y + 2*k3.y + k4.y)/6, z: s.z + p.dt * (k1.z + 2*k2.z + 2*k3.z + k4.z)/6 };
}
