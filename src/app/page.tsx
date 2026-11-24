'use client';

import React, { useState, useEffect } from 'react';
import {
  loadDatabaseFromLocalStorage,
  saveDatabaseToLocalStorage,
  resetDatabaseToDefault,
  getDefaultDatabase,
} from '@/lib/storage';
import { AppDatabase } from '@/types/inventory';
import { Navbar } from '@/components/Navbar';
import { CetakJudulBukuView } from '@/components/CetakJudulBukuView';
import { LaporanView } from '@/components/LaporanView';
import { StokInventarisView } from '@/components/StokInventarisView';
import { ResetConfirmModal } from '@/components/ResetConfirmModal';

export default function Home() {
  const [db, setDb] = useState<AppDatabase>(getDefaultDatabase());
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('cetak_buku');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load database on initial mount
  useEffect(() => {
    async function initData() {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const serverData = await res.json();
          if (serverData && serverData.nasabah) {
            setDb(serverData);
            saveDatabaseToLocalStorage(serverData);
            setIsLoaded(true);
            return;
          }
        }
      } catch (e) {
        console.warn('Using client-side storage:', e);
      }
      const localData = loadDatabaseFromLocalStorage();
      setDb(localData);
      setIsLoaded(true);
    }
    initData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Handler: Print success (updates serial, nasabah, barang cetakan stock, and adds transaction)
  const handlePrintSuccess = (rekening: string, noSerie: string) => {
    const timestamp = new Date().toISOString();
    const currentDateStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const targetNasabah = db.nasabah.find((n) => n.noRekening === rekening);
    const nama = targetNasabah ? targetNasabah.namaNasabah : 'Nasabah';

    // 1. Update nasabah record
    const updatedNasabah = db.nasabah.map((n) => {
      if (n.noRekening === rekening) {
        return {
          ...n,
          statusBuku: 'Sudah Dicetak' as const,
          lastPrintedSerial: noSerie,
          lastPrintedDate: timestamp,
        };
      }
      return n;
    });

    // 2. Update stock serials
    const updatedStokSeri = db.stokSeri.map((s) => {
      if (s.noSerie === noSerie) {
        return {
          ...s,
          status: 'TERPAKAI' as const,
          usedBy: rekening,
          usedAt: timestamp,
        };
      }
      return s;
    });

    // 3. Update Barang Cetakan stock (Buku Tabungan: Debet + 1, Saldo Akhir - 1)
    const updatedBarangCetakan = db.barangCetakan.map((b) => {
      if (b.kode === 'T') {
        const newDebet = b.debet + 1;
        const newSaldoAkhir = b.saldoAwal - newDebet + b.kredit;
        return {
          ...b,
          debet: newDebet,
          saldoAkhir: newSaldoAkhir,
        };
      }
      return b;
    });

    // 4. Record Transaction log
    const newTrx = {
      id: `TRX-${Date.now()}`,
      tanggal: `${currentDateStr} ${new Date().toLocaleTimeString('id-ID')}`,
      noTransaksi: `TRX/BC/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(db.transaksi.length + 1).padStart(4, '0')}`,
      jenisBarang: 'Buku Tabungan',
      kode: 'T',
      tipe: 'PENGELUARAN' as const,
      jumlah: 1,
      noSerie: noSerie,
      noRekening: rekening,
      noCIF: targetNasabah ? targetNasabah.noRegister : '100200000000',
      namaNasabah: nama,
      keterangan: `Cetak Judul Buku Tabungan Baru No Seri ${noSerie}`,
      petugas: 'CS-01 (OPERATOR)',
      status: 'SELESAI' as const,
    };

    const newDb: AppDatabase = {
      ...db,
      nasabah: updatedNasabah,
      stokSeri: updatedStokSeri,
      barangCetakan: updatedBarangCetakan,
      transaksi: [newTrx, ...db.transaksi],
      lastUpdated: timestamp,
    };

    setDb(newDb);
    saveDatabaseToLocalStorage(newDb);
    showToast(`Buku Tabungan No Seri ${noSerie} berhasil dicetak untuk Rek: ${rekening} dan mutasi inventaris telah diperbarui!`);
  };

  // Handler: Add new stock receiving (Penerimaan Stok Baru)
  const handleAddStockPenerimaan = (data: {
    kode: string;
    seriAwal: number;
    seriAkhir: number;
    keterangan: string;
  }) => {
    const timestamp = new Date().toISOString();
    const count = data.seriAkhir - data.seriAwal + 1;
    const isTabungan = data.kode === 'T';
    const namaBarang = isTabungan ? 'Buku Tabungan Baru' : 'Bilyet Deposito Baru';
    const jenisBarang = isTabungan ? 'Buku Tabungan' : 'Bilyet Deposito';

    const newSerials = [];
    for (let i = data.seriAwal; i <= data.seriAkhir; i++) {
      const seriStr = isTabungan
        ? String(i).padStart(6, '0')
        : `D-${String(i).padStart(6, '0')}`;
      newSerials.push({
        noSerie: seriStr,
        kode: data.kode,
        namaBarang,
        status: 'TERSEDIA' as const,
        tglPenerimaan: timestamp.substring(0, 10),
        usedBy: null,
        usedAt: null,
      });
    }

    const updatedBarangCetakan = db.barangCetakan.map((b) => {
      if (b.kode === data.kode) {
        const newKredit = b.kredit + count;
        const newSaldoAkhir = b.saldoAwal - b.debet + newKredit;
        return {
          ...b,
          kredit: newKredit,
          saldoAkhir: newSaldoAkhir,
        };
      }
      return b;
    });

    const newTrx = {
      id: `TRX-${Date.now()}`,
      tanggal: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
      noTransaksi: `TRX/BC/IN/${Date.now().toString().slice(-6)}`,
      jenisBarang,
      kode: data.kode,
      tipe: 'PENERIMAAN' as const,
      jumlah: count,
      noSerie: `${newSerials[0].noSerie} s.d ${newSerials[newSerials.length - 1].noSerie}`,
      noRekening: '-',
      namaNasabah: 'Penerimaan Logistik Percetakan',
      keterangan: data.keterangan,
      petugas: 'LOG-01 (PETUGAS GUDANG)',
      status: 'SELESAI' as const,
    };

    const newDb: AppDatabase = {
      ...db,
      barangCetakan: updatedBarangCetakan,
      stokSeri: [...newSerials, ...db.stokSeri],
      transaksi: [newTrx, ...db.transaksi],
      lastUpdated: timestamp,
    };

    setDb(newDb);
    saveDatabaseToLocalStorage(newDb);
    showToast(`Penerimaan ${count} unit ${namaBarang} berhasil ditambahkan ke inventaris!`);
  };

  // Handler: Delete / Revert used blanko serial (authorized via admin1235)
  const handleDeleteUsedSerial = (noSerie: string) => {
    const timestamp = new Date().toISOString();
    const targetSeri = db.stokSeri.find((s) => s.noSerie === noSerie);
    if (!targetSeri) return;

    const usedByRekening = targetSeri.usedBy;

    // 1. Revert serial status to TERSEDIA and clear usage info
    const updatedStokSeri = db.stokSeri.map((s) => {
      if (s.noSerie === noSerie) {
        return {
          ...s,
          status: 'TERSEDIA' as const,
          usedBy: null,
          usedAt: null,
        };
      }
      return s;
    });

    // 2. Adjust physical stock debet and saldo akhir
    const updatedBarangCetakan = db.barangCetakan.map((b) => {
      if (b.kode === targetSeri.kode) {
        const newDebet = Math.max(0, b.debet - 1);
        const newSaldoAkhir = b.saldoAwal - newDebet + b.kredit;
        return {
          ...b,
          debet: newDebet,
          saldoAkhir: newSaldoAkhir,
        };
      }
      return b;
    });

    // 3. Revert nasabah statusBuku if it was linked to this serial
    const updatedNasabah = db.nasabah.map((n) => {
      if (n.lastPrintedSerial === noSerie) {
        return {
          ...n,
          statusBuku: 'Belum Dicetak' as const,
          lastPrintedSerial: null,
          lastPrintedDate: null,
        };
      }
      return n;
    });

    // 4. Record cancellation log in transactions
    const cancelTrx = {
      id: `TRX-BATAL-${Date.now()}`,
      tanggal: `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
      noTransaksi: `BATAL/BC/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(db.transaksi.length + 1).padStart(4, '0')}`,
      jenisBarang: targetSeri.namaBarang,
      kode: targetSeri.kode,
      tipe: 'PENERIMAAN' as const,
      jumlah: 1,
      noSerie: noSerie,
      noRekening: usedByRekening || '-',
      namaNasabah: 'Pembatalan Blanko Terpakai',
      keterangan: `Pembatalan status nomor seri ${noSerie} (Otorisasi: admin1235)`,
      petugas: 'SUPERVISOR (ADMIN)',
      status: 'BATAL' as const,
    };

    const newDb: AppDatabase = {
      ...db,
      stokSeri: updatedStokSeri,
      barangCetakan: updatedBarangCetakan,
      nasabah: updatedNasabah,
      transaksi: [cancelTrx, ...db.transaksi],
      lastUpdated: timestamp,
    };

    setDb(newDb);
    saveDatabaseToLocalStorage(newDb);

    try {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDb),
      }).catch((e) => console.warn('Sync API failed:', e));
    } catch (e) {
      console.warn('Sync API error:', e);
    }

    showToast(`Nomor seri ${noSerie} berhasil dibatalkan dan status blanko kembali TERSEDIA!`);
  };

  // Handler: Reset Database to Default JSON
  const handleConfirmReset = async () => {
    setResetLoading(true);
    try {
      const freshData = resetDatabaseToDefault();
      setDb(freshData);
      setIsResetModalOpen(false);
      showToast('Database berhasil di-reset kembali ke data default awal!');
    } catch (err) {
      console.error('Reset error:', err);
      alert('Gagal mereset data.');
    } finally {
      setResetLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-600">Memuat Sistem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs flex items-center space-x-2 border border-slate-700 animate-in slide-in-from-top-4 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar (Full Width) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        institution={db.institution}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Main Content Area (Full Width edge-to-edge as in Gambar 1) */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5">
        {currentTab === 'cetak_buku' && (
          <CetakJudulBukuView
            nasabahList={db.nasabah}
            stokSeriList={db.stokSeri}
            institution={db.institution}
            onPrintSuccess={handlePrintSuccess}
          />
        )}

        {currentTab === 'laporan' && (
          <LaporanView
            institution={db.institution}
            barangCetakanList={db.barangCetakan}
            transaksiList={db.transaksi}
          />
        )}

        {currentTab === 'stok' && (
          <StokInventarisView
            barangCetakanList={db.barangCetakan}
            stokSeriList={db.stokSeri}
            onAddStockPenerimaan={handleAddStockPenerimaan}
            onDeleteUsedSerial={handleDeleteUsedSerial}
          />
        )}
      </main>

      {/* System Footer with Steve Jobs Quote */}
      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 w-full text-center space-y-2">
        <div className="max-w-2xl mx-auto px-4">
          <blockquote className="italic text-slate-600 text-xs sm:text-[13px] font-serif leading-relaxed">
            &ldquo;Design is not just what it looks like and feels like. Design is how it works.&rdquo;
          </blockquote>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            — <span className="font-semibold text-slate-700">Steve Jobs</span> (Pendiri Apple)
          </p>
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center pt-2 border-t border-slate-100">
          <div>
            © 2026 <strong>{db.institution.name}</strong> • Cetak Judul Buku
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        loading={resetLoading}
      />
    </div>
  );
}
