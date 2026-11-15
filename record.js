const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const root = __dirname;
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  console.log('Serving on http://127.0.0.1:' + port);

  const videoDir = path.join(root, 'videos');
  fs.rmSync(videoDir, { recursive: true, force: true });
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoDir, size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:' + port + '/index.html', { waitUntil: 'load' });

  await page.waitForFunction(() => document.title === 'DONE', null, { timeout: 300000, polling: 500 });
  console.log('Playback finished (title=DONE)');

  await page.close();
  await context.close();
  await browser.close();
  server.close();

  const file = fs.readdirSync(videoDir).find(f => f.endsWith('.webm'));
  if (!file) throw new Error('No video recorded');
  fs.copyFileSync(path.join(videoDir, file), path.join(root, 'out.webm'));
  console.log('Wrote out.webm');
  process.exit(0);
})().catch(err => {
  console.error(err);
  try { server.close(); } catch (_) {}
  process.exit(1);
});
