import React, { useState } from 'react';
import { Search, Printer, AlertCircle, CheckCircle2, BookOpen, Info } from 'lucide-react';
import { Nasabah, StokSeri, Institution } from '@/types/inventory';
import { ModalDaftarTabungan } from './ModalDaftarTabungan';
import { ModalDaftarPenerimaan } from './ModalDaftarPenerimaan';
import { ModalPreviewCetakBuku } from './ModalPreviewCetakBuku';

interface CetakJudulBukuViewProps {
  nasabahList: Nasabah[];
  stokSeriList: StokSeri[];
  institution: Institution;
  onPrintSuccess: (rekening: string, noSerie: string) => void;
}

export const CetakJudulBukuView: React.FC<CetakJudulBukuViewProps> = ({
  nasabahList,
  stokSeriList,
  institution,
  onPrintSuccess,
}) => {
  const [inputNoRekening, setInputNoRekening] = useState('');
  const [selectedNasabah, setSelectedNasabah] = useState<Nasabah | null>(null);
  const [noSerieBuku, setNoSerieBuku] = useState('');
  const [searchError, setSearchError] = useState('');

  // Modals state
  const [isDaftarTabunganOpen, setIsDaftarTabunganOpen] = useState(false);
  const [isDaftarPenerimaanOpen, setIsDaftarPenerimaanOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Search by exact account number
  const handleDirectSearch = () => {
    setSearchError('');
    setAlertSuccess(null);
    if (!inputNoRekening.trim()) {
      setSearchError('Silakan masukkan nomor rekening nasabah terlebih dahulu.');
      return;
    }

    const found = nasabahList.find(
      (n) => n.noRekening.trim().toLowerCase() === inputNoRekening.trim().toLowerCase()
    );

    if (found) {
      setSelectedNasabah(found);
      if (!noSerieBuku) {
        const nextSeri = stokSeriList.find(
          (s) => s.kode === 'T' && s.status === 'TERSEDIA'
        );
        if (nextSeri) setNoSerieBuku(nextSeri.noSerie);
      }
    } else {
      setSelectedNasabah(null);
      setSearchError(
        `Nomor rekening "${inputNoRekening}" tidak ditemukan dalam database. Klik "Bantuan Pencarian" untuk melihat daftar nasabah yang tersedia.`
      );
    }
  };

  // When selected from Modal Daftar Tabungan
  const handleSelectFromModal = (nasabah: Nasabah) => {
    setSelectedNasabah(nasabah);
    setInputNoRekening(nasabah.noRekening);
    setSearchError('');
    setAlertSuccess(null);

    if (!noSerieBuku) {
      const nextSeri = stokSeriList.find(
        (s) => s.kode === 'T' && s.status === 'TERSEDIA'
      );
      if (nextSeri) setNoSerieBuku(nextSeri.noSerie);
    }
  };

  const handleSelectSeriFromModal = (seri: StokSeri) => {
    setNoSerieBuku(seri.noSerie);
  };

  const handleTutup = () => {
    setSelectedNasabah(null);
    setInputNoRekening('');
    setNoSerieBuku('');
    setSearchError('');
  };

  const handleOpenPrintPreview = () => {
    if (!selectedNasabah) return;
    if (!noSerieBuku.trim()) {
      alert('Nomor Seri Buku Tabungan wajib diisi. Silakan cari atau masukkan nomor seri.');
      return;
    }
    const seriRecord = stokSeriList.find((s) => s.noSerie === noSerieBuku.trim());
    if (seriRecord && seriRecord.status === 'TERPAKAI') {
      alert(`Nomor Seri ${noSerieBuku} sudah terpakai oleh nasabah lain. Silakan pilih nomor seri yang masih tersedia.`);
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleExecutePrint = () => {
    if (!selectedNasabah || !noSerieBuku) return;
    onPrintSuccess(selectedNasabah.noRekening, noSerieBuku);
    setIsPreviewOpen(false);
    setAlertSuccess(
      `Pencetakan Berhasil! Judul buku nasabah ${selectedNasabah.namaNasabah} (No. Rekening: ${selectedNasabah.noRekening}) dengan nomor seri blanko ${noSerieBuku} berhasil dicetak dan mutasi stok tercatat.`
    );
  };

  return (
    <div className="space-y-4 w-full">
      {/* Breadcrumb matching Gambar 1: Beranda > Cetak Judul Buku Tabungan */}
      <nav className="text-xs text-slate-500 flex items-center space-x-1.5 font-normal">
        <span className="hover:text-slate-800">Beranda</span>
        <span>&gt;</span>
        <span className="text-slate-700 font-medium">Cetak Judul Buku Tabungan</span>
      </nav>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Cetak Judul Buku</h1>
        <p className="text-xs text-slate-500 mt-1">
          Menu ini digunakan untuk mencetak judul dan data identitas nasabah pada buku tabungan.
        </p>
      </div>

      {/* Panduan Tata Cara Operasional */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-xs text-slate-700 flex items-start space-x-2">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-emerald-900 font-semibold">Tata Cara Pencetakan Buku Tabungan:</strong>
          <span className="ml-1">
            1. Masukkan nomor rekening atau klik tombol <span className="font-semibold text-emerald-800">Bantuan Pencarian</span> untuk memilih nasabah. &nbsp;|&nbsp;
            2. Pastikan nomor seri blanko buku tabungan terisi. &nbsp;|&nbsp;
            3. Masukkan fisik buku tabungan ke printer passbook lalu klik tombol <span className="font-semibold text-emerald-800">Cetak</span>.
          </span>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {alertSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-md flex items-start space-x-3 text-xs text-emerald-800 animate-in fade-in w-full">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Transaksi Berhasil: </span>
            {alertSuccess}
          </div>
          <button
            onClick={() => setAlertSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {searchError && (
        <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-md flex items-start space-x-3 text-xs text-rose-800 animate-in fade-in w-full">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">{searchError}</div>
          <button
            onClick={() => setSearchError('')}
            className="text-rose-600 hover:text-rose-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Search Bar Container (Gambar 1: Full Width Green Box) */}
      <div className="bg-[#b4dd6b] border border-[#a0ce51] rounded-md p-6 sm:p-7 shadow-sm w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="space-y-0.5">
              <label className="text-xs font-medium text-slate-800 whitespace-nowrap">
                No Rekening Nasabah
              </label>
              <p className="text-[10px] text-slate-600">Nomor rekening tabungan nasabah (12 digit angka)</p>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-96">
              <input
                type="text"
                value={inputNoRekening}
                onChange={(e) => setInputNoRekening(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDirectSearch()}
                placeholder="Contoh: 100230002455"
                className="w-full px-3 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-inner"
              />
              <button
                type="button"
                onClick={handleDirectSearch}
                className="px-3 py-1 bg-[#1b75bb] hover:bg-[#155d96] text-white text-xs font-semibold rounded shadow-sm flex items-center space-x-1 transition-colors shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDaftarTabunganOpen(true)}
            className="px-4 py-1.5 bg-[#1b75bb] hover:bg-[#155d96] text-white text-xs font-semibold rounded shadow-sm flex items-center space-x-1.5 transition-colors self-end sm:self-auto"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bantuan Pencarian</span>
          </button>
        </div>
      </div>

      {/* Detail Form Container (Screenshot 3: Full Width below search bar) */}
      {selectedNasabah && (
        <div className="bg-[#b4dd6b] border border-[#a0ce51] rounded-md p-6 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-150 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* Left Side: Nomor Register, Nama Nasabah, Alamat */}
            <div className="lg:col-span-6 space-y-3">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-xs font-medium text-slate-800">
                  Nomor Register
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={selectedNasabah.noRegister}
                    readOnly
                    disabled
                    className="w-full px-3 py-1 bg-slate-200/90 border border-slate-300 rounded text-xs font-mono text-slate-700 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-600 mt-0.5">Nomor CIF / Identitas registrasi nasabah di sistem bank</p>
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-xs font-medium text-slate-800">
                  Nama Nasabah
                </label>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={selectedNasabah.namaNasabah}
                    readOnly
                    disabled
                    className="w-full px-3 py-1 bg-slate-200/90 border border-slate-300 rounded text-xs font-bold text-slate-800 cursor-not-allowed uppercase"
                  />
                  <p className="text-[10px] text-slate-600 mt-0.5">Nama lengkap pemilik rekening sesuai identitas resmi</p>
                </div>
              </div>

              <div className="grid grid-cols-12 items-start gap-2">
                <label className="col-span-4 text-xs font-medium text-slate-800 pt-1">
                  Alamat
                </label>
                <div className="col-span-8">
                  <textarea
                    rows={2}
                    value={selectedNasabah.alamat}
                    readOnly
                    disabled
                    className="w-full px-3 py-1 bg-slate-200/90 border border-slate-300 rounded text-xs text-slate-700 cursor-not-allowed resize-none"
                  />
                  <p className="text-[10px] text-slate-600 mt-0.5">Alamat nasabah yang akan dicetak pada halaman judul buku tabungan</p>
                </div>
              </div>
            </div>

            {/* Right Side: No Serie Buku * with [Cari] button */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-xs font-medium text-slate-800">
                  No Serie Buku <span className="text-red-600 font-bold">*</span>
                </label>
                <div className="col-span-8">
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      value={noSerieBuku}
                      onChange={(e) => setNoSerieBuku(e.target.value)}
                      placeholder="Contoh: 001685"
                      className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDaftarPenerimaanOpen(true)}
                      className="px-3 py-1 bg-[#1b75bb] hover:bg-[#155d96] text-white text-xs font-semibold rounded shadow-sm flex items-center space-x-1 transition-colors shrink-0"
                      title="Buka daftar nomor seri blanko yang tersedia"
                    >
                      <Search className="w-3 h-3" />
                      <span>Cari</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">Nomor seri fisik blanko buku tabungan yang dikeluarkan dari inventaris</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-[#9acb4b]" />

          {/* Action Buttons: Cetak (Green) and Tutup (Blue) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenPrintPreview}
                className="px-4 py-1.5 bg-[#127a38] hover:bg-[#0f642e] text-white text-xs font-semibold rounded shadow-sm flex items-center space-x-1.5 transition-colors"
                title="Buka pratinjau cetak (belum menyimpan ke sistem)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak</span>
              </button>
              <button
                type="button"
                onClick={handleTutup}
                className="px-4 py-1.5 bg-[#1b75bb] hover:bg-[#155d96] text-white text-xs font-semibold rounded shadow-sm transition-colors"
              >
                <span>Tutup</span>
              </button>
            </div>

            {/* Keterangan Alur Cetak & Belum Menyimpan */}
            <div className="text-[11px] text-amber-900 bg-amber-50/90 border border-amber-300 rounded px-3 py-1.5 flex items-start space-x-1.5 leading-snug">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-950">Informasi Alur Cetak:</strong> Tombol <span className="font-bold text-[#127a38]">&quot;Cetak&quot;</span> hanya membuka pratinjau layout buku tabungan (belum mengunci nomor seri dan belum menyimpan perubahan ke database). Nomor seri fisik baru resmi dikunci &amp; terpakai setelah Anda menekan tombol <span className="font-bold text-emerald-800">&quot;Cetak Sekarang&quot;</span> pada jendela pratinjau.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ModalDaftarTabungan
        isOpen={isDaftarTabunganOpen}
        onClose={() => setIsDaftarTabunganOpen(false)}
        nasabahList={nasabahList}
        onSelectNasabah={handleSelectFromModal}
      />

      <ModalDaftarPenerimaan
        isOpen={isDaftarPenerimaanOpen}
        onClose={() => setIsDaftarPenerimaanOpen(false)}
        stokSeriList={stokSeriList}
        onSelectSeri={handleSelectSeriFromModal}
        selectedKode="T"
      />

      {selectedNasabah && (
        <ModalPreviewCetakBuku
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          nasabah={selectedNasabah}
          noSerie={noSerieBuku}
          institution={institution}
          onConfirmPrint={handleExecutePrint}
        />
      )}
    </div>
  );
};
