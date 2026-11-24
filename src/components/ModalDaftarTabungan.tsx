import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Nasabah } from '@/types/inventory';

interface ModalDaftarTabunganProps {
  isOpen: boolean;
  onClose: () => void;
  nasabahList: Nasabah[];
  onSelectNasabah: (nasabah: Nasabah) => void;
}

export const ModalDaftarTabungan: React.FC<ModalDaftarTabunganProps> = ({
  isOpen,
  onClose,
  nasabahList,
  onSelectNasabah,
}) => {
  const [mounted, setMounted] = useState(false);
  const [filterPermohonan, setFilterPermohonan] = useState('');
  const [filterRekening, setFilterRekening] = useState('');
  const [filterNama, setFilterNama] = useState('');

  const [activePermohonan, setActivePermohonan] = useState('');
  const [activeRekening, setActiveRekening] = useState('');
  const [activeNama, setActiveNama] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    setActivePermohonan(filterPermohonan.trim());
    setActiveRekening(filterRekening.trim());
    setActiveNama(filterNama.trim());
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterPermohonan('');
    setFilterRekening('');
    setFilterNama('');
    setActivePermohonan('');
    setActiveRekening('');
    setActiveNama('');
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return nasabahList.filter((item) => {
      const matchPermohonan = activePermohonan
        ? item.noPermohonan.toLowerCase().includes(activePermohonan.toLowerCase())
        : true;
      const matchRekening = activeRekening
        ? item.noRekening.toLowerCase().includes(activeRekening.toLowerCase())
        : true;
      const matchNama = activeNama
        ? item.namaNasabah.toLowerCase().includes(activeNama.toLowerCase())
        : true;
      return matchPermohonan && matchRekening && matchNama;
    });
  }, [nasabahList, activePermohonan, activeRekening, activeNama]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  if (!isOpen || !mounted) return null;

  // Mount directly to document.body so the backdrop covers 100% of the viewport (top 0px to bottom 100vh)
  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Restored Modal Size to max-w-6xl before previous edit */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-300 animate-in fade-in duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-800">Daftar Tabungan</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Menu ini digunakan untuk Melihat informasi data yang akan dicetak
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
          {/* Green Filter Box (Exact Legacy Style) */}
          <div className="bg-[#b4dd6b] border border-[#a2cf52] rounded-md p-4 text-xs">
            <div className="max-w-md space-y-2">
              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-800 font-medium">No Permohonan</label>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={filterPermohonan}
                    onChange={(e) => setFilterPermohonan(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="Masukkan no permohonan..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-800 font-medium">No Rekening</label>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={filterRekening}
                    onChange={(e) => setFilterRekening(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="Masukkan no rekening..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <label className="col-span-4 text-slate-800 font-medium">Nama Nasabah</label>
                <div className="col-span-8">
                  <input
                    type="text"
                    value={filterNama}
                    onChange={(e) => setFilterNama(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="Masukkan nama nasabah..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2 pt-1">
                <div className="col-span-4"></div>
                <div className="col-span-8 flex space-x-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="px-4 py-1.5 bg-[#1b75bb] hover:bg-[#155d96] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <Search className="w-3 h-3" />
                    <span>Cari</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-semibold rounded shadow-sm transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
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
              <span className="font-semibold">{totalPages}</span> (Total {filteredData.length} data)
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-300 rounded overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#127a38] text-white">
                  <th className="py-2.5 px-3 font-semibold border-r border-[#1a8e45] w-36">
                    No Rekening
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-r border-[#1a8e45] w-36">
                    No Permohonan
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-r border-[#1a8e45] w-48">
                    Nama Nasabah
                  </th>
                  <th className="py-2.5 px-3 font-semibold border-r border-[#1a8e45]">
                    Alamat Nasabah
                  </th>
                  <th className="py-2.5 px-3 font-semibold w-28">Jenis Produk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Tidak ada data tabungan yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        onSelectNasabah(item);
                        onClose();
                      }}
                      className="cursor-pointer hover:bg-emerald-50 transition-colors group"
                      title="Klik untuk memilih data ini"
                    >
                      <td className="py-2 px-3 font-mono font-medium text-blue-700 group-hover:underline">
                        {item.noRekening}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">{item.noPermohonan}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{item.namaNasabah}</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] leading-tight">
                        {item.alamat}
                      </td>
                      <td className="py-2 px-3 text-slate-700 font-medium">{item.jenisProduk}</td>
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
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Halaman pertama"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Halaman sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page numbers */}
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

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-1 text-slate-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2.5 py-1 border border-slate-300 rounded text-xs bg-white hover:bg-slate-100 text-slate-700"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Halaman berikutnya"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Halaman terakhir"
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
