import { writeFile, mkdir } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
import { defaults, initial, step, type State } from '../simulations/lorenz/model.ts';

const output = 'site/public/previews';
await mkdir(output, { recursive: true });

function svg(name: string, description: string, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 440" role="img" aria-labelledby="title desc"><title id="title">${name}</title><desc id="desc">${description}</desc><rect width="720" height="440" fill="#0a0b0f"/><path d="M36 36H684M36 404H684M36 36V404M684 36V404" stroke="#34363c" stroke-width="1"/>${body}</svg>\n`;
}

let state: State = { ...initial };
const points: State[] = [];
for (let index = 0; index < 9800; index++) {
  state = step(state, defaults);
  if (index > 1200 && index % 3 === 0) points.push(state);
}
const lorenzPath = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${(360 + point.x * 9.1).toFixed(1)} ${(372 - point.z * 6.6).toFixed(1)}`).join(' ');
const grid = Array.from({ length: 7 }, (_, index) => {
  const x = 116 + index * 81;
  return `<path d="M${x} 36V404" stroke="#24272d" stroke-width="1"/>`;
}).join('');
await writeFile(`${output}/lorenz.svg`, svg('Lorenz system, computed trajectory', 'Fourth-order Runge–Kutta solution projected onto x and z with sigma 10, rho 28, beta eight thirds.', `${grid}<path d="${lorenzPath}" fill="none" stroke="#efc879" stroke-width="1.35" stroke-opacity=".85"/><text x="54" y="72" fill="#aaa8a1" font-size="13" font-family="monospace">x / z projection</text><text x="54" y="382" fill="#aaa8a1" font-size="12" font-family="monospace">σ 10 · ρ 28 · β 8/3</text>`));

function escape(cx: number, cy: number): number {
  let x = 0, y = 0;
  for (let iteration = 0; iteration < 80; iteration++) {
    const nextX = x * x - y * y + cx;
    y = 2 * x * y + cy;
    x = nextX;
    if (x * x + y * y > 4) return iteration;
  }
  return 80;
}
const colors = [
  [10, 11, 15], [37, 32, 24], [69, 56, 35], [103, 80, 43],
  [148, 113, 59], [194, 152, 84], [228, 186, 112], [241, 211, 153],
];
const pngWidth = 360, pngHeight = 220;
const raw = Buffer.alloc(pngHeight * (pngWidth * 4 + 1));
for (let row = 0; row < pngHeight; row++) {
  for (let column = 0; column < pngWidth; column++) {
    const cx = -2.25 + column * 3.35 / (pngWidth - 1);
    const cy = -1.15 + row * 2.3 / (pngHeight - 1);
    const iterations = escape(cx, cy);
    const color = iterations === 80 ? [8, 9, 12] : colors[Math.min(colors.length - 1, Math.floor(Math.log2(iterations + 1)))];
    const offset = row * (pngWidth * 4 + 1) + 1 + column * 4;
    raw[offset] = color[0]; raw[offset + 1] = color[1]; raw[offset + 2] = color[2]; raw[offset + 3] = 255;
  }
}
function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const label = Buffer.from(type);
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([label, data])));
  return Buffer.concat([length, label, data, checksum]);
}
const header = Buffer.alloc(13);
header.writeUInt32BE(pngWidth, 0); header.writeUInt32BE(pngHeight, 4);
header[8] = 8; header[9] = 6;
await writeFile(`${output}/mandelbrot.png`, Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', header), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)),
]));

const pivot = { x: 360, y: 95 };
const length = 135;
const first = { x: pivot.x + length * Math.sin(0.72), y: pivot.y + length * Math.cos(0.72) };
const second = { x: first.x + length * Math.sin(-1.12), y: first.y + length * Math.cos(-1.12) };
const format = (value: number) => value.toFixed(1);
await writeFile(`${output}/pendulum.svg`, svg('Double pendulum configuration diagram', 'Geometric configuration for two equal-length pendulum arms at fixed angles, not a trajectory or application screenshot.', `<path d="M360 95V390" stroke="#34363c" stroke-dasharray="3 6"/><circle cx="360" cy="95" r="104" fill="none" stroke="#34363c"/><circle cx="${format(first.x)}" cy="${format(first.y)}" r="135" fill="none" stroke="#34363c"/><path d="M360 95L${format(first.x)} ${format(first.y)}L${format(second.x)} ${format(second.y)}" fill="none" stroke="#efc879" stroke-width="4"/><circle cx="360" cy="95" r="8" fill="#f6f3ea"/><circle cx="${format(first.x)}" cy="${format(first.y)}" r="15" fill="#efc879"/><circle cx="${format(second.x)}" cy="${format(second.y)}" r="15" fill="#efc879"/><text x="54" y="72" fill="#aaa8a1" font-size="13" font-family="monospace">two linked arms · fixed configuration</text><text x="54" y="382" fill="#aaa8a1" font-size="12" font-family="monospace">θ₁ = 0.72 rad · θ₂ = −1.12 rad</text>`));
console.log('Generated three deterministic scientific previews.');
