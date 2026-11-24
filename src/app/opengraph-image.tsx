import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Cetak Judul Buku - Cetak Judul Buku Tabungan BPR';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Top Gold Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '12px',
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
          }}
        />

        {/* Institution Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px',
            padding: '8px 24px',
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#a7f3d0',
            marginBottom: '24px',
          }}
        >
          JUST EXAMPLE • KANTOR PELAYANAN OPERASIONAL
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            textAlign: 'center',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: '16px',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          Cetak Judul Buku Tabungan
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 500,
            color: '#d1fae5',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
            marginBottom: '36px',
          }}
        >
          Sistem Informasi Manajemen Barang Cetakan & Pengawasan Nomor Seri Blanko BPR
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              color: '#065f46',
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            }}
          >
            ✓ Cetak Fisik Passbook
          </div>
          <div
            style={{
              backgroundColor: 'white',
              color: '#065f46',
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            }}
          >
            ✓ Otorisasi Nomor Seri
          </div>
          <div
            style={{
              backgroundColor: 'white',
              color: '#065f46',
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            }}
          >
            ✓ Laporan PDF Real-time
          </div>
        </div>

        {/* Bottom Domain Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '15px',
            color: '#a7f3d0',
            opacity: 0.9,
            letterSpacing: '0.5px',
          }}
        >
          ebpr-cetak-judul-buku.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
