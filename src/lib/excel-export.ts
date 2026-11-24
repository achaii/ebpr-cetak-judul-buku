import { BarangCetakan, TransaksiBarangCetakan } from '@/types/inventory';

export function exportBarangCetakanToExcel(
  items: BarangCetakan[],
  institutionName: string,
  dateRange: { start: string; end: string }
) {
  const headers = ['No', 'Nama Barang', 'Kode', 'Saldo Awal', 'Debet', 'Kredit', 'Saldo Akhir'];
  const rows = items.map((item, index) => [
    index + 1,
    `"${item.nama}"`,
    `"${item.kode}"`,
    item.saldoAwal,
    item.debet,
    item.kredit,
    item.saldoAkhir,
  ]);

  const totalAwal = items.reduce((acc, i) => acc + i.saldoAwal, 0);
  const totalDebet = items.reduce((acc, i) => acc + i.debet, 0);
  const totalKredit = items.reduce((acc, i) => acc + i.kredit, 0);
  const totalAkhir = items.reduce((acc, i) => acc + i.saldoAkhir, 0);

  rows.push(['Total', '""', '""', totalAwal, totalDebet, totalKredit, totalAkhir]);

  const csvContent = [
    `"${institutionName}"`,
    `"Laporan Barang Cetakan"`,
    `"Periode: ${dateRange.start} s.d ${dateRange.end}"`,
    '',
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\r\n');

  downloadFile(csvContent, `Laporan_Barang_Cetakan_${dateRange.end.replace(/\//g, '-')}.csv`, 'text/csv;charset=utf-8;');
}

export function exportTransaksiToExcel(
  transaksi: TransaksiBarangCetakan[],
  institutionName: string,
  dateRange: { start: string; end: string }
) {
  const headers = [
    'No',
    'NoCIF',
    'Norek',
    'Tanggal',
    'No Serie',
    'Jenis Barang',
    'Tipe',
    'Nama Nasabah',
    'Petugas',
  ];

  const rows = transaksi.map((t, index) => [
    index + 1,
    `"${t.noCIF || t.noTransaksi}"`,
    `"${t.noRekening || t.norek || '-'}"`,
    `"${t.tanggal?.substring(0, 10)}"`,
    `"${t.noSerie}"`,
    `"${t.jenisBarang}"`,
    `"${t.tipe}"`,
    `"${t.namaNasabah}"`,
    `"${t.petugas}"`,
  ]);

  const csvContent = [
    `"${institutionName}"`,
    `"Laporan Transaksi Barang Cetakan"`,
    `"Periode: ${dateRange.start} s.d ${dateRange.end}"`,
    '',
    headers.join(','),
    ...rows.map((r) => r.join(',')),
  ].join('\r\n');

  downloadFile(
    csvContent,
    `Laporan_Transaksi_Barang_Cetakan_${dateRange.end.replace(/\//g, '-')}.csv`,
    'text/csv;charset=utf-8;'
  );
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
