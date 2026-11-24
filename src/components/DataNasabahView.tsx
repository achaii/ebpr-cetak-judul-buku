import React, { useState } from 'react';
import { Users, Search, PlusCircle, CheckCircle, Printer, BookOpen } from 'lucide-react';
import { Nasabah } from '@/types/inventory';

interface DataNasabahViewProps {
  nasabahList: Nasabah[];
  onSelectForPrint: (nasabah: Nasabah) => void;
  onAddNewNasabah: (nasabah: Omit<Nasabah, 'id' | 'statusBuku' | 'lastPrintedSerial'>) => void;
}

export const DataNasabahView: React.FC<DataNasabahViewProps> = ({
  nasabahList,
  onSelectForPrint,
  onAddNewNasabah,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New account form state
  const [noRekening, setNoRekening] = useState('');
  const [noPermohonan, setNoPermohonan] = useState('');
  const [noRegister, setNoRegister] = useState('');
  const [namaNasabah, setNamaNasabah] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jenisProduk, setJenisProduk] = useState('TAB MAPAN');

  const filteredNasabah = nasabahList.filter((n) => {
    const q = searchTerm.toLowerCase();
    return (
      n.namaNasabah.toLowerCase().includes(q) ||
      n.noRekening.toLowerCase().includes(q) ||
      n.noPermohonan.toLowerCase().includes(q) ||
      n.alamat.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noRekening || !namaNasabah || !noRegister) {
      alert('Mohon lengkapi data no rekening, no register, dan nama nasabah!');
      return;
    }

    onAddNewNasabah({
      noRekening: noRekening.trim(),
      noPermohonan: noPermohonan.trim() || noRekening.trim(),
      noRegister: noRegister.trim(),
      namaNasabah: namaNasabah.trim().toUpperCase(),
      alamat: alamat.trim().toUpperCase(),
      jenisProduk,
      tanggalBuka: new Date().toISOString().substring(0, 10),
    });

    setShowAddForm(false);
    setNoRekening('');
    setNoPermohonan('');
    setNoRegister('');
    setNamaNasabah('');
    setAlamat('');
    alert('Data nasabah baru berhasil ditambahkan!');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center space-x-1.5 font-medium">
        <span className="hover:text-slate-800">Beranda</span>
        <span>&gt;</span>
        <span className="text-slate-800 font-semibold">Master Data Nasabah</span>
      </nav>

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Master Data Nasabah</h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar nasabah penabung BPR dengan status cetak judul buku tabungan
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Nasabah Baru'}</span>
        </button>
      </div>

      {/* Add New Nasabah Form */}
      {showAddForm && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 shadow-sm animate-in fade-in">
          <h2 className="text-sm font-bold text-emerald-900 border-b border-emerald-200 pb-2 mb-4">
            Formulir Pendaftaran Nasabah Tabungan Baru
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs max-w-2xl">
            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">No Rekening *</label>
              <div className="col-span-8">
                <input
                  type="text"
                  required
                  placeholder="Contoh: 100230002700"
                  value={noRekening}
                  onChange={(e) => setNoRekening(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">No Permohonan</label>
              <div className="col-span-8">
                <input
                  type="text"
                  placeholder="Contoh: 100260002750"
                  value={noPermohonan}
                  onChange={(e) => setNoPermohonan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">Nomor Register (CIF) *</label>
              <div className="col-span-8">
                <input
                  type="text"
                  required
                  placeholder="Contoh: 100200002800"
                  value={noRegister}
                  onChange={(e) => setNoRegister(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">Nama Lengkap *</label>
              <div className="col-span-8">
                <input
                  type="text"
                  required
                  placeholder="Contoh: BUDI HERMAWAN"
                  value={namaNasabah}
                  onChange={(e) => setNamaNasabah(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded uppercase font-semibold focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-4 font-semibold text-slate-800">Jenis Produk</label>
              <div className="col-span-8">
                <select
                  value={jenisProduk}
                  onChange={(e) => setJenisProduk(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 font-medium"
                >
                  <option value="TAB MAPAN">TAB MAPAN</option>
                  <option value="TAB BERJANGKA">TAB BERJANGKA</option>
                  <option value="TAB SIMPEL">TAB SIMPEL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 items-start gap-2">
              <label className="col-span-4 font-semibold text-slate-800 pt-1">Alamat Nasabah</label>
              <div className="col-span-8">
                <textarea
                  rows={2}
                  placeholder="Contoh: JL CIPADUNG NO 12 RT 01 RW 04"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 pt-2">
              <div className="col-span-4"></div>
              <div className="col-span-8 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Simpan Nasabah
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari rekening, nama, atau alamat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <div className="text-xs text-slate-500">
            Menampilkan <strong>{filteredNasabah.length}</strong> nasabah
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#127a38] text-white">
              <tr>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-36">No Rekening</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-32">No Register</th>
                <th className="py-2.5 px-4 border-r border-[#1a8e45] w-48">Nama Nasabah</th>
                <th className="py-2.5 px-4 border-r border-[#1a8e45]">Alamat</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-28">Produk</th>
                <th className="py-2.5 px-3 border-r border-[#1a8e45] w-28 text-center">Status Buku</th>
                <th className="py-2.5 px-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredNasabah.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 font-mono font-bold text-blue-700">{n.noRekening}</td>
                  <td className="py-2 px-3 font-mono text-slate-600">{n.noRegister}</td>
                  <td className="py-2 px-4 font-bold text-slate-800">{n.namaNasabah}</td>
                  <td className="py-2 px-4 text-slate-600 text-[11px] leading-tight">{n.alamat}</td>
                  <td className="py-2 px-3 text-slate-700 font-medium">{n.jenisProduk}</td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        n.statusBuku === 'Sudah Dicetak'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {n.statusBuku}
                    </span>
                    {n.lastPrintedSerial && (
                      <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                        Seri: {n.lastPrintedSerial}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onSelectForPrint(n)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold inline-flex items-center space-x-1 shadow-sm"
                      title="Buka form cetak judul buku untuk nasabah ini"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Cetak</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
