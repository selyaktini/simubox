import { defaults, initial, step, validParameters, type State, type Parameters } from './model';
const canvas = document.querySelector<HTMLCanvasElement>('#plot');
const status = document.querySelector<HTMLElement>('#status');
const toggle = document.querySelector<HTMLButtonElement>('#toggle');
const reset = document.querySelector<HTMLButtonElement>('#reset');
if (!canvas || !status || !toggle || !reset) throw new Error('Simulation controls are missing');
const context = canvas.getContext('2d');
if (!context) { status.textContent = 'Canvas 2D is unavailable in this browser.'; toggle.disabled = true; reset.disabled = true; }
else {
  let parameters: Parameters = { ...defaults }, state: State = { ...initial }, points: State[] = [], running = true, time = 0;
  const controls = ['sigma','rho','beta'] as const;
  for (const key of controls) {
    const input = document.querySelector<HTMLInputElement>(`#${key}`)!;
    const output = document.querySelector<HTMLOutputElement>(`#${key}-value`)!;
    input.addEventListener('input', () => { const candidate = { ...parameters, [key]: Number(input.value) }; if (validParameters(candidate)) { parameters = candidate; output.value = Number(input.value).toFixed(key === 'beta' ? 2 : 1); } });
  }
  toggle.addEventListener('click', () => { running = !running; toggle.textContent = running ? 'Pause' : 'Resume'; status.textContent = `${running ? 'Running' : 'Paused'} · t = ${time.toFixed(1)}`; });
  reset.addEventListener('click', () => { state = { ...initial }; points = []; time = 0; status.textContent = `${running ? 'Running' : 'Paused'} · t = 0.0`; });
  function draw() {
    const width = canvas!.clientWidth, height = canvas!.clientHeight, ratio = Math.min(devicePixelRatio || 1, 2);
    if (canvas!.width !== width*ratio || canvas!.height !== height*ratio) { canvas!.width = width*ratio; canvas!.height = height*ratio; }
    context!.setTransform(ratio,0,0,ratio,0,0);
    context!.fillStyle = '#091216'; context!.fillRect(0,0,width,height);
    context!.strokeStyle = '#234047'; context!.lineWidth = 1;
    for (let i=1;i<4;i++){context!.beginPath();context!.moveTo(0,height*i/4);context!.lineTo(width,height*i/4);context!.stroke();}
    context!.strokeStyle = '#70e0d4'; context!.lineWidth = 1.3; context!.beginPath();
    points.forEach((p,i)=>{ const x=width/2 + p.x*width/55, y=height*.88-p.z*height/57; if(i===0)context!.moveTo(x,y);else context!.lineTo(x,y); }); context!.stroke();
  }
  function frame() {
    if (running) { for(let i=0;i<8;i++){ state=step(state,parameters); if (!Object.values(state).every(Number.isFinite)) { running=false; status!.textContent='Numerical instability detected. Reset to restart.'; break; } points.push(state); if(points.length>7000)points.shift(); time+=parameters.dt; } if(running)status!.textContent=`Running · t = ${time.toFixed(1)}`; }
    draw(); requestAnimationFrame(frame);
  }
  frame();
  window.parent.postMessage({ type: 'simubox:ready', id: 'lorenz-attractor' }, '*');
}
