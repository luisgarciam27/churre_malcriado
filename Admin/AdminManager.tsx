
import React, { useState } from 'react';
import { MenuItem, Category, AppConfig } from '../../types';
import { AdminInventory } from './AdminInventory';
import { AdminSettings } from './AdminSettings';

interface AdminManagerProps {
  menu: MenuItem[];
  categories: Category[];
  config: AppConfig;
}

export const AdminManager: React.FC<AdminManagerProps> = ({ menu, categories, config }) => {
  const [view, setView] = useState<'inventory' | 'settings'>('inventory');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <img src={config.images.logo} className="h-10" alt="Logo" />
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <h2 className="brand-font font-black text-[#e91e63] text-xl uppercase tracking-tighter">Panel de Gestión</h2>
        </div>

        <nav className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setView('inventory')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'inventory' ? 'bg-white text-[#e91e63] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Gestión de Carta
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'settings' ? 'bg-white text-[#e91e63] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Ajustes de Web
          </button>
        </nav>

        <button 
          onClick={() => window.location.href = '/'} 
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
        >
          <i className="fa-solid fa-arrow-left"></i> Salir al Menú
        </button>
      </header>

      <main className="flex-1 overflow-hidden bg-white">
        {view === 'inventory' ? (
          <AdminInventory menu={menu} categories={categories} />
        ) : (
          <AdminSettings config={config} />
        )}
      </main>
    </div>
  );
};
