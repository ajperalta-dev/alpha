import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
process.loadEnvFile();
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) throw new Error('Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env first.');
const state = randomBytes(32).toString('hex');
const redirect = 'http://127.0.0.1:5180/oauth/callback';
const scopes = ['https://www.googleapis.com/auth/calendar.events.owned', 'https://www.googleapis.com/auth/calendar.readonly'];
const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, redirect_uri: redirect, response_type: 'code', scope: scopes.join(' '), access_type: 'offline', prompt: 'consent', state, login_hint: 'alpha.digital.ia@gmail.com' });
let processing = false;
const server = createServer(async (req, res) => {
  const incoming = new URL(req.url, redirect);
  if (incoming.pathname !== '/oauth/callback' || incoming.searchParams.get('state') !== state) { res.writeHead(400); res.end('Invalid authorization state.'); return; }
  if (processing) { res.writeHead(409); res.end('Authorization in progress.'); return; }
  processing = true;
  try {
    if (!incoming.searchParams.get('code')) throw new Error('Authorization cancelled.');
    const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', signal: AbortSignal.timeout(20_000), body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, redirect_uri: redirect, code: incoming.searchParams.get('code'), grant_type: 'authorization_code' }) });
    const token = await response.json();
    if (!response.ok || !token.refresh_token) throw new Error('Google did not issue a refresh token.');
    const profile = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', { headers: { Authorization: `Bearer ${token.access_token}` }, signal: AbortSignal.timeout(15_000) });
    const calendar = await profile.json();
    if (!profile.ok || calendar.id?.toLowerCase() !== 'alpha.digital.ia@gmail.com') throw new Error('Use alpha.digital.ia@gmail.com for authorization.');
    const env = readFileSync('.env', 'utf8').replace(/^GOOGLE_REFRESH_TOKEN=.*\r?\n?/gm, '');
    writeFileSync('.env', env.trimEnd() + '\nGOOGLE_REFRESH_TOKEN=' + token.refresh_token + '\n');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Google Calendar conectado. Reinicia el servidor ALPHA. Ya puedes cerrar esta ventana.');
    console.log('Google Calendar authorized for alpha.digital.ia@gmail.com. Token stored in .env.');
  } catch (error) { res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(error.message); }
  finally { server.close(); clearTimeout(expiry); }
});
const expiry = setTimeout(() => { console.error('Authorization expired. Run again.'); server.close(); }, 600_000);
server.listen(5180, '127.0.0.1', () => console.log('Open this URL to authorize Google Calendar:\n' + url));
