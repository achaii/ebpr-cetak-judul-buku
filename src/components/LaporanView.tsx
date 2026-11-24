import React, { useState } from 'react';
import { Lock, FileSpreadsheet, FileText, Info } from 'lucide-react';
import { Institution, BarangCetakan, TransaksiBarangCetakan } from '@/types/inventory';
import { ModalPdfViewer } from './ModalPdfViewer';
import { exportBarangCetakanToExcel, exportTransaksiToExcel } from '@/lib/excel-export';

interface LaporanViewProps {
  institution: Institution;
  barangCetakanList: BarangCetakan[];
  transaksiList: TransaksiBarangCetakan[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  institution,
  barangCetakanList,
  transaksiList,
}) => {
  const [format, setFormat] = useState<'PDF' | 'XLS'>('PDF');
  const [selectedReport, setSelectedReport] = useState<'01' | '02'>('01');
  const [startDate, setStartDate] = useState('01/05/2026');
  const [endDate, setEndDate] = useState('24/11/2026');
  const [reportSubtype, setReportSubtype] = useState<'DETAIL' | 'REKAPITULASI'>('DETAIL');
  const [selectedJenis, setSelectedJenis] = useState<string>('Semua');

  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const reportOptions = [
    { id: '01', label: '01. Transaksi Barang Cetakan' },
    { id: '02', label: '02. Barang Cetakan' },
  ];

  const handleReportChange = (id: '01' | '02') => {
    setSelectedReport(id);
    if (id === '01') {
      setStartDate('01/05/2026');
      setEndDate('24/11/2026');
    } else {
      setStartDate('01/07/2026');
      setEndDate('24/11/2026');
    }
  };

  const handleCetak = () => {
    setStatusMessage(null);

    if (format === 'PDF') {
      setIsPdfModalOpen(true);
    } else {
      // Export to Excel / CSV format
      if (selectedReport === '02') {
        exportBarangCetakanToExcel(barangCetakanList, institution.name, {
          start: startDate,
          end: endDate,
        });
        setStatusMessage('Laporan Barang Cetakan berhasil diunduh dalam format Excel (.csv).');
      } else {
        exportTransaksiToExcel(transaksiList, institution.name, {
          start: startDate,
          end: endDate,
        });
        setStatusMessage('Laporan Transaksi Barang Cetakan berhasil diunduh dalam format Excel (.csv).');
      }
    }
  };

  const handleTutup = () => {
    setSelectedReport('01');
    setFormat('PDF');
    setStartDate('01/05/2026');
    setEndDate('24/11/2026');
    setReportSubtype('DETAIL');
    setSelectedJenis('Semua');
    setStatusMessage(null);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Breadcrumb matching Gambar 5: Beranda > ADD-ONS > List */}
      <nav className="text-xs text-slate-500 flex items-center space-x-1.5 font-normal">
        <span className="hover:text-slate-800">Beranda</span>
        <span>&gt;</span>
        <span className="text-slate-500">ADD-ONS</span>
        <span>&gt;</span>
        <span className="text-slate-700 font-medium">List</span>
      </nav>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Laporan Barang Cetakan</h1>
        <p className="text-xs text-slate-500 mt-1">
          Menu ini digunakan untuk mencetak laporan rekapitulasi mutasi dan transaksi barang cetakan.
        </p>
      </div>

      {/* Petunjuk Penggunaan yang Jelas */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-xs text-slate-700 flex items-start space-x-2">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-emerald-900 font-semibold">Petunjuk Pembuatan Laporan:</strong> Pilih format dokumen (<span className="font-semibold text-emerald-800">PDF</span> untuk pratinjau dokumen cetak resmi berstempel atau <span className="font-semibold text-emerald-800">XLS</span> untuk unduh spreadsheet), tentukan jenis laporan, atur periode tanggal yang diinginkan, kemudian klik tombol <strong>Cetak</strong>.
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-md text-xs text-emerald-800 flex items-center justify-between w-full animate-in fade-in">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="font-bold text-emerald-700 hover:text-emerald-900">
            ×
          </button>
        </div>
      )}

      {/* Legacy Green Form Box (Exact Screenshot 5: Full Width, Section Card Dihilangkan) */}
      <div className="bg-[#b4dd6b] border border-[#a0ce51] rounded-md p-6 sm:p-7 shadow-sm space-y-4 w-full">
        <div className="max-w-2xl space-y-3">
          {/* Format Selection: PDF or XLS */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-3 text-xs font-semibold text-slate-800 text-right pr-4">
              Format
            </label>
            <div className="col-span-9 flex items-center space-x-6 text-xs font-medium text-slate-800">
              <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="PDF"
                  checked={format === 'PDF'}
                  onChange={() => setFormat('PDF')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center space-x-1">
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>PDF (Dokumen Siap Cetak)</span>
                </span>
              </label>

              <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value="XLS"
                  checked={format === 'XLS'}
                  onChange={() => setFormat('XLS')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="flex items-center space-x-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700" />
                  <span>XLS (Spreadsheet Excel)</span>
                </span>
              </label>
            </div>
          </div>

          {/* Jenis Laporan: Multi-line Listbox */}
          <div className="grid grid-cols-12 items-start gap-2">
            <label className="col-span-3 text-xs font-semibold text-slate-800 text-right pr-4 pt-1">
              Jenis Laporan
            </label>
            <div className="col-span-9">
              <div className="border border-slate-300 rounded bg-white overflow-hidden shadow-inner w-full max-w-md">
                <select
                  size={3}
                  value={selectedReport}
                  onChange={(e) => handleReportChange(e.target.value as '01' | '02')}
                  className="w-full text-xs font-medium text-slate-800 focus:outline-none p-1.5"
                >
                  {reportOptions.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="py-1 px-2 hover:bg-emerald-100 cursor-pointer rounded"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tanggal Periode: [01/05/2026] s.d [24/11/2026] */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-3 text-xs font-semibold text-slate-800 text-right pr-4">
              Tanggal
            </label>
            <div className="col-span-9 flex items-center space-x-2 text-xs">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="01/05/2026"
                className="w-32 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <span className="text-slate-700 font-medium">s.d</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="24/11/2026"
                className="w-32 px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Conditional Fields matching Gambar 1 when Transaksi Barang Cetakan is selected */}
          {selectedReport === '01' && (
            <>
              {/* type: DETAIL */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-3 text-xs font-semibold text-slate-800 text-right pr-4">
                  type
                </label>
                <div className="col-span-9">
                  <select
                    value={reportSubtype}
                    onChange={(e) => setReportSubtype(e.target.value as 'DETAIL' | 'REKAPITULASI')}
                    className="w-full max-w-md px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-inner"
                  >
                    <option value="DETAIL">DETAIL</option>
                    <option value="REKAPITULASI">REKAPITULASI</option>
                  </select>
                </div>
              </div>

              {/* Jenis: Semua */}
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-3 text-xs font-semibold text-slate-800 text-right pr-4">
                  Jenis
                </label>
                <div className="col-span-9">
                  <select
                    value={selectedJenis}
                    onChange={(e) => setSelectedJenis(e.target.value)}
                    className="w-full max-w-md px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-inner"
                  >
                    <option value="Semua">Semua</option>
                    <option value="Buku Tabungan">Buku Tabungan</option>
                    <option value="Bilyet Deposito">Bilyet Deposito</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <hr className="border-t border-[#9acb4b] pt-1" />

        {/* Buttons: [Cetak] with Lock icon and [Tutup] matching Gambar 1 */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCetak}
            className="px-4 py-1.5 bg-[#00a896] hover:bg-[#009282] text-white text-xs font-semibold rounded shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
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
      </div>

      {/* PDF Viewer Modal */}
      <ModalPdfViewer
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        institution={institution}
        reportType={selectedReport}
        reportSubtype={reportSubtype}
        selectedJenis={selectedJenis}
        barangCetakanList={barangCetakanList}
        transaksiList={transaksiList}
        dateRange={{ start: startDate, end: endDate }}
      />
    </div>
  );
};
