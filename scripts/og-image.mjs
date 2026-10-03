import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d5c47"/>
      <stop offset="100%" stop-color="#093f31"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="14" fill="#b3261e"/>
  <rect x="72" y="96" width="64" height="6" fill="#ff8f84"/>
  <text x="72" y="152" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" letter-spacing="7" fill="#8fd8c1">CONTRACTOR QUOTE FORENSICS</text>
  <text x="72" y="272" font-family="Arial, Helvetica, sans-serif" font-size="84" font-weight="800" fill="#ffffff">Read your contractor</text>
  <text x="72" y="368" font-family="Arial, Helvetica, sans-serif" font-size="84" font-weight="800" fill="#ffffff">quote like a</text>
  <text x="72" y="464" font-family="Arial, Helvetica, sans-serif" font-size="84" font-weight="800" fill="#ffd166">forensic analyst.</text>
  <text x="72" y="546" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="400" fill="#cfe9df">Line-by-line guides + a free quote fairness check</text>
  <text x="1128" y="560" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff">quoteforensics.com</text>
</svg>`;

mkdirSync('public', { recursive: true });
await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile('public/og.png');
console.log('og.png written');
