import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/index.mjs';

test('Vercel rewrite routes health requests to the shared API', async () => {
  const response = await handler.fetch(new Request('https://alpha.example/api/index?route=health'));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Content-Type'), /application\/json/);
  const body = await response.json();
  assert.equal(typeof body.aiConfigured, 'boolean');
});

test('Vercel supports original API URLs and rejects unknown endpoints', async () => {
  const status = await handler.fetch(new Request('https://alpha.example/api/booking-status'));
  assert.equal(status.status, 200);
  const unknown = await handler.fetch(new Request('https://alpha.example/api/index?route=unknown'));
  assert.equal(unknown.status, 404);
});
