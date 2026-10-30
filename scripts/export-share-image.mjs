import { readFileSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

// Embed the supplied artwork unchanged, with safe margins for social previews.
const original = readFileSync(new URL('../public/brand/alpha-logo.svg', import.meta.url), 'utf8');
const embedded = original.replace(/<svg\b([^>]*)>/, '<svg$1 x="316" y="45" width="568" height="540">');
const layout = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#edf6fb"/>
  ${embedded}
</svg>`;
const image = new Resvg(layout, { font: { loadSystemFonts: false } }).render();
writeFileSync(new URL('../public/brand/alpha-logo-compartir-v3.png', import.meta.url), image.asPng());
console.log('Exported alpha-logo.svg → public/brand/alpha-logo-compartir-v3.png (1200 × 630)');
