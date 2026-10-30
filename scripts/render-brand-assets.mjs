import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const directory = new URL('../public/brand/identity-alpha/', import.meta.url);
const horizontal = await readFile(new URL('alpha-horizontal-oscuro.svg', directory), 'utf8');
const nested = horizontal.replace(/<svg[^>]*>/, '<svg x="135" y="145" width="930" height="271" viewBox="0 0 880 256">');
const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#000000"/>${nested}<text x="600" y="495" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="25">Datos, inteligencia artificial y transformación digital.</text></svg>`;
await writeFile(new URL('alpha-share.png', directory), new Resvg(share, { fitTo:{ mode:'width', value:1200 } }).render().asPng());
const appIcon = await readFile(new URL('alpha-app-icon.svg', directory), 'utf8');
await writeFile(new URL('alpha-touch-icon.png', directory), new Resvg(appIcon, { fitTo:{ mode:'width', value:180 } }).render().asPng());
console.log('ALPHA sharing image and Apple touch icon rendered from official vectors.');
