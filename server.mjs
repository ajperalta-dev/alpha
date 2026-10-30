import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createServer } from 'node:http';
import { handleApiRequest } from './api-core.mjs';

const production = process.argv.includes('--production');
const port = Number(process.env.PORT || 5176);
const mimeTypes = { '.css': 'text/css', '.html': 'text/html', '.ico': 'image/x-icon', '.jpg': 'image/jpeg', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

let vite;
if (!production) {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 30_000) break;
  }
  return body;
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  if (pathname.startsWith('/api/')) {
    const result = await handleApiRequest({
      method: request.method,
      pathname,
      headers: request.headers,
      body: request.method === 'POST' ? await readBody(request) : '',
      clientIp: request.socket.remoteAddress || 'local',
    });
    response.writeHead(result.status, result.headers);
    return response.end(result.body);
  }
  if (vite) return vite.middlewares(request, response);

  const requested = pathname === '/' ? 'index.html' : pathname.slice(1);
  const resolved = normalize(join(process.cwd(), 'dist', requested));
  const distRoot = normalize(join(process.cwd(), 'dist'));
  const file = resolved.startsWith(distRoot) && existsSync(resolved) ? resolved : join(distRoot, 'index.html');
  response.writeHead(200, { 'Content-Type': `${mimeTypes[extname(file)] || 'application/octet-stream'}; charset=utf-8` });
  createReadStream(file).pipe(response);
});

server.listen(port, '127.0.0.1', () => console.log(`ALPHA running at http://127.0.0.1:${port}`));
