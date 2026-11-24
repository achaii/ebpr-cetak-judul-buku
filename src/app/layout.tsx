import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cetak Judul Buku',
  description: 'Aplikasi Cetak Judul Buku Tabungan dan Pelaporan Barang Cetakan BPR',
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
