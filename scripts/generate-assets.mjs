import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const publicDir = path.resolve('./public');
const appDir = path.resolve('./src/app');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create crisp SVG Favicon
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#127a38"/>
      <stop offset="100%" stop-color="#0a5224"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-opacity="0.3"/>
    </filter>
  </defs>
  <!-- Background rounded box -->
  <rect width="64" height="64" rx="14" fill="url(#bgGrad)"/>
  
  <!-- Outer border highlight -->
  <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.4"/>
  
  <!-- Passbook / Buku Tabungan icon -->
  <g filter="url(#shadow)" transform="translate(10, 11)">
    <!-- Passbook cover / body -->
    <rect x="0" y="0" width="44" height="42" rx="4" fill="#ffffff"/>
    
    <!-- Header band of passbook (BPR Green) -->
    <path d="M0 4 C0 1.8 1.8 0 4 0 L40 0 C42.2 0 44 1.8 44 4 L44 11 L0 11 Z" fill="#127a38"/>
    
    <!-- Bank Gold Emblem / Stamp -->
    <circle cx="9" cy="5.5" r="3" fill="url(#goldGrad)"/>
    
    <!-- Header mini text line -->
    <rect x="15" y="4" width="22" height="3" rx="1.5" fill="#a7f3d0"/>
    
    <!-- Data / magnetic lines in passbook -->
    <rect x="6" y="17" width="32" height="2.5" rx="1" fill="#cbd5e1"/>
    <rect x="6" y="23" width="24" height="2.5" rx="1" fill="#94a3b8"/>
    <rect x="6" y="29" width="28" height="2.5" rx="1" fill="#cbd5e1"/>
    <rect x="6" y="35" width="18" height="2" rx="1" fill="#e2e8f0"/>
    
    <!-- Official Green Checked Stamp -->
    <circle cx="36" cy="33" r="6" fill="#10b981"/>
    <path d="M33 33 L35 35 L39 31" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgFavicon, 'utf-8');
fs.writeFileSync(path.join(appDir, 'icon.svg'), svgFavicon, 'utf-8');
console.log('✓ Created icon.svg in public/ and src/app/');

// 2. Pure Node.js PNG encoder helper
function createPng(width, height, getPixelRgba) {
  // CRC table
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type, 'ascii');
    const len = data.length;
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(len, 0);

    const toCrc = Buffer.concat([typeBuf, data]);
    const crcVal = crc32(toCrc);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);

    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw Image Data with filter byte 0 at start of each scanline
  const stride = width * 4;
  const rawData = Buffer.alloc(height * (stride + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Deflate IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// 3. Generate 64x64 PNG Favicon
const faviconPng = createPng(64, 64, (x, y, w, h) => {
  // Rounded rect check (radius 14)
  const r = 14;
  const inCorner =
    (x < r && y < r && (x - r) ** 2 + (y - r) ** 2 > r ** 2) ||
    (x >= w - r && y < r && (x - (w - r)) ** 2 + (y - r) ** 2 > r ** 2) ||
    (x < r && y >= h - r && (x - r) ** 2 + (y - (h - r)) ** 2 > r ** 2) ||
    (x >= w - r && y >= h - r && (x - (w - r)) ** 2 + (y - (h - r)) ** 2 > r ** 2);

  if (inCorner) return [0, 0, 0, 0];

  // Passbook area: x in [10..53], y in [12..51]
  if (x >= 12 && x <= 51 && y >= 14 && y <= 50) {
    // Header band y in [14..23]
    if (y <= 23) {
      if (x >= 16 && x <= 22 && y >= 16 && y <= 21) {
        return [251, 191, 36, 255]; // Gold badge
      }
      return [18, 122, 56, 255]; // Green header
    }
    // Lines
    if (y === 28 || y === 34 || y === 40) {
      if (x >= 16 && x <= 44) return [148, 163, 184, 255]; // Slate line
    }
    // Passbook white page
    return [255, 255, 255, 255];
  }

  // Background emerald gradient
  const t = (x + y) / (w + h);
  const red = Math.round(18 * (1 - t) + 10 * t);
  const green = Math.round(122 * (1 - t) + 82 * t);
  const blue = Math.round(56 * (1 - t) + 36 * t);
  return [red, green, blue, 255];
});

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconPng);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), faviconPng);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), faviconPng);
console.log('✓ Created favicon.ico and apple-touch-icon.png');

// 4. Generate 1200x630 Open Graph Image (For WhatsApp Status & Chats)
console.log('Generating 1200x630 Open Graph preview image...');
const ogPng = createPng(1200, 630, (x, y, w, h) => {
  // Top green branding bar (height 20px)
  if (y < 20) {
    return [18, 122, 56, 255]; // Emerald #127a38
  }
  // Bottom gold accent bar (height 12px)
  if (y >= h - 12) {
    return [245, 158, 11, 255]; // Amber #f59e0b
  }

  // Left banner icon box (x from 100 to 300, y from 165 to 465)
  if (x >= 100 && x <= 300 && y >= 165 && y <= 465) {
    const rx = x - 100;
    const ry = y - 165;
    // Rounded box border
    if (rx < 12 || rx > 188 || ry < 12 || ry > 288) {
      return [18, 122, 56, 255];
    }
    // White card inside
    if (rx >= 30 && rx <= 170 && ry >= 40 && ry <= 260) {
      if (ry <= 90) {
        return [18, 122, 56, 255]; // Card header
      }
      if (ry === 120 || ry === 150 || ry === 180 || ry === 210) {
        if (rx >= 45 && rx <= 155) return [148, 163, 184, 255]; // Card lines
      }
      return [255, 255, 255, 255];
    }
    return [240, 253, 244, 255]; // Light emerald bg
  }

  // Subtle clean dark gradient background
  const t = (x + y) / (w + h);
  const r = Math.round(15 + t * 10);
  const g = Math.round(23 + t * 15);
  const b = Math.round(42 + t * 20); // Dark slate background (#0f172a)
  return [r, g, b, 255];
});

fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPng);
console.log('✓ Created og-image.png (1200x630) in public/');
