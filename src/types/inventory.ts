export interface Institution {
  name: string;
  address: string;
  branchCode: string;
  branchName: string;
  phone: string;
  systemName: string;
}

export interface Nasabah {
  id: string;
  noRekening: string;
  noPermohonan: string;
  noRegister: string;
  namaNasabah: string;
  alamat: string;
  jenisProduk: string;
  tanggalBuka: string;
  statusBuku: 'Belum Dicetak' | 'Sudah Dicetak';
  lastPrintedSerial: string | null;
  lastPrintedDate?: string | null;
}

export interface BarangCetakan {
  id: string;
  kode: string;
  nama: string;
  namaBarang: string;
  satuan: string;
  saldoAwal: number;
  debet: number;
  kredit: number;
  saldoAkhir: number;
  minStok: number;
}

export interface StokSeri {
  noSerie: string;
  kode: string;
  namaBarang: string;
  status: 'TERSEDIA' | 'TERPAKAI';
  tglPenerimaan: string;
  usedBy: string | null; // noRekening
  usedAt: string | null; // timestamp
}

export interface TransaksiBarangCetakan {
  id: string;
  tanggal: string;
  noTransaksi: string;
  jenisBarang: string;
  kode: string;
  tipe: 'PENGELUARAN' | 'PENERIMAAN';
  jumlah: number;
  noSerie: string;
  noRekening: string;
  norek?: string;
  noCIF?: string;
  namaNasabah: string;
  keterangan: string;
  petugas: string;
  status: 'SELESAI' | 'BATAL';
}

export interface AppDatabase {
  institution: Institution;
  nasabah: Nasabah[];
  barangCetakan: BarangCetakan[];
  stokSeri: StokSeri[];
  transaksi: TransaksiBarangCetakan[];
  lastUpdated: string;
}
