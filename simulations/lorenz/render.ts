import type { State } from './model';

export function renderTrajectory(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, points: State[], latest: State): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = '#0b0d11';
  context.fillRect(0, 0, width, height);
  context.strokeStyle = '#25282d';
  context.lineWidth = 1;
  for (let line = 1; line < 6; line++) {
    context.beginPath();
    context.moveTo(width * line / 6, 0);
    context.lineTo(width * line / 6, height);
    context.moveTo(0, height * line / 6);
    context.lineTo(width, height * line / 6);
    context.stroke();
  }
  const project = (point: State) => ({ x: width / 2 + point.x * width / 58, y: height * .89 - point.z * height / 58 });
  context.strokeStyle = '#efc879';
  context.lineWidth = 1.35;
  context.beginPath();
  points.forEach((point, index) => {
    const position = project(point);
    if (index === 0) context.moveTo(position.x, position.y);
    else context.lineTo(position.x, position.y);
  });
  context.stroke();
  if (points.length) {
    const end = project(latest);
    context.fillStyle = '#f6f3ea';
    context.beginPath();
    context.arc(end.x, end.y, 3, 0, Math.PI * 2);
    context.fill();
  }
}
