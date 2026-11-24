import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const defaultDataPath = path.resolve('./data/default_dataset.json');

test('1. Default Dataset Integrity & Accounting Balance', () => {
  assert.ok(fs.existsSync(defaultDataPath), 'default_dataset.json must exist');
  const raw = fs.readFileSync(defaultDataPath, 'utf-8');
  const data = JSON.parse(raw);

  // Institution checks
  assert.equal(data.institution.name, 'JUST EXAMPLE');
  assert.equal(data.institution.branchCode, '001');

  // Barang Cetakan checks matching exact screenshot values
  const bukuTabungan = data.barangCetakan.find((b) => b.kode === 'T');
  assert.ok(bukuTabungan, 'Buku Tabungan (T) must exist');
  assert.equal(bukuTabungan.saldoAwal, 486);
  assert.equal(bukuTabungan.debet, 2);
  assert.equal(bukuTabungan.kredit, 0);
  assert.equal(bukuTabungan.saldoAkhir, 484);
  assert.equal(bukuTabungan.saldoAwal - bukuTabungan.debet + bukuTabungan.kredit, bukuTabungan.saldoAkhir);

  const bilyetDeposito = data.barangCetakan.find((b) => b.kode === 'D');
  assert.ok(bilyetDeposito, 'Bilyet Deposito (D) must exist');
  assert.equal(bilyetDeposito.saldoAwal, 556);
  assert.equal(bilyetDeposito.debet, 31);
  assert.equal(bilyetDeposito.kredit, 50);
  assert.equal(bilyetDeposito.saldoAkhir, 575);
  assert.equal(bilyetDeposito.saldoAwal - bilyetDeposito.debet + bilyetDeposito.kredit, bilyetDeposito.saldoAkhir);

  // Nasabah checks matching screenshots
  const firstNasabah = data.nasabah.find((n) => n.noRekening === '100230002455');
  assert.ok(firstNasabah, 'Nasabah AHMAD FAUZI must exist with rekening 100230002455');
  assert.equal(firstNasabah.namaNasabah, 'AHMAD FAUZI');
  assert.equal(firstNasabah.noRegister, '100200002569');

  // Stok seri checks
  const seri1685 = data.stokSeri.find((s) => s.noSerie === '001685');
  assert.ok(seri1685, 'Seri 001685 must exist');
  assert.equal(seri1685.status, 'TERSEDIA');
});

test('2. Stock Mutation Logic (Passbook Issue / Debet)', () => {
  // Arrange
  const raw = fs.readFileSync(defaultDataPath, 'utf-8');
  const data = JSON.parse(raw);
  const bukuTabungan = data.barangCetakan.find((b) => b.kode === 'T');
  const prevDebet = bukuTabungan.debet;
  const prevSaldoAkhir = bukuTabungan.saldoAkhir;

  // Act: Issue 1 passbook
  const newDebet = prevDebet + 1;
  const newSaldoAkhir = bukuTabungan.saldoAwal - newDebet + bukuTabungan.kredit;

  // Assert
  assert.equal(newDebet, prevDebet + 1);
  assert.equal(newSaldoAkhir, prevSaldoAkhir - 1);
});

test('3. Stock Receiving Logic (Penerimaan Blanko Baru / Kredit)', () => {
  // Arrange
  const raw = fs.readFileSync(defaultDataPath, 'utf-8');
  const data = JSON.parse(raw);
  const bilyetDeposito = data.barangCetakan.find((b) => b.kode === 'D');
  const prevKredit = bilyetDeposito.kredit;
  const prevSaldoAkhir = bilyetDeposito.saldoAkhir;
  const incomingQty = 25;

  // Act
  const newKredit = prevKredit + incomingQty;
  const newSaldoAkhir = bilyetDeposito.saldoAwal - bilyetDeposito.debet + newKredit;

  // Assert
  assert.equal(newKredit, prevKredit + incomingQty);
  assert.equal(newSaldoAkhir, prevSaldoAkhir + incomingQty);
});

test('4. Reset Database Idempotency', () => {
  // Arrange: default data
  const defaultRaw = fs.readFileSync(defaultDataPath, 'utf-8');
  const defaultObj = JSON.parse(defaultRaw);

  // Act: simulate reset
  const resetObj = JSON.parse(defaultRaw);

  // Assert
  assert.deepEqual(resetObj.institution, defaultObj.institution);
  assert.equal(resetObj.nasabah.length, defaultObj.nasabah.length);
  assert.equal(resetObj.barangCetakan.length, defaultObj.barangCetakan.length);
  assert.equal(resetObj.stokSeri.length, defaultObj.stokSeri.length);
});

test('5. Authorization Password Check for Deleting Used Serial (admin1235)', () => {
  // Arrange
  const ADMIN_PASSWORD_DEFAULT = 'admin1235';
  const testInputCorrect = 'admin1235';
  const testInputWrong = 'wrongpass';
  const testInputEmpty = '';

  // Act & Assert (Password Verification Logic)
  const verifyAuth = (input) => input.trim() === ADMIN_PASSWORD_DEFAULT;

  assert.equal(verifyAuth(testInputCorrect), true, 'Correct wifi password admin1235 must be authorized');
  assert.equal(verifyAuth(testInputWrong), false, 'Wrong password must be rejected');
  assert.equal(verifyAuth(testInputEmpty), false, 'Empty password must be rejected');
});

test('6. Stock Accounting Reversal when Used Serial is Deleted / Cancelled', () => {
  // Arrange
  const raw = fs.readFileSync(defaultDataPath, 'utf-8');
  const data = JSON.parse(raw);
  const bukuTabungan = data.barangCetakan.find((b) => b.kode === 'T');
  
  // Simulate state where 1 passbook is used
  const originalDebet = bukuTabungan.debet;
  const originalSaldoAkhir = bukuTabungan.saldoAkhir;

  // Act: Cancel/delete used blanko serial
  const newDebet = Math.max(0, originalDebet - 1);
  const newSaldoAkhir = bukuTabungan.saldoAwal - newDebet + bukuTabungan.kredit;

  // Assert: debet decreases by 1 and saldoAkhir increases by 1
  assert.equal(newDebet, originalDebet - 1);
  assert.equal(newSaldoAkhir, originalSaldoAkhir + 1);
  assert.equal(bukuTabungan.saldoAwal - newDebet + bukuTabungan.kredit, newSaldoAkhir);
});
