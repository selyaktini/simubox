import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/lab/app.js': ['app.js', 'text/javascript'], '/lab/style.css': ['style.css', 'text/css'] };
const server = createServer(async (req, res) => {
  const file = files[req.url || '/'];
  if (!file) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const body = await readFile(`site/public/lab/${file[0]}`);
    res.writeHead(200, { 'Content-Type': file[1], 'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors http://127.0.0.1:4321", 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch { res.writeHead(500); res.end('Simulation asset unavailable. Run npm run build:sim.'); }
});
server.listen(4322, '127.0.0.1', () => console.log('Simulation origin: http://127.0.0.1:4322'));
