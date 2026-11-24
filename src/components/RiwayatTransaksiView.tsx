import React, { useState } from 'react';
import { History, Search, Download, CheckCircle2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { TransaksiBarangCetakan, Institution } from '@/types/inventory';
import { exportTransaksiToExcel } from '@/lib/excel-export';

interface RiwayatTransaksiViewProps {
  transaksiList: TransaksiBarangCetakan[];
  institution: Institution;
}

export const RiwayatTransaksiView: React.FC<RiwayatTransaksiViewProps> = ({
  transaksiList,
  institution,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState<'ALL' | 'PENGELUARAN' | 'PENERIMAAN'>('ALL');

  const filtered = transaksiList.filter((t) => {
    const matchTipe = filterTipe === 'ALL' || t.tipe === filterTipe;
    const q = searchTerm.toLowerCase();
    const matchSearch =
      t.noTransaksi.toLowerCase().includes(q) ||
      t.namaNasabah.toLowerCase().includes(q) ||
      t.noSerie.toLowerCase().includes(q) ||
      t.noRekening.toLowerCase().includes(q) ||
      t.petugas.toLowerCase().includes(q);
    return matchTipe && matchSearch;
  });

  const handleExport = () => {
    exportTransaksiToExcel(filtered, institution.name, {
      start: '01/07/2026',
      end: '24/11/2026',
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center space-x-1.5 font-medium">
        <span className="hover:text-slate-800">Beranda</span>
        <span>&gt;</span>
        <span className="text-slate-800 font-semibold">Riwayat Transaksi Barang Cetakan</span>
      </nav>

      {/* Header and Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Log Riwayat Transaksi & Pencetakan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail seluruh mutasi barang cetakan, penerbitan buku tabungan, dan penerimaan blanko
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export ke Excel (CSV)</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari transaksi, no seri, atau nasabah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <select
              value={filterTipe}
              onChange={(e) => setFilterTipe(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-xs font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">Semua Tipe Mutasi</option>
              <option value="PENGELUARAN">Pengeluaran (Debet / Cetak)</option>
              <option value="PENERIMAAN">Penerimaan (Kredit / Masuk)</option>
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Total <strong>{filtered.length}</strong> transaksi tercatat
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#127a38] text-white">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-10 text-center">No</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-28">Waktu Transaksi</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-36">No Transaksi</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-28">Jenis Barang</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-24 text-center">Mutasi</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-24">No Serie</th>
                <th className="py-2.5 px-4 border-r border-[#1a8e45]">Nasabah / Penerima</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-28">Petugas</th>
                <th className="py-2.5 px-3 text-center w-20">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Belum ada riwayat transaksi yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                      {item.tanggal}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-700 font-semibold">
                      {item.noTransaksi}
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800">{item.jenisBarang}</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.tipe === 'PENGELUARAN'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {item.tipe === 'PENGELUARAN' ? (
                          <ArrowDownRight className="w-3 h-3 text-amber-700" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-emerald-700" />
                        )}
                        <span>{item.tipe}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{item.noSerie}</td>
                    <td className="py-2 px-4 text-slate-800">
                      <div className="font-bold">{item.namaNasabah}</div>
                      {item.noRekening !== '-' && (
                        <div className="text-[11px] text-blue-700 font-mono">
                          Rek: {item.noRekening}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500">{item.keterangan}</div>
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px] font-medium">
                      {item.petugas}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
