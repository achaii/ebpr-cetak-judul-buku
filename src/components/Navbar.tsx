import React from 'react';
import { BookOpen, FileText, Database, RotateCcw, Building2 } from 'lucide-react';
import { Institution } from '@/types/inventory';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  institution: Institution;
  onOpenResetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  institution,
  onOpenResetModal,
}) => {
  const tabs = [
    { id: 'cetak_buku', label: 'Cetak Judul Buku', icon: BookOpen },
    { id: 'laporan', label: 'Laporan Barang Cetakan', icon: FileText },
    { id: 'stok', label: 'Barang Cetakan', icon: Database },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Application Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800 text-lg tracking-tight">Cetak Judul Buku</span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                {institution.name}
              </p>
            </div>
          </div>

          {/* Reset Data Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenResetModal}
              title="Kembalikan semua data ke kondisi default awal"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Default</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-slate-100 pt-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
