import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  Download,
  X,
  RotateCw,
  QrCode,
  FileText,
} from 'lucide-react';
import { Institution, BarangCetakan, TransaksiBarangCetakan } from '@/types/inventory';

interface ModalPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
  reportType: '01' | '02'; // 01: Transaksi, 02: Barang Cetakan
  barangCetakanList: BarangCetakan[];
  transaksiList: TransaksiBarangCetakan[];
  dateRange: { start: string; end: string };
}

export const ModalPdfViewer: React.FC<ModalPdfViewerProps> = ({
  isOpen,
  onClose,
  institution,
  reportType,
  barangCetakanList,
  transaksiList,
  dateRange,
}) => {
  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(117);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const fileName =
    reportType === '02'
      ? 'laporanStkBarangCetakan.pdf'
      : 'laporanTransaksiBarangCetakan.pdf';

  const titleText =
    reportType === '02'
      ? 'Laporan Barang Cetakan'
      : 'Laporan Transaksi Barang Cetakan';

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const totalAwal = barangCetakanList.reduce((acc, i) => acc + i.saldoAwal, 0);
  const totalDebet = barangCetakanList.reduce((acc, i) => acc + i.debet, 0);
  const totalKredit = barangCetakanList.reduce((acc, i) => acc + i.kredit, 0);
  const totalAkhir = barangCetakanList.reduce((acc, i) => acc + i.saldoAkhir, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/80 backdrop-blur-sm flex flex-col justify-between overflow-hidden animate-in fade-in duration-150">
      {/* Top Chrome / PDF Viewer Header Toolbar (Exact Screenshot 6 style) */}
      <div className="bg-[#2a2c2e] text-slate-200 px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-700 select-none shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-slate-100">{fileName}</span>
          <span className="text-slate-500">|</span>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span>1 / 1</span>
          </div>
          <span className="text-slate-500">|</span>
          <div className="flex items-center space-x-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="hover:text-white px-1"
              title="Perkecil"
            >
              -
            </button>
            <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(180, z + 10))}
              className="hover:text-white px-1"
              title="Perbesar"
            >
              +
            </button>
          </div>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center space-x-3 text-slate-300">
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors"
            title="Putar Dokumen"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors flex items-center space-x-1"
            title="Cetak Dokumen"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="hover:text-white hover:bg-slate-700 p-1.5 rounded transition-colors flex items-center space-x-1"
            title="Unduh / Simpan PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Download</span>
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={onClose}
            className="hover:text-white hover:bg-rose-700 p-1 rounded-full transition-colors text-slate-400"
            title="Tutup Pratinjau PDF"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Document Viewer Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-[#525659]">
        <div
          style={{
            transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="bg-white text-slate-900 shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[16mm] sm:p-[20mm] relative font-sans text-xs flex flex-col justify-between"
        >
          {/* Document Content */}
          <div className="space-y-6">
            {/* Header / Kop Surat (Exact Screenshot 6) */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
              <div className="space-y-1 max-w-lg">
                <h1 className="font-extrabold text-sm tracking-wide text-slate-900 uppercase">
                  {institution.name}
                </h1>
                <p className="text-[11px] text-slate-700 leading-snug">
                  {institution.address}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  Telp: {institution.phone}
                </p>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <span className="text-[11px] text-slate-700">
                  Tanggal Cetak : <strong>{currentDate}</strong>
                </span>
                <div className="w-14 h-14 bg-white border border-slate-300 p-1 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <span className="text-[8px] text-slate-400 font-mono">AUTHO-GEN-DOC</span>
              </div>
            </div>

            {/* Document Title & Period */}
            <div className="text-center space-y-1 py-2">
              <h2 className="text-base font-bold text-slate-900 tracking-normal">
                {titleText}
              </h2>
              <p className="text-xs text-slate-700 font-medium">
                Tanggal : {dateRange.start} s.d {dateRange.end}
              </p>
            </div>

            {/* REPORT 02: STOK BARANG CETAKAN TABLE (Exact Screenshot 6) */}
            {reportType === '02' && (
              <div className="border-t border-b-2 border-slate-900 pt-1 pb-1">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="py-2 px-3 text-center w-12 font-bold">No</th>
                      <th className="py-2 px-4 text-left font-bold">Nama Barang</th>
                      <th className="py-2 px-4 text-right w-24 font-bold">Saldo Awal</th>
                      <th className="py-2 px-4 text-right w-24 font-bold">Debet</th>
                      <th className="py-2 px-4 text-right w-24 font-bold">Kredit</th>
                      <th className="py-2 px-4 text-right w-24 font-bold">Saldo Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {barangCetakanList.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 text-center text-slate-700">{index + 1}</td>
                        <td className="py-2 px-4 text-slate-900 font-medium">{item.nama}</td>
                        <td className="py-2 px-4 text-right font-mono text-slate-800">
                          {item.saldoAwal.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-slate-800">
                          {item.debet.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-slate-800">
                          {item.kredit.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">
                          {item.saldoAkhir.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-b-2 border-slate-900 font-bold bg-slate-50/60">
                      <td colSpan={2} className="py-2 px-4 text-center"></td>
                      <td className="py-2 px-4 text-right font-mono">
                        {totalAwal.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-4 text-right font-mono">
                        {totalDebet.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-4 text-right font-mono">
                        {totalKredit.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 px-4 text-right font-mono">
                        {totalAkhir.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* REPORT 01: DETAIL TRANSAKSI BARANG CETAKAN TABLE */}
            {reportType === '01' && (
              <div className="border-t border-b-2 border-slate-900 pt-1 pb-1">
                <table className="w-full text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900">
                      <th className="py-2 px-2 text-center w-8 font-bold">No</th>
                      <th className="py-2 px-2 text-left w-24 font-bold">Tanggal</th>
                      <th className="py-2 px-2 text-left w-28 font-bold">No Transaksi</th>
                      <th className="py-2 px-2 text-left w-24 font-bold">Barang</th>
                      <th className="py-2 px-2 text-center w-16 font-bold">Tipe</th>
                      <th className="py-2 px-2 text-left w-20 font-bold">No Seri</th>
                      <th className="py-2 px-2 text-left font-bold">Nasabah / Keterangan</th>
                      <th className="py-2 px-2 text-left w-20 font-bold">Petugas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transaksiList.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-slate-50/50">
                        <td className="py-1.5 px-2 text-center text-slate-700">{idx + 1}</td>
                        <td className="py-1.5 px-2 text-slate-600 font-mono text-[10px]">
                          {t.tanggal.substring(0, 10)}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-[10px] text-slate-700 font-medium">
                          {t.noTransaksi}
                        </td>
                        <td className="py-1.5 px-2 text-slate-800">{t.jenisBarang}</td>
                        <td className="py-1.5 px-2 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              t.tipe === 'PENGELUARAN'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {t.tipe}
                          </span>
                        </td>
                        <td className="py-1.5 px-2 font-mono font-bold text-slate-900">
                          {t.noSerie}
                        </td>
                        <td className="py-1.5 px-2 text-slate-800 text-[10px]">
                          <div className="font-semibold">{t.namaNasabah}</div>
                          <div className="text-slate-500">{t.keterangan}</div>
                        </td>
                        <td className="py-1.5 px-2 text-slate-600 text-[10px]">{t.petugas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Notes */}
            <div className="text-[10px] text-slate-500 pt-2">
              <p>* Laporan ini digenerate secara otomatis oleh sistem e-Inventaris BPR.</p>
              <p>* Mutasi Debet merepresentasikan pengeluaran barang cetakan ke nasabah/operasional.</p>
              <p>* Mutasi Kredit merepresentasikan penerimaan kiriman logistik baru dari percetakan.</p>
            </div>
          </div>

          {/* Signature Block */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs text-slate-800">
            <div>
              <p className="font-semibold">Dibuat Oleh,</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Petugas Administrasi & Inventaris</p>
              <div className="h-16 flex items-end justify-center">
                <span className="font-mono text-slate-400 text-[10px]">[ Tanda Tangan ]</span>
              </div>
              <p className="font-bold underline uppercase">( RANI ANGGRAENI )</p>
              <p className="text-[10px] text-slate-500">NIK. 202108-019</p>
            </div>

            <div>
              <p className="font-semibold">Mengetahui & Menyetujui,</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Pimpinan Kantor Cabang Operasional</p>
              <div className="h-16 flex items-end justify-center">
                <span className="font-mono text-slate-400 text-[10px]">[ Tanda Tangan & Stempel ]</span>
              </div>
              <p className="font-bold underline uppercase">( DRS. H. ACHMAD HIDAYAT )</p>
              <p className="text-[10px] text-slate-500">Pimpinan Operasional</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
