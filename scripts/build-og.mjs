/**
 * Convert public/og-image.svg → public/og-image.png (1200×630).
 *
 * Most social platforms (Telegram, LinkedIn, Twitter, Facebook) require PNG/JPEG —
 * SVG og:image is unreliable. Run this once whenever og-image.svg changes.
 *
 *   npm install --save-dev @resvg/resvg-js
 *   node scripts/build-og.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let Resvg;
try {
  ({ Resvg } = await import('@resvg/resvg-js'));
} catch {
  console.error('Missing @resvg/resvg-js. Install with:\n  npm install --save-dev @resvg/resvg-js');
  process.exit(1);
}

const svg = readFileSync(resolve(root, 'public/og-image.svg'), 'utf8');
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
});
const png = resvg.render().asPng();
writeFileSync(resolve(root, 'public/og-image.png'), png);
console.log('✓ public/og-image.png written (' + png.length + ' bytes)');
