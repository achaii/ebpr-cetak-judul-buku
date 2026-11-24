import defaultData from '../../data/default_dataset.json';
import { AppDatabase, Nasabah, StokSeri, TransaksiBarangCetakan, BarangCetakan } from '@/types/inventory';

const STORAGE_KEY = 'einventaris_db_v1';

export function getDefaultDatabase(): AppDatabase {
  return {
    ...defaultData,
    lastUpdated: new Date().toISOString(),
  } as AppDatabase;
}

export function loadDatabaseFromLocalStorage(): AppDatabase {
  if (typeof window === 'undefined') {
    return getDefaultDatabase();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultDatabase();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.nasabah || !parsed.barangCetakan || !parsed.stokSeri) {
      const fallback = getDefaultDatabase();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    return parsed as AppDatabase;
  } catch (err) {
    console.error('Failed to parse database from localStorage:', err);
    return getDefaultDatabase();
  }
}

export function saveDatabaseToLocalStorage(db: AppDatabase): void {
  if (typeof window === 'undefined') return;
  try {
    db.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

    // Also notify server to persist in data/app_data.json asynchronously
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(db),
    }).catch((err) => {
      console.warn('Sync to file system warning:', err);
    });
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function resetDatabaseToDefault(): AppDatabase {
  const initial = getDefaultDatabase();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    fetch('/api/reset', { method: 'POST' }).catch(() => {});
  }
  return initial;
}
