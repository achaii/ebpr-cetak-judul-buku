import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, QrCode, AlertCircle, Info } from 'lucide-react';
import { Nasabah, Institution } from '@/types/inventory';

interface ModalPreviewCetakBukuProps {
  isOpen: boolean;
  onClose: () => void;
  nasabah: Nasabah;
  noSerie: string;
  institution: Institution;
  onConfirmPrint: () => void;
}

export const ModalPreviewCetakBuku: React.FC<ModalPreviewCetakBukuProps> = ({
  isOpen,
  onClose,
  nasabah,
  noSerie,
  institution,
  onConfirmPrint,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-300">
        {/* Modal Toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Pratinjau Cetak Judul Buku Tabungan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panduan Cara Penggunaan */}
        <div className="bg-emerald-50/80 border-b border-emerald-200 px-6 py-2.5 text-xs text-slate-700 flex items-start space-x-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-emerald-900 font-semibold">Petunjuk Cara Penggunaan:</strong>
            <span className="ml-1.5">
              <span className="font-bold text-emerald-800">1.</span> Teliti kesesuaian data nasabah dan nomor seri blanko pada pratinjau fisik buku.&nbsp;&nbsp;
              <span className="font-bold text-emerald-800">2.</span> Pasang fisik buku tabungan pada tray printer passbook.&nbsp;&nbsp;
              <span className="font-bold text-emerald-800">3.</span> Klik tombol <strong className="text-emerald-800">&quot;Cetak Sekarang (Kunci &amp; Simpan)&quot;</strong> di bawah untuk mencetak dan mengunci nomor seri tersebut ke database.
            </span>
          </div>
        </div>

        {/* Physical Passbook Layout Preview */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            id="passbook-print-area"
            className="bg-[#fefce8] border-2 border-amber-300/80 rounded-xl p-8 shadow-md w-full max-w-lg text-slate-900 relative font-mono text-xs space-y-4"
          >
            {/* Header */}
            <div className="border-b border-amber-300 pb-3 flex items-start justify-between">
              <div>
                <h2 className="font-bold text-sm tracking-wide text-slate-900 font-sans">
                  {institution.name}
                </h2>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5">
                  {institution.branchName}
                </p>
                <div className="inline-block mt-1 bg-emerald-800 text-white font-sans font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                  {nasabah.jenisProduk}
                </div>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-white border border-slate-300 rounded flex items-center justify-center text-slate-800">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                  {nasabah.noRekening}
                </span>
              </div>
            </div>

            {/* Passbook Fields */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500 font-semibold">NO REKENING</span>
                <span className="col-span-8 font-bold text-slate-900 text-sm tracking-wider">
                  : {nasabah.noRekening}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500 font-semibold">NO REGISTER / CIF</span>
                <span className="col-span-8 font-bold text-slate-900">
                  : {nasabah.noRegister}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500 font-semibold">NAMA LENGKAP</span>
                <span className="col-span-8 font-bold text-slate-900 uppercase text-xs">
                  : {nasabah.namaNasabah}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500 font-semibold">ALAMAT TINGGAL</span>
                <span className="col-span-8 text-slate-800 text-[11px] leading-relaxed uppercase">
                  : {nasabah.alamat}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500 font-semibold">NO SERIE BLANKO</span>
                <span className="col-span-8 font-bold text-emerald-800 text-xs">
                  : {noSerie}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-500 font-semibold">TGL CETAK BUKU</span>
                <span className="col-span-8 text-slate-700">
                  : {currentDate}
                </span>
              </div>
            </div>

            {/* Footer Passbook Warning */}
            <div className="border-t border-dashed border-amber-300 pt-3 flex justify-between items-end text-[10px] text-slate-500 font-sans">
              <div>
                <p>Harap bawa buku tabungan ini saat bertransaksi di teller.</p>
                <p>Bila hilang segera lapor ke kantor cabang terdekat.</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-700">Petugas Customer Service</p>
                <p className="mt-4 font-mono text-[9px] text-slate-400">[ Tanda Tangan & Cap ]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions & Keterangan Penyimpanan */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 space-y-3">
          {/* Banner Peringatan Kunci Nomor Seri */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-lg p-3 text-xs text-amber-950 flex items-start space-x-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950">Konfirmasi Penyimpanan Status Buku:</strong> Menekan tombol <span className="font-bold text-emerald-800">&quot;Cetak Sekarang&quot;</span> akan langsung mencetak fisik buku dan memastikan nomor seri <span className="font-mono font-bold text-emerald-900 bg-amber-100 px-1 py-0.5 rounded border border-amber-300">{noSerie}</span> resmi <strong>TERPAKAI</strong> oleh nasabah <strong>{nasabah.namaNasabah}</strong> (No. Rekening: {nasabah.noRekening}), mencatat mutasi pengeluaran ke inventaris, serta menyimpan data secara permanen ke database. Menekan tombol <span className="font-bold text-slate-700">&quot;Batal&quot;</span> akan menutup jendela tanpa menyimpan data apapun.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Pastikan fisik buku tabungan nomor seri <strong className="text-slate-800 font-mono">{noSerie}</strong> sudah terpasang rapi di printer passbook.
            </p>
            <div className="flex space-x-2 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                title="Tutup pratinjau tanpa menyimpan perubahan data"
              >
                Batal (Belum Menyimpan)
              </button>
              <button
                onClick={() => {
                  onConfirmPrint();
                  window.print();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow flex items-center space-x-1.5 transition-colors"
                title="Cetak fisik buku dan kunci nomor seri sebagai TERPAKAI"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sekarang (Kunci &amp; Simpan)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
