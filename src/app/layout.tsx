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
    default: 'Cetak Judul Buku - BPR',
    template: '%s | Cetak Judul Buku',
  },
  description:
    'Aplikasi Cetak Judul Buku Tabungan dan Pelaporan Barang Cetakan BPR. Terintegrasi, cepat, akurat, dan aman.',
  applicationName: 'Cetak Judul Buku',
  authors: [{ name: 'Cetak Judul Buku BPR' }],
  generator: 'Next.js',
  keywords: [
    'BPR',
    'Cetak Judul Buku',
    'Buku Tabungan',
    'Barang Cetakan',
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
    siteName: 'Cetak Judul Buku',
    title: 'Cetak Judul Buku - Cetak Judul Buku Tabungan BPR',
    description:
      'Aplikasi Cetak Judul Buku Tabungan dan Pelaporan Barang Cetakan BPR. Terintegrasi, cepat, akurat, dan aman.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cetak Judul Buku - Cetak Judul Buku Tabungan BPR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cetak Judul Buku - Cetak Judul Buku Tabungan BPR',
    description:
      'Aplikasi Cetak Judul Buku Tabungan dan Pelaporan Barang Cetakan BPR. Terintegrasi, cepat, akurat, dan aman.',
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
