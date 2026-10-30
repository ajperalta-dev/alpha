import { handleApiRequest } from '../../api-core.mjs';

export default async request => {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/^\/\.netlify\/functions\/api/, '/api');
  const result = await handleApiRequest({
    method: request.method,
    pathname,
    headers: Object.fromEntries(request.headers),
    body: request.method === 'POST' ? await request.text() : '',
    clientIp: request.headers.get('x-nf-client-connection-ip') || request.headers.get('x-forwarded-for') || 'netlify',
  });
  return new Response(result.body, { status: result.status, headers: result.headers });
};
