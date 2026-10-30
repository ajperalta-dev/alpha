import { createBooking, calendarConfigured } from './calendar.mjs';

try { process.loadEnvFile?.(); } catch { /* Environment file is optional. */ }

const requests = new Map();
const systemPrompt = `You are ALPHA's website assistant. ALPHA offers data analytics and BI, data engineering and governance, machine learning, generative AI, MLOps, Industry 4.0, strategic Data & AI consulting, and personalized tutoring in Python, SQL, Power BI, data science and AI.
Answer in the user's language (Spanish or English) in 1 to 3 short sentences, at most 55 words. Answer directly without introductions. Ask at most one useful follow-up question. Never invent prices, availability, client results, credentials, guarantees, or capabilities. Use cases describe possible applications, not verified client results. For a quote, exact availability, or project assessment, invite the user to request a session or contact alpha.digital.ia@gmail.com / +34 641 012 046. Do not request sensitive or confidential data.`;

const json = (status, body) => ({ status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });

function parseJson(bodyText = '') {
  if (bodyText.length > 30_000) throw new Error('PAYLOAD_TOO_LARGE');
  return JSON.parse(bodyText || '{}');
}

function rateLimited(key = 'local') {
  const now = Date.now();
  const recent = (requests.get(key) || []).filter(timestamp => now - timestamp < 60_000);
  recent.push(now);
  requests.set(key, recent);
  return recent.length > 12;
}

const config = () => {
  const serverless = Boolean(process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const provider = process.env.AI_PROVIDER || (serverless ? 'openai' : 'ollama');
  return {
    provider,
    ollamaBaseUrl: (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, ''),
    ollamaModel: process.env.OLLAMA_MODEL || 'gemma3:4b',
    openAiFallback: process.env.OPENAI_FALLBACK_ENABLED !== 'false',
  };
};

async function generateWithOllama(input) {
  const { ollamaBaseUrl, ollamaModel } = config();
  const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: ollamaModel, stream: false, keep_alive: '30m', messages: [{ role: 'system', content: systemPrompt }, ...input], options: { temperature: 0.3, num_predict: 110, num_ctx: 2048 } }),
    signal: AbortSignal.timeout(90_000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(`OLLAMA_${response.status}`);
  const message = String(data?.message?.content || '').trim();
  if (!message) throw new Error('EMPTY_OLLAMA_RESPONSE');
  return message;
}

async function generateWithOpenAI(input) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_NOT_CONFIGURED');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-6-luna', instructions: systemPrompt, input, max_output_tokens: 160 }),
    signal: AbortSignal.timeout(30_000),
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 429 && data?.error?.code === 'credit_balance_exhausted') throw new Error('AI_CREDITS_EXHAUSTED');
    throw new Error(`OPENAI_${response.status}`);
  }
  const message = String(data.output_text || data.output?.flatMap(item => item.content || []).find(content => content.type === 'output_text')?.text || '').trim();
  if (!message) throw new Error('EMPTY_OPENAI_RESPONSE');
  return message;
}

async function chat(bodyText) {
  try {
    const body = parseJson(bodyText);
    if (!Array.isArray(body.messages)) return json(400, { error: 'INVALID_MESSAGES' });
    const input = body.messages.slice(-6).map(message => ({ role: message?.role === 'assistant' ? 'assistant' : 'user', content: String(message?.content || '').trim().slice(0, 2_000) })).filter(message => message.content);
    if (!input.length) return json(400, { error: 'EMPTY_MESSAGE' });
    const { provider, openAiFallback } = config();
    let message;
    if (provider === 'openai') message = await generateWithOpenAI(input);
    else {
      try { message = await generateWithOllama(input); }
      catch {
        if (!openAiFallback || !process.env.OPENAI_API_KEY) throw new Error('LOCAL_AI_UNAVAILABLE');
        message = await generateWithOpenAI(input);
      }
    }
    return json(200, { message });
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    if (code === 'PAYLOAD_TOO_LARGE') return json(413, { error: code });
    if (error instanceof SyntaxError) return json(400, { error: 'INVALID_JSON' });
    if (code === 'AI_CREDITS_EXHAUSTED') return json(503, { error: code });
    if (code === 'LOCAL_AI_UNAVAILABLE' || code === 'OPENAI_NOT_CONFIGURED') return json(503, { error: 'AI_UNAVAILABLE' });
    console.error('[Chat endpoint]', code);
    return json(502, { error: 'AI_REQUEST_FAILED' });
  }
}

export async function handleApiRequest({ method = 'GET', pathname, headers = {}, body = '', clientIp = 'local' }) {
  if (pathname === '/api/health') {
    const { provider, ollamaModel, openAiFallback } = config();
    return json(200, { aiConfigured: provider === 'ollama' || Boolean(process.env.OPENAI_API_KEY), provider: provider === 'openai' ? 'openai' : 'ollama', model: provider === 'openai' ? (process.env.OPENAI_MODEL || 'gpt-6-luna') : ollamaModel, fallbackConfigured: openAiFallback && Boolean(process.env.OPENAI_API_KEY) });
  }
  if (pathname === '/api/booking-status') return json(200, { configured: calendarConfigured() });
  if (!['/api/chat', '/api/bookings'].includes(pathname)) return json(404, { error: 'NOT_FOUND' });
  if (method !== 'POST') return json(405, { error: 'METHOD_NOT_ALLOWED' });
  if (rateLimited(clientIp)) return json(429, { error: 'RATE_LIMITED' });
  if (pathname === '/api/chat') return chat(body);

  const origin = headers.origin || headers.Origin;
  const host = headers.host || headers.Host;
  if (origin && host && ![`http://${host}`, `https://${host}`].includes(origin)) return json(403, { error: 'INVALID_ORIGIN' });
  try { return json(200, await createBooking(parseJson(body))); }
  catch (error) {
    const status = error?.status || (error instanceof SyntaxError ? 400 : 502);
    return json(status, { error: error?.status ? error.message : 'CALENDAR_REQUEST_FAILED' });
  }
}
