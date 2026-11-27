const frame = document.querySelector<HTMLIFrameElement>('#player');
const fullscreen = document.querySelector<HTMLButtonElement>('#fullscreen');
const wrap = document.querySelector<HTMLElement>('#workspace');

if (frame && fullscreen && wrap) {
  const loading = document.querySelector<HTMLElement>('#loading')!;
  const error = document.querySelector<HTMLElement>('#player-error')!;
  const timer = window.setTimeout(() => { loading.hidden = true; error.hidden = false; }, 10000);

  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== 'null') return;
    if (event.data?.type !== 'simubox:ready' || event.data?.id !== 'lorenz-attractor') return;
    clearTimeout(timer);
    loading.hidden = true;
    error.hidden = true;
  });
  const ping = () => frame.contentWindow?.postMessage({ type: 'simubox:ping' }, '*');
  frame.addEventListener('load', ping);
  ping();
  frame.addEventListener('error', () => { clearTimeout(timer); loading.hidden = true; error.hidden = false; });

  fullscreen.addEventListener('click', async () => {
    if (document.fullscreenElement === wrap) await document.exitFullscreen();
    else await wrap.requestFullscreen?.();
  });
  document.addEventListener('fullscreenchange', () => {
    const active = document.fullscreenElement === wrap;
    fullscreen.setAttribute('aria-label', active ? 'Exit fullscreen experiment' : 'Enter fullscreen experiment');
    fullscreen.innerHTML = active ? 'Exit fullscreen <span aria-hidden="true">⤡</span>' : 'Fullscreen <span aria-hidden="true">⤢</span>';
  });
}
