import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Social preview references the exported ALPHA artwork at an absolute public URL', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const url = 'https://alpha-xi-sand.vercel.app/brand/identity-alpha/alpha-share-icon.png';
  assert.ok(html.includes(`property="og:image" content="${url}"`));
  assert.ok(html.includes(`name="twitter:image" content="${url}"`));
  const png = readFileSync(new URL('../public/brand/identity-alpha/alpha-share-icon.png', import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length > 10_000, 'The preview must contain artwork, not only a blank background');
  assert.equal((html.match(/property="og:image" /g) || []).length, 1);
  for (const tag of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image:type', 'og:image:width', 'og:image:height']) {
    assert.ok(html.includes(`property="${tag}"`), `Missing ${tag}`);
  }
});
