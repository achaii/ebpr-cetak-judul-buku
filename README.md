# e-Inventaris BPR - Sistem Cetak Judul Buku & Barang Cetakan

Aplikasi Sistem Informasi e-Inventaris Perbankan BPR (Bank Perekonomian Rakyat) berbasis **Next.js 14**, **TypeScript**, dan **Tailwind CSS**. Sistem ini didesain sesuai dengan standar operasional cetak buku tabungan dan pelaporan barang cetakan perbankan.

---

## 🌟 Fitur Utama

### 1. Cetak Judul Buku Tabungan
- **Pencarian Rekening Langsung**: Masukkan nomor rekening (misal: `100230002455`) lalu tekan Enter atau klik tombol **Cari**.
- **Bantuan Pencarian (Modal Daftar Tabungan)**:
  - Filter pencarian berdasarkan *No Permohonan*, *No Rekening*, dan *Nama Nasabah*.
  - Tabel paginasi data nasabah (No Rekening, No Permohonan, Nama Nasabah, Alamat, Jenis Produk).
  - Sekali klik pada baris nasabah langsung memuat data ke formulir cetak.
- **Formulir Rincian Nasabah**:
  - Menampilkan *Nomor Register (CIF)*, *Nama Nasabah*, dan *Alamat*.
  - Input *No Serie Buku \** dengan bantuan pencarian nomor seri.
- **Modal Daftar Penerimaan Barang Cetakan**:
  - Menampilkan daftar nomor seri blanko buku tabungan yang berstatus `TERSEDIA` (misal: `001685`, `001686`, dst.).
  - Sekali klik langsung mengisi nomor seri ke formulir.
- **Pratinjau Fisik & Cetak Buku Tabungan**:
  - Modal pratinjau fisik buku tabungan sesuai format standar BPR lengkap dengan kop bank, kode cabang, QR code, data nasabah, nomor seri, dan kolom tanda tangan customer service.
  - Saat dicetak, sistem secara otomatis mencatat pengeluaran stok (mutasi debet +1), memperbarui status nomor seri menjadi `TERPAKAI`, dan merekam ke log audit transaksi.

### 2. Laporan Barang Cetakan (PDF & XLS)
- **Pilihan Format**:
  - **PDF**: Membuka PDF Document Viewer interaktif (*laporanStkBarangCetakan.pdf*) lengkap dengan toolbar zoom, rotasi, print, download, kop surat resmi (*PT UKABIMA LUMBUNG SEJAHTERA KPO*), tabel mutasi stok, dan tanda tangan pejabat operasional.
  - **XLS**: Ekspor instan ke format spreadsheet CSV/Excel.
- **Jenis Laporan**:
  - `01. Transaksi Barang Cetakan`: Detail rekap log seluruh mutasi debet/kredit nomor seri, rekening, dan petugas.
  - `02. Barang Cetakan`: Rekapitulasi saldo awal, debet (pengeluaran), kredit (penerimaan), dan saldo akhir persis seperti dokumen perbankan.
- **Filter Rentang Tanggal**: Penyesuaian periode tanggal laporan (default: `01/07/2026` s.d `24/11/2026`).

### 3. Stok & Inventaris Barang Cetakan
- Pemantauan stok *Buku Tabungan* dan *Bilyet Deposito*.
- **Penerimaan Stok Baru (Kredit)**: Formulir penambahan blanko baru dari vendor percetakan berdasarkan rentang nomor seri (misal: 1706 s.d 1750).
- Tabel kontrol fisik seluruh nomor seri beserta statusnya (`TERSEDIA` / `TERPAKAI`) dan riwayat penggunaan rekening.

### 4. Master Data Nasabah
- Pencarian dan penambahan data nasabah baru.
- Shortcut langsung untuk cetak judul buku dari daftar nasabah.

### 5. Riwayat Transaksi & Audit Log
- Audit trail transaksi mutasi masuk (kredit) dan mutasi keluar (debet/cetak).
- Fitur ekspor riwayat ke file Excel/CSV.

### 6. Zero-Database & Reset Data ke Default
- **Penyimpanan Bebas Database**: Seluruh data tersimpan aman dan terstruktur di `data/app_data.json` dan tersinkronisasi otomatis dengan `localStorage` browser. Tidak memerlukan instalasi database eksternal (MySQL/PostgreSQL).
- **Tombol Reset Data Default**:
  - Terletak di navbar atas (`Reset Data Default`).
  - Menampilkan modal konfirmasi dengan rincian data awal.
  - Saat dikonfirmasi, seluruh data inventaris, mutasi, dan rekening nasabah seketika kembali ke kondisi awal (default dataset di `data/default_dataset.json`).

---

## 🚀 Panduan Menjalankan Aplikasi

### Persyaratan:
- Node.js (v18 ke atas)
- npm

### 1. Menjalankan Server Pengembangan:
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

### 2. Menjalankan Automated Tests:
```bash
npm test
```
Menjalankan unit test integritas data, formula saldo mutasi akuntansi, dan idempotensi reset.

### 3. Membangun Versi Produksi:
```bash
npm run build
npm start
```

---

## 📁 Struktur Proyek
```
ebpr/
├── data/
│   ├── default_dataset.json   # Data master awal default
│   └── app_data.json          # File penyimpanan runtime JSON
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── data/route.ts  # Endpoint simpan/ambil JSON
│   │   │   └── reset/route.ts # Endpoint reset ke data awal
│   │   ├── globals.css        # Tema Tailwind & styling warisan BPR
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Halaman utama aplikasi
│   ├── components/
│   │   ├── CetakJudulBukuView.tsx
│   │   ├── ModalDaftarTabungan.tsx
│   │   ├── ModalDaftarPenerimaan.tsx
│   │   ├── ModalPreviewCetakBuku.tsx
│   │   ├── LaporanView.tsx
│   │   ├── ModalPdfViewer.tsx
│   │   ├── StokInventarisView.tsx
│   │   ├── DataNasabahView.tsx
│   │   ├── RiwayatTransaksiView.tsx
│   │   ├── ResetConfirmModal.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── storage.ts         # Logika penyimpanan JSON & localStorage
│   │   └── excel-export.ts    # Generator unduhan Excel/CSV
│   └── types/
│       └── inventory.ts       # Definisi TypeScript
└── tests/
    └── inventory.test.mjs     # Test suite unit & integrasi
```
