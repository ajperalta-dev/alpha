import { createHash } from 'node:crypto';
import { DateTime } from 'luxon';

const owner = 'alpha.digital.ia@gmail.com';
const zone = 'Europe/Madrid';
const slots = ['09:30', '10:30', '12:00', '15:00', '16:30', '17:30'];
export const calendarConfigured = () => ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'].every(key => Boolean(process.env[key]));
const fail = (code, status = 502) => Object.assign(new Error(code), { status });

export function bookingEvent(data) {
  if (!data || typeof data !== 'object') throw fail('INVALID_BOOKING', 400);
  const fields = ['fullName', 'email', 'phone', 'company', 'serviceCategory', 'companySize', 'preferredDate', 'preferredTime', 'projectDescription'];
  if (fields.some(key => typeof data[key] !== 'string' || data[key].length > (key === 'projectDescription' ? 3000 : 200))) throw fail('INVALID_BOOKING', 400);
  if (!data.fullName.trim() || !data.serviceCategory.trim() || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) throw fail('INVALID_BOOKING', 400);
  const time = data.preferredTime.split(' ')[0];
  if (!slots.includes(time) || data.preferredTime !== `${time} - ${DateTime.fromFormat(time, 'HH:mm').plus({ minutes: 30 }).toFormat('HH:mm')} Europe/Madrid`) throw fail('INVALID_BOOKING', 400);
  const start = DateTime.fromISO(`${data.preferredDate}T${time}`, { zone });
  const today = DateTime.now().setZone(zone).startOf('day');
  if (!start.isValid || start <= today.plus({ days: 1 }).minus({ milliseconds: 1 }) || start > today.plus({ days: 365 })) throw fail('INVALID_BOOKING', 400);
  const escape = value => value.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  return {
    id: createHash('sha256').update(`${data.email.trim().toLowerCase()}|${start.toISO()}`).digest('hex'),
    summary: `ALPHA · ${data.serviceCategory.trim()} · ${data.fullName.trim()}`,
    description: fields.map(key => `${key}: ${escape(data[key])}`).join('\n'),
    start: { dateTime: start.toISO(), timeZone: zone },
    end: { dateTime: start.plus({ minutes: 30 }).toISO(), timeZone: zone },
    attendees: [{ email: data.email.trim(), displayName: data.fullName.trim() }],
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    visibility: 'private',
  };
}

let pending = Promise.resolve();
export async function createBooking(data) {
  const event = bookingEvent(data);
  if (!calendarConfigured()) throw fail('CALENDAR_NOT_CONFIGURED', 503);
  // Serialize availability + insertion within this server to avoid competing bookings.
  const previous = pending;
  let release;
  pending = new Promise(resolve => { release = resolve; });
  await previous;
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', signal: AbortSignal.timeout(15_000),
      body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, refresh_token: process.env.GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token' }),
    });
    const token = await tokenResponse.json();
    if (!tokenResponse.ok || !token.access_token) throw fail('CALENDAR_AUTH_FAILED', 503);
    const call = async (path, options = {}) => {
      const response = await fetch(`https://www.googleapis.com/calendar/v3/${path}`, { ...options, headers: { Authorization: `Bearer ${token.access_token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000) });
      const body = await response.json();
      return { response, body };
    };
    const calendar = await call('calendars/primary');
    if (!calendar.response.ok || calendar.body.id?.toLowerCase() !== owner) throw fail('CALENDAR_WRONG_ACCOUNT', 503);
    const path = `calendars/${encodeURIComponent(owner)}/events`;
    const existing = await call(`${path}/${event.id}`);
    if (existing.response.ok && existing.body.status !== 'cancelled') return { eventId: event.id, alreadyCreated: true };
    if (existing.response.status !== 404 && existing.response.status !== 410) throw fail('CALENDAR_REQUEST_FAILED');
    const availability = await call('freeBusy', { method: 'POST', body: JSON.stringify({ timeMin: event.start.dateTime, timeMax: event.end.dateTime, items: [{ id: owner }] }) });
    const schedule = availability.body.calendars?.[owner];
    if (!availability.response.ok || !schedule || schedule.errors?.length) throw fail('CALENDAR_REQUEST_FAILED');
    if (schedule.busy?.length) throw fail('SLOT_UNAVAILABLE', 409);
    const created = await call(`${path}?sendUpdates=all`, { method: 'POST', body: JSON.stringify(event) });
    if (!created.response.ok) throw fail('CALENDAR_REQUEST_FAILED');
    return { eventId: created.body.id, alreadyCreated: false };
  } finally { release(); }
}
