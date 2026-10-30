import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const directory = new URL('../public/brand/identity-alpha/', import.meta.url);
const lightIsotype = await readFile(new URL('alpha-isotipo-claro.svg', directory), 'utf8');
const nestedIcon = lightIsotype.replace(/<svg[^>]*>/, '<svg x="285" y="0" width="630" height="630" viewBox="0 0 256 256">');
const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#FFFFFF"/>${nestedIcon}</svg>`;
await writeFile(new URL('alpha-share-isotipo.png', directory), new Resvg(share, { fitTo:{ mode:'width', value:1200 } }).render().asPng());
const darkAppIcon = await readFile(new URL('alpha-app-icon.svg', directory), 'utf8');
await writeFile(new URL('alpha-touch-icon.png', directory), new Resvg(darkAppIcon, { fitTo:{ mode:'width', value:180 } }).render().asPng());
console.log('ALPHA sharing image rendered from the full-size light isotype vector.');
