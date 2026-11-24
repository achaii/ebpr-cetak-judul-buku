import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldAlert, KeyRound, AlertCircle, Eye, EyeOff, RotateCcw, Info } from 'lucide-react';
import { StokSeri } from '@/types/inventory';

interface ModalHapusBlankoProps {
  isOpen: boolean;
  onClose: () => void;
  seri: StokSeri | null;
  onConfirmDelete: (noSerie: string) => void;
}

export const ModalHapusBlanko: React.FC<ModalHapusBlankoProps> = ({
  isOpen,
  onClose,
  seri,
  onConfirmDelete,
}) => {
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage('');
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen || !seri || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi password: admin1235
    if (password.trim() !== 'admin1235') {
      setErrorMessage('Password salah! Silakan gunakan password default wifi kantor (admin1235).');
      return;
    }

    onConfirmDelete(seri.noSerie);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-300 animate-in fade-in duration-150">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-rose-50/70">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Otorisasi Pembatalan Blanko Terpakai
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Panduan Cara Penggunaan */}
        <div className="bg-rose-50/40 border-b border-rose-200 px-5 py-2.5 text-xs text-slate-700 flex items-start space-x-2">
          <Info className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900 font-semibold">Petunjuk Cara Penggunaan:</strong>
            <span className="ml-1.5">
              <span className="font-bold text-rose-800">1.</span> Periksa nomor seri dan rekening pemakai di bawah.&nbsp;&nbsp;
              <span className="font-bold text-rose-800">2.</span> Masukkan password default wifi kantor (<strong className="font-mono text-rose-900 bg-rose-100 px-1 py-0.5 rounded border border-rose-200">admin1235</strong>).&nbsp;&nbsp;
              <span className="font-bold text-rose-800">3.</span> Klik <strong className="text-rose-800">&quot;Konfirmasi Hapus / Pulihkan&quot;</strong> untuk mengembalikan status blanko menjadi TERSEDIA di inventaris.
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Item Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Nomor Seri:</span>
              <span className="font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                {seri.noSerie}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Jenis Barang:</span>
              <span className="font-semibold text-slate-800">{seri.namaBarang}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Digunakan Oleh Rekening:</span>
              <span className="font-mono font-bold text-blue-700">{seri.usedBy || '-'}</span>
            </div>
            {seri.usedAt && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tanggal Pemakaian:</span>
                <span className="text-slate-600">{seri.usedAt.substring(0, 10)}</span>
              </div>
            )}
          </div>

          {/* Explanation Alert */}
          <p className="text-slate-600 leading-relaxed">
            Tindakan ini akan <strong>menghapus status terpakai</strong> pada nomor seri ini dan mengembalikannya menjadi <strong className="text-emerald-700">TERSEDIA</strong> di inventaris serta memulihkan saldo stok fisik.
          </p>

          {/* Password Default Hint Callout */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-amber-950 flex items-start space-x-2.5 leading-relaxed">
            <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950">Petunjuk Password Otorisasi:</strong>
              <div className="mt-0.5 text-[11px] text-amber-900">
                Fitur ini dilindungi otorisasi keamanan supervisor. Secara default, gunakan password default wifi kantor:{' '}
                <span className="font-mono font-bold bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400 text-amber-950">
                  admin1235
                </span>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Masukkan Password Administrasi</span>
              <span className="text-[10px] text-slate-500 font-normal">Wajib diisi</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan password wifi kantor (admin1235)..."
                className="w-full pl-3 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 flex items-center space-x-2 text-[11px]">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Konfirmasi Hapus / Pulihkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
