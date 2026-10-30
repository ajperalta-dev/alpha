import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingEvent, createBooking } from '../calendar.mjs';
const form = { fullName: 'Test Person', email: 'test@example.com', phone: '123', company: 'Test', companySize: '1-20', serviceCategory: 'Consultoría', preferredDate: '2026-12-15', preferredTime: '09:30 - 10:00 Europe/Madrid', projectDescription: '<script>test</script>' };
test('Madrid winter and summer offsets, duration, all fields, escaped HTML and stable retries', () => {
  const winter = bookingEvent(form);
  assert.match(winter.start.dateTime, /09:30:00.*\+01:00$/);
  assert.equal(Date.parse(winter.end.dateTime) - Date.parse(winter.start.dateTime), 1800000);
  assert.match(winter.description, /&lt;script&gt;/);
  for (const key of Object.keys(form)) assert.ok(winter.description.includes(key + ':'));
  assert.equal(winter.id, bookingEvent({ ...form }).id);
  const summer = bookingEvent({ ...form, preferredDate: '2027-06-15' });
  assert.match(summer.start.dateTime, /\+02:00$/);
});
test('reject invalid email, dates, arbitrary slots and excessive fields', () => {
  for (const change of [{ email: 'invalid' }, { preferredDate: '2027-02-30' }, { preferredDate: '2000-01-01' }, { preferredTime: '03:00 - 03:30 Europe/Madrid' }, { projectDescription: 'x'.repeat(3001) }]) assert.throws(() => bookingEvent({ ...form, ...change }), /INVALID_BOOKING/);
});
test('Google workflow validates account, checks availability and requests guest notification', async () => {
  const originalFetch = globalThis.fetch;
  const saved = { ...process.env };
  process.env.GOOGLE_CLIENT_ID = 'test'; process.env.GOOGLE_CLIENT_SECRET = 'test'; process.env.GOOGLE_REFRESH_TOKEN = 'test';
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(String(url));
    if (String(url).includes('/token')) return Response.json({ access_token: 'test' });
    if (String(url).endsWith('/primary')) return Response.json({ id: 'alpha.digital.ia@gmail.com' });
    if (String(url).endsWith('/freeBusy')) return Response.json({ calendars: { 'alpha.digital.ia@gmail.com': { busy: [] } } });
    if (options.method === 'POST') {
      assert.ok(String(url).endsWith('?sendUpdates=all'));
      assert.equal(JSON.parse(options.body).attendees[0].email, form.email);
      return Response.json({ id: 'created' });
    }
    return Response.json({}, { status: 404 });
  };
  try { assert.deepEqual(await createBooking(form), { eventId: 'created', alreadyCreated: false }); assert.equal(calls.length, 5); }
  finally { globalThis.fetch = originalFetch; for (const key of ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']) { if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key]; } }
});
