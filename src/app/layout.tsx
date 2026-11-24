import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#127a38',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ebpr-cetak-judul-buku.vercel.app'),
  title: {
    default: 'e-Inventaris BPR - Cetak Judul Buku Tabungan',
    template: '%s | e-Inventaris BPR',
  },
  description:
    'Sistem Informasi Manajemen Barang Cetakan & Cetak Judul Buku Tabungan BPR. Terintegrasi, cepat, akurat, dan aman.',
  applicationName: 'e-Inventaris BPR',
  authors: [{ name: 'PT BPR Ultera / e-BPR' }],
  generator: 'Next.js',
  keywords: [
    'BPR',
    'Cetak Judul Buku',
    'Buku Tabungan',
    'Barang Cetakan',
    'e-Inventaris',
    'Perbankan',
    'JUST EXAMPLE',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ebpr-cetak-judul-buku.vercel.app/',
    siteName: 'e-Inventaris BPR',
    title: 'e-Inventaris BPR - Cetak Judul Buku Tabungan',
    description:
      'Sistem Informasi Manajemen Barang Cetakan & Cetak Judul Buku Tabungan BPR. Terintegrasi, cepat, akurat, dan aman.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'e-Inventaris BPR - Cetak Judul Buku Tabungan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'e-Inventaris BPR - Cetak Judul Buku Tabungan',
    description:
      'Sistem Informasi Manajemen Barang Cetakan & Cetak Judul Buku Tabungan BPR. Terintegrasi, cepat, akurat, dan aman.',
    images: ['/og-image.png'],
  },
  other: {
    'og:image:secure_url': 'https://ebpr-cetak-judul-buku.vercel.app/og-image.png',
    'og:image:type': 'image/png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white w-full">
        {children}
      </body>
    </html>
  );
}
