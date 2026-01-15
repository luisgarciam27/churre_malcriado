
import React, { useState } from 'react';
import { AppConfig } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface AdminSettingsProps {
  config: AppConfig;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ config }) => {
  const [formData, setFormData] = useState<AppConfig>(config);
  const [loading, setLoading] = useState(false);
  const [newSlideUrl, setNewSlideUrl] = useState('');

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('app_config')
        .update({
          images: formData.images,
          whatsapp_number: formData.whatsappNumber,
          social_media: formData.socialMedia,
          payment_qr: formData.paymentQr,
          payment_name: formData.paymentName
        })
        .eq('id', 1);

      if (error) throw error;
      alert("¡Web actualizada! Recarga para ver cambios.");
    } catch (e: any) { alert("Error: " + e.message); }
    finally { setLoading(false); }
  };

  const addSlide = () => {
    if (!newSlideUrl) return;
    setFormData({
      ...formData,
      images: {
        ...formData.images,
        slideBackgrounds: [...formData.images.slideBackgrounds, newSlideUrl]
      }
    });
    setNewSlideUrl('');
  };

  return (
    <div className="p-10 max-w-5xl mx-auto h-full overflow-y-auto bg-white custom-scrollbar">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-slate-800 brand-font">Identidad de la Web</h2>
        <p className="text-slate-400 text-sm font-medium">Gestiona cómo se ve tu marca ante el mundo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-50 p-8 rounded-[3rem] space-y-6">
          <h4 className="text-[10px] font-black uppercase text-[#e91e63] tracking-widest">Slider Premium (Fondo de Inicio)</h4>
          <div className="flex gap-2">
             <input type="text" placeholder="URL de PostImages..." className="flex-1 bg-white p-4 rounded-xl text-xs font-bold outline-none" value={newSlideUrl} onChange={e => setNewSlideUrl(e.target.value)} />
             <button onClick={addSlide} className="bg-slate-900 text-white w-12 h-12 rounded-xl flex items-center justify-center"><i className="fa-solid fa-plus"></i></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {formData.images.slideBackgrounds.map((s, i) => (
              <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                 <img src={s} className="w-full h-full object-cover" />
                 <button onClick={() => {
                   const updated = formData.images.slideBackgrounds.filter((_, idx) => idx !== i);
                   setFormData({...formData, images: {...formData.images, slideBackgrounds: updated}});
                 }} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><i className="fa-solid fa-trash"></i></button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 p-8 rounded-[3rem] space-y-6">
          <h4 className="text-[10px] font-black uppercase text-[#e91e63] tracking-widest">Contacto y WhatsApp</h4>
          <div className="space-y-4">
             <input type="text" placeholder="Número WhatsApp (Ej: 51936...)" className="w-full bg-white p-4 rounded-xl text-xs font-bold outline-none" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} />
             <input type="text" placeholder="Instagram URL" className="w-full bg-white p-4 rounded-xl text-xs font-bold outline-none" value={formData.socialMedia.instagram} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, instagram: e.target.value}})} />
             <input type="text" placeholder="TikTok URL" className="w-full bg-white p-4 rounded-xl text-xs font-bold outline-none" value={formData.socialMedia.tiktok} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, tiktok: e.target.value}})} />
          </div>
        </section>
      </div>

      <button onClick={handleSave} disabled={loading} className="w-full mt-10 py-6 bg-[#e91e63] text-white rounded-full font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95">
        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'PUBLICAR CAMBIOS EN LA WEB'}
      </button>
    </div>
  );
};
