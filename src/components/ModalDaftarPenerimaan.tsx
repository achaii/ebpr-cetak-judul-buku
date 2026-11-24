import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info } from 'lucide-react';
import { StokSeri } from '@/types/inventory';

interface ModalDaftarPenerimaanProps {
  isOpen: boolean;
  onClose: () => void;
  stokSeriList: StokSeri[];
  onSelectSeri: (seri: StokSeri) => void;
  selectedKode?: string;
}

export const ModalDaftarPenerimaan: React.FC<ModalDaftarPenerimaanProps> = ({
  isOpen,
  onClose,
  stokSeriList,
  onSelectSeri,
  selectedKode = 'T',
}) => {
  const [mounted, setMounted] = useState(false);
  const [filterSerie, setFilterSerie] = useState('');
  const [activeSerie, setActiveSerie] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    setActiveSerie(filterSerie.trim());
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterSerie('');
    setActiveSerie('');
    setCurrentPage(1);
  };

  const availableSerials = useMemo(() => {
    return stokSeriList.filter((item) => {
      const matchKode = selectedKode ? item.kode === selectedKode : true;
      const matchStatus = item.status === 'TERSEDIA';
      const matchFilter = activeSerie
        ? item.noSerie.toLowerCase().includes(activeSerie.toLowerCase())
        : true;
      return matchKode && matchStatus && matchFilter;
    });
  }, [stokSeriList, selectedKode, activeSerie]);

  const totalPages = Math.max(1, Math.ceil(availableSerials.length / pageSize));
  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return availableSerials.slice(startIndex, startIndex + pageSize);
  }, [availableSerials, currentPage, pageSize]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Restored Modal Size to max-w-4xl */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-300 animate-in fade-in duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Daftar Penerimaan Barang Cetakan
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menu ini digunakan untuk Melihat Penerimaan Barang Cetakan data yang akan dicetak
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Panduan Cara Penggunaan */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-xs text-slate-700 flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-emerald-900 font-semibold">Petunjuk Cara Penggunaan:</strong>
              <span className="ml-1.5">
                <span className="font-bold text-emerald-800">1.</span> Pilih nomor seri blanko fisik buku tabungan yang berstatus <strong className="text-emerald-800">TERSEDIA</strong> dari tabel di bawah (bisa difilter melalui kotak pencarian no serie).&nbsp;&nbsp;
                <span className="font-bold text-emerald-800">2.</span> Klik pada baris nomor seri yang diinginkan untuk memilih dan memasukkannya ke formulir cetak.
              </span>
            </div>
          </div>

          {/* Green Filter Box */}
          <div className="bg-[#b4dd6b] border border-[#a2cf52] rounded-md p-4 text-xs">
            <div className="max-w-md space-y-2">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-3 text-slate-800 font-medium">No Serie</label>
                <div className="col-span-9">
                  <input
                    type="text"
                    value={filterSerie}
                    onChange={(e) => setFilterSerie(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="Masukkan no serie..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 pt-1">
                <div className="col-span-3"></div>
                <div className="col-span-9 flex space-x-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-1.5 bg-[#1b75bb] hover:bg-[#155d96] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Cari</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Header Info */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div>
              Halaman <span className="font-semibold">{currentPage}</span> dari{' '}
              <span className="font-semibold">{totalPages}</span> (Total {availableSerials.length} seri tersedia)
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-300 rounded overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#127a38] text-white">
                  <th className="py-2.5 px-4 font-semibold border-r border-[#1a8e45] w-48">
                    No Serie
                  </th>
                  <th className="py-2.5 px-4 font-semibold border-r border-[#1a8e45] w-24">
                    Kode
                  </th>
                  <th className="py-2.5 px-4 font-semibold">Nama Barang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      Tidak ada nomor seri barang cetakan yang tersedia. Silakan lakukan penerimaan stok baru.
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item) => (
                    <tr
                      key={item.noSerie}
                      onClick={() => {
                        onSelectSeri(item);
                        onClose();
                      }}
                      className="cursor-pointer hover:bg-[#cbe88d] transition-colors group"
                      title="Klik untuk memilih nomor seri ini"
                    >
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                        {item.noSerie}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-slate-600">
                        {item.kode}
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 font-medium">
                        {item.namaBarang}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 pt-1">
            <div className="flex items-center space-x-2">
              <span>Menampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>data per halaman</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2.5 py-1 border rounded text-xs ${
                      currentPage === pageNum
                        ? 'bg-[#1b75bb] border-[#1b75bb] text-white font-bold'
                        : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
