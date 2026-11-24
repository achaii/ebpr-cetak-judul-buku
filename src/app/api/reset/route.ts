import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const APP_DATA_PATH = path.join(DATA_DIR, 'app_data.json');
const DEFAULT_DATA_PATH = path.join(DATA_DIR, 'default_dataset.json');

export async function POST() {
  try {
    if (!fs.existsSync(DEFAULT_DATA_PATH)) {
      return NextResponse.json({ error: 'Default dataset not found' }, { status: 404 });
    }
    const defaultData = fs.readFileSync(DEFAULT_DATA_PATH, 'utf-8');
    fs.writeFileSync(APP_DATA_PATH, defaultData, 'utf-8');
    const parsed = JSON.parse(defaultData);
    return NextResponse.json({
      success: true,
      message: 'Database has been reset to default state',
      data: parsed,
    });
  } catch (error) {
    console.error('Error resetting data:', error);
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
  }
}
