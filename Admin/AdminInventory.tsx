
import React, { useState } from 'react';
import { MenuItem, Category, ItemVariant } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface AdminInventoryProps {
  menu: MenuItem[];
  categories: Category[];
}

export const AdminInventory: React.FC<AdminInventoryProps> = ({ menu, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.price) return alert("Faltan datos básicos sobrino.");
    setLoading(true);

    try {
      const payload = {
        name: editingItem.name,
        description: editingItem.description || "",
        price: parseFloat(editingItem.price.toString()),
        category: editingItem.category || categories[0]?.name,
        image: editingItem.image || "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=60&w=800",
        is_popular: editingItem.isPopular || false,
        is_combo: editingItem.isCombo || false,
        variants: editingItem.variants || [],
      };

      let error;
      if (editingItem.id) {
        const { error: err } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id);
        error = err;
      } else {
        // Para nuevos items, generamos un ID simple si no existe
        const newId = editingItem.id || `it-${Date.now()}`;
        const { error: err } = await supabase.from('menu_items').insert({ ...payload, id: newId });
        error = err;
      }

      if (!error) {
        alert("¡Carta actualizada! Recarga para ver cambios.");
        window.location.reload();
      } else throw error;
    } catch (e: any) { alert("Error al guardar: " + e.message); }
    finally { setLoading(false); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("¿Borrar este plato definitivamente?")) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) window.location.reload();
  };

  const addVariant = () => {
    const variants = [...(editingItem?.variants || [])];
    variants.push({ id: `v-${Date.now()}`, name: '', price: 0 });
    setEditingItem({ ...editingItem!, variants });
  };

  const removeVariant = (idx: number) => {
    const variants = [...(editingItem?.variants || [])];
    variants.splice(idx, 1);
    setEditingItem({ ...editingItem!, variants });
  };

  const updateVariant = (idx: number, field: keyof ItemVariant, value: any) => {
    const variants = [...(editingItem?.variants || [])];
    variants[idx] = { ...variants[idx], [field]: field === 'price' ? parseFloat(value) : value };
    setEditingItem({ ...editingItem!, variants });
  };

  return (
    <div className="p-10 h-full overflow-y-auto bg-white custom-scrollbar">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-800 brand-font">Carta de Productos</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Gestiona los manjares piuranos</p>
        </div>
        <button 
          onClick={() => { setEditingItem({ variants: [] }); setIsModalOpen(true); }}
          className="bg-[#e91e63] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-plus"></i> Nuevo Plato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map(item => (
          <div key={item.id} className="bg-slate-50 border border-slate-100 p-5 rounded-[2.5rem] flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all">
            <img src={item.image} className="w-20 h-20 rounded-[1.5rem] object-cover bg-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black uppercase text-[#e91e63] mb-1">{item.category}</p>
              <p className="font-bold text-slate-800 truncate text-sm">{item.name}</p>
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-900 text-sm">S/ {item.price.toFixed(2)}</p>
                {item.variants && item.variants.length > 0 && (
                  <span className="text-[8px] font-black bg-slate-200 px-2 py-0.5 rounded text-slate-500">+{item.variants.length} VARIANTES</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="w-9 h-9 rounded-xl bg-white text-slate-400 hover:text-blue-500 border border-slate-200 flex items-center justify-center"><i className="fa-solid fa-pen text-xs"></i></button>
               <button onClick={() => deleteItem(item.id)} className="w-9 h-9 rounded-xl bg-white text-slate-400 hover:text-red-500 border border-slate-200 flex items-center justify-center"><i className="fa-solid fa-trash text-xs"></i></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
           <form onSubmit={handleSave} className="bg-white w-full max-w-xl rounded-[3.5rem] p-10 shadow-2xl animate-zoom-in max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-black text-slate-800 brand-font">{editingItem?.id ? 'Editar Plato' : 'Nuevo Plato'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Nombre del Plato</label>
                    <input type="text" required className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-pink-100" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem!, name: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Precio Base S/</label>
                       <input type="number" step="0.1" required className="w-full bg-slate-50 p-4 rounded-2xl font-black border-none outline-none focus:ring-2 focus:ring-pink-100" value={editingItem?.price || ''} onChange={e => setEditingItem({...editingItem!, price: parseFloat(e.target.value)})} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Categoría</label>
                       <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-pink-100" value={editingItem?.category || categories[0]?.name} onChange={e => setEditingItem({...editingItem!, category: e.target.value})}>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Descripción / Detalles</label>
                    <textarea className="w-full bg-slate-50 p-4 rounded-2xl font-medium border-none outline-none focus:ring-2 focus:ring-pink-100 h-24 resize-none" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem!, description: e.target.value})} />
                 </div>

                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">URL Imagen (PostImages)</label>
                    <input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-medium border-none outline-none text-xs focus:ring-2 focus:ring-pink-100" value={editingItem?.image || ''} onChange={e => setEditingItem({...editingItem!, image: e.target.value})} />
                 </div>

                 {/* GESTIÓN DE VARIANTES (JSON) */}
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                       <h4 className="text-[10px] font-black uppercase text-[#e91e63] tracking-widest">Variantes de Precio (Combos/Tamaños)</h4>
                       <button type="button" onClick={addVariant} className="text-[10px] font-black bg-white text-slate-900 px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">Añadir</button>
                    </div>
                    
                    <div className="space-y-3">
                       {editingItem?.variants?.map((v, idx) => (
                          <div key={v.id} className="flex gap-2 items-center">
                             <input 
                                placeholder="Nombre (ej: Bolsa Grande)" 
                                className="flex-1 bg-white p-3 rounded-xl text-[10px] font-bold outline-none border border-slate-100"
                                value={v.name}
                                onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                             />
                             <input 
                                type="number" 
                                placeholder="Precio" 
                                className="w-20 bg-white p-3 rounded-xl text-[10px] font-black outline-none border border-slate-100 text-[#e91e63]"
                                value={v.price}
                                onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                             />
                             <button type="button" onClick={() => removeVariant(idx)} className="text-red-300 hover:text-red-500 px-2"><i className="fa-solid fa-trash-can text-xs"></i></button>
                          </div>
                       ))}
                       {(!editingItem?.variants || editingItem.variants.length === 0) && (
                          <p className="text-[9px] text-slate-300 italic text-center py-2">Sin variantes configuradas</p>
                       )}
                    </div>
                 </div>

                 <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" className="w-4 h-4 text-[#e91e63] focus:ring-[#e91e63]" checked={editingItem?.isPopular || false} onChange={e => setEditingItem({...editingItem!, isPopular: e.target.checked})} />
                       <span className="text-[10px] font-black uppercase text-slate-500">¿Es Malcriado?</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                       <input type="checkbox" className="w-4 h-4 text-[#e91e63] focus:ring-[#e91e63]" checked={editingItem?.isCombo || false} onChange={e => setEditingItem({...editingItem!, isCombo: e.target.checked})} />
                       <span className="text-[10px] font-black uppercase text-slate-500">¿Es Combo?</span>
                    </label>
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-[10px] font-black uppercase text-slate-400">Cancelar</button>
                    <button type="submit" disabled={loading} className="flex-1 py-5 bg-[#e91e63] text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-pink-100 active:scale-95 transition-all">
                       {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Guardar Producto'}
                    </button>
                 </div>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
