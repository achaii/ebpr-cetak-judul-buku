import React, { useState } from 'react';
import { PlusCircle, PackagePlus, Search, Info } from 'lucide-react';
import { BarangCetakan, StokSeri } from '@/types/inventory';

interface StokInventarisViewProps {
  barangCetakanList: BarangCetakan[];
  stokSeriList: StokSeri[];
  onAddStockPenerimaan: (data: {
    kode: string;
    seriAwal: number;
    seriAkhir: number;
    keterangan: string;
  }) => void;
}

export const StokInventarisView: React.FC<StokInventarisViewProps> = ({
  stokSeriList,
  onAddStockPenerimaan,
}) => {
  const [filterKode, setFilterKode] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchSeri, setSearchSeri] = useState('');

  // Form Penerimaan Stok Baru
  const [showAddForm, setShowAddForm] = useState(false);
  const [kodeItem, setKodeItem] = useState('T');
  const [seriAwal, setSeriAwal] = useState('');
  const [seriAkhir, setSeriAkhir] = useState('');
  const [keterangan, setKeterangan] = useState('Penerimaan Blanko Baru dari Vendor Percetakan');

  const filteredSerials = stokSeriList.filter((s) => {
    const matchKode = filterKode === 'ALL' || s.kode === filterKode;
    const matchStatus = filterStatus === 'ALL' || s.status === filterStatus;
    const matchSearch = searchSeri
      ? s.noSerie.toLowerCase().includes(searchSeri.toLowerCase())
      : true;
    return matchKode && matchStatus && matchSearch;
  });

  const availableCount = stokSeriList.filter((s) => s.status === 'TERSEDIA').length;
  const usedCount = stokSeriList.filter((s) => s.status === 'TERPAKAI').length;

  const handleSubmitPenerimaan = (e: React.FormEvent) => {
    e.preventDefault();
    const awal = parseInt(seriAwal, 10);
    const akhir = parseInt(seriAkhir, 10);

    if (isNaN(awal) || isNaN(akhir) || awal <= 0 || akhir < awal) {
      alert('Harap masukkan rentang nomor seri awal dan akhir yang valid.');
      return;
    }

    if (akhir - awal > 500) {
      alert('Maksimal penerimaan dalam satu kali input adalah 500 nomor seri.');
      return;
    }

    onAddStockPenerimaan({
      kode: kodeItem,
      seriAwal: awal,
      seriAkhir: akhir,
      keterangan,
    });

    setShowAddForm(false);
    setSeriAwal('');
    setSeriAkhir('');
    alert(`Penerimaan ${akhir - awal + 1} unit nomor seri blanko baru berhasil dicatat ke inventaris.`);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center space-x-1.5 font-normal">
        <span className="hover:text-slate-800">Beranda</span>
        <span>&gt;</span>
        <span className="text-slate-700 font-medium">Barang Cetakan</span>
      </nav>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Barang Cetakan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan stok fisik blanko, pencatatan mutasi penerimaan baru, dan pengawasan nomor seri.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Formulir' : 'Penerimaan Stok Baru'}</span>
        </button>
      </div>

      {/* Petunjuk / Tata Cara Operasional */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-md p-3 text-xs text-slate-700 flex items-start space-x-2">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-emerald-900 font-semibold">Tata Cara Penerimaan Blanko:</strong> Saat menerima kiriman fisik buku tabungan atau bilyet deposito dari vendor percetakan, klik tombol <span className="font-semibold text-emerald-800">Penerimaan Stok Baru</span>, pilih jenis barang, masukkan nomor seri awal hingga akhir, lalu simpan agar nomor seri tersebut langsung tersedia untuk dicetak ke nasabah.
        </div>
      </div>

      {/* Form Penerimaan Stok Baru */}
      {showAddForm && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-md p-6 shadow-sm animate-in fade-in w-full">
          <div className="flex items-center space-x-2 border-b border-emerald-200 pb-3 mb-4">
            <PackagePlus className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm font-bold text-emerald-900">
              Formulir Penerimaan Blanko Baru (Mutasi Kredit)
            </h2>
          </div>

          <form onSubmit={handleSubmitPenerimaan} className="space-y-4 max-w-xl text-xs">
            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">Jenis Barang Cetakan</label>
              <div className="col-span-8">
                <select
                  value={kodeItem}
                  onChange={(e) => setKodeItem(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="T">Buku Tabungan Baru (Kode: T)</option>
                  <option value="D">Bilyet Deposito Baru (Kode: D)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-0.5">Pilih kategori fisik blanko yang baru diterima dari vendor</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">
                Nomor Seri Awal
              </label>
              <div className="col-span-8">
                <input
                  type="number"
                  required
                  placeholder="Contoh: 1706"
                  value={seriAwal}
                  onChange={(e) => setSeriAwal(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Nomor urut seri fisik awal pada bendel/dus blanko percetakan</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">
                Nomor Seri Akhir
              </label>
              <div className="col-span-8">
                <input
                  type="number"
                  required
                  placeholder="Contoh: 1750"
                  value={seriAkhir}
                  onChange={(e) => setSeriAkhir(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono focus:ring-1 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Nomor urut seri fisik akhir pada bendel/dus blanko percetakan</p>
              </div>
            </div>

            <div className="grid grid-cols-12 items-start gap-2">
              <label className="col-span-4 font-semibold text-slate-800 pt-1">Keterangan Penerimaan</label>
              <div className="col-span-8">
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600"
                  placeholder="Contoh: Penerimaan blanko kiriman vendor percetakan batch II"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">Nomor Surat Jalan (DO), nama vendor percetakan, atau batch penerimaan logistik</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 pt-2">
              <div className="col-span-4"></div>
              <div className="col-span-8 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded shadow-sm"
                >
                  Simpan Penerimaan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Serials Table (Full Width, Card Ringkasan Telah Dihilangkan) */}
      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden w-full">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800">Daftar Fisik Nomor Seri Blanko:</span>
            <div className="flex space-x-1.5">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                Tersedia: {availableCount} blanko
              </span>
              <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-300">
                Terpakai: {usedCount} blanko
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter by Code */}
            <select
              value={filterKode}
              onChange={(e) => setFilterKode(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">Semua Jenis Barang</option>
              <option value="T">Buku Tabungan (T)</option>
              <option value="D">Bilyet Deposito (D)</option>
            </select>

            {/* Filter by Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white font-medium focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ALL">Semua Status</option>
              <option value="TERSEDIA">Hanya Blanko TERSEDIA</option>
              <option value="TERPAKAI">Hanya Blanko TERPAKAI</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nomor seri..."
                value={searchSeri}
                onChange={(e) => setSearchSeri(e.target.value)}
                className="pl-7 pr-3 py-1 border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-emerald-600 w-40"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* Table of Serials */}
        <div className="max-h-96 overflow-y-auto w-full">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#127a38] text-white sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-12 text-center">No</th>
                <th className="py-2.5 px-4 border-r border-[#1a8e45] w-36">No Serie</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-20 text-center">Kode</th>
                <th className="py-2.5 px-4 border-r border-[#1a8e45]">Nama Barang</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-28 text-center">Status Blanko</th>
                <th className="py-2.5 px-4">Digunakan Oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredSerials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                    Tidak ada nomor seri blanko yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredSerials.map((s, idx) => (
                  <tr key={s.noSerie} className="hover:bg-emerald-50/60 transition-colors">
                    <td className="py-2 px-3 text-center text-slate-500 font-sans">{idx + 1}</td>
                    <td className="py-2 px-4 font-bold text-slate-800">{s.noSerie}</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-600">{s.kode}</td>
                    <td className="py-2 px-4 font-sans text-slate-700">{s.namaBarang}</td>
                    <td className="py-2 px-3 text-center font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.status === 'TERSEDIA'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 font-sans text-slate-600 text-[11px]">
                      {s.usedBy ? (
                        <span>
                          Rekening: <strong className="font-mono text-blue-700">{s.usedBy}</strong>{' '}
                          <span className="text-slate-400">({s.usedAt?.substring(0, 10)})</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
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
