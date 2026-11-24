import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen min-h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Reset Data ke Default?
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Tindakan ini akan mengembalikan seluruh data inventaris barang cetakan, daftar nasabah, stok nomor seri, dan riwayat transaksi kembali ke data bawaan awal (default JSON).
              </p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div>• Saldo awal Buku Tabungan: <strong>486</strong></div>
                <div>• Saldo awal Bilyet Deposito: <strong>556</strong></div>
                <div>• Seri buku tabungan: <strong>001685 - 001705</strong> siap cetak</div>
              </div>

              <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-950 leading-relaxed">
                <strong className="font-semibold text-amber-900">Petunjuk Cara Penggunaan:</strong> Klik tombol <strong className="text-amber-800">&quot;Ya, Reset ke Default&quot;</strong> jika Anda ingin mengembalikan seluruh data inventaris dan nasabah ke kondisi bawaan awal, atau klik <strong className="text-slate-700">&quot;Batal&quot;</strong> untuk tetap mempertahankan data saat ini.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-sm transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Mereset Data...' : 'Ya, Reset ke Default'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
