import { defaults, initial, step, validParameters, type State, type Parameters } from './model';
import { renderTrajectory } from './render';

const canvas = document.querySelector<HTMLCanvasElement>('#plot');
const status = document.querySelector<HTMLElement>('#status');
const timeOutput = document.querySelector<HTMLOutputElement>('#time');
const announcement = document.querySelector<HTMLElement>('#announcement');
const toggle = document.querySelector<HTMLButtonElement>('#toggle');
const reset = document.querySelector<HTMLButtonElement>('#reset');

if (!canvas || !status || !timeOutput || !announcement || !toggle || !reset) throw new Error('Lorenz instrument controls are missing');
const context = canvas.getContext('2d');
if (!context) {
  status.textContent = 'Canvas 2D is unavailable in this browser.';
  announcement.textContent = status.textContent;
  toggle.disabled = true;
  reset.disabled = true;
} else {
  let parameters: Parameters = { ...defaults };
  let state: State = { ...initial };
  let points: State[] = [];
  let running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  let time = 0;
  let lastReadout = 0;

  const controls = ['sigma', 'rho', 'beta'] as const;
  const inputs = Object.fromEntries(controls.map(key => [key, document.querySelector<HTMLInputElement>(`#${key}`)!])) as Record<typeof controls[number], HTMLInputElement>;
  const outputs = Object.fromEntries(controls.map(key => [key, document.querySelector<HTMLOutputElement>(`#${key}-value`)!])) as Record<typeof controls[number], HTMLOutputElement>;
  const presets = [...document.querySelectorAll<HTMLButtonElement>('[data-preset]')];

  function updateReadout() {
    status!.textContent = `${running ? 'Running' : 'Paused'} · t = ${time.toFixed(1)}`;
    timeOutput!.value = time.toFixed(1);
  }
  function resetTrajectory() {
    state = { ...initial };
    points = [];
    time = 0;
    updateReadout();
    announcement!.textContent = 'Trajectory reset to the initial state.';
  }
  function setRunning(value: boolean) {
    running = value;
    toggle!.textContent = running ? 'Pause' : 'Resume';
    updateReadout();
    announcement!.textContent = running ? 'Simulation running.' : 'Simulation paused.';
  }
  function applyParameters(next: Parameters, presetName?: string) {
    if (!validParameters(next)) return;
    parameters = next;
    for (const key of controls) {
      inputs[key].value = String(next[key]);
      outputs[key].value = next[key].toFixed(key === 'beta' ? 2 : 1);
    }
    for (const button of presets) button.setAttribute('aria-pressed', String(button.dataset.preset === presetName));
  }

  for (const key of controls) {
    inputs[key].addEventListener('input', () => {
      applyParameters({ ...parameters, [key]: Number(inputs[key].value) });
      announcement!.textContent = `${key} ${outputs[key].value}`;
    });
  }
  toggle.addEventListener('click', () => setRunning(!running));
  reset.addEventListener('click', resetTrajectory);
  for (const button of presets) button.addEventListener('click', () => {
    const next = button.dataset.preset === 'steady' ? { ...defaults, rho: 12 } : { ...defaults };
    applyParameters(next, button.dataset.preset);
    resetTrajectory();
    announcement!.textContent = `${button.textContent} preset selected. Trajectory reset.`;
  });
  window.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.matches('input, button, select, textarea, [contenteditable="true"]')) return;
    if (event.code === 'Space') { event.preventDefault(); setRunning(!running); }
    if (event.key.toLowerCase() === 'r') { event.preventDefault(); resetTrajectory(); }
  });

  function frame(now: number) {
    if (!document.hidden && running) {
      for (let index = 0; index < 8; index++) {
        state = step(state, parameters);
        if (!Object.values(state).every(Number.isFinite)) {
          setRunning(false);
          status!.textContent = 'Numerical instability detected. Reset to restart.';
          announcement!.textContent = status!.textContent;
          break;
        }
        points.push(state);
        if (points.length > 6000) points.shift();
        time += parameters.dt;
      }
      if (now - lastReadout > 200) { updateReadout(); lastReadout = now; }
    }
    if (!document.hidden) renderTrajectory(canvas!, context!, points, state);
    requestAnimationFrame(frame);
  }
  setRunning(running);
  requestAnimationFrame(frame);
}
window.addEventListener('message', event => {
  if (event.source === window.parent && event.data?.type === 'simubox:ping') {
    window.parent.postMessage({ type: 'simubox:ready', id: 'lorenz-attractor' }, '*');
  }
});
window.parent.postMessage({ type: 'simubox:ready', id: 'lorenz-attractor' }, '*');
