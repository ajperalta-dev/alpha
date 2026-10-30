import { handleApiRequest } from '../api-core.mjs';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const route = url.searchParams.get('route');
    const result = await handleApiRequest({
      method: request.method,
      pathname: route ? `/api/${route}` : url.pathname,
      headers: Object.fromEntries(request.headers),
      body: request.method === 'POST' ? await request.text() : '',
      clientIp: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'vercel',
    });
    return new Response(result.body, { status: result.status, headers: result.headers });
  },
};
