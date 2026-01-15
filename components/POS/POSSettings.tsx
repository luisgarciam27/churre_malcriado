
import React, { useState } from 'react';
import { AppConfig } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface POSSettingsProps {
  config: AppConfig;
}

export const POSSettings: React.FC<POSSettingsProps> = ({ config }) => {
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
      alert("¡Configuración guardada! Recarga la página para ver los cambios.");
    } catch (e: any) {
      alert("Error al guardar: " + e.message);
    } finally {
      setLoading(false);
    }
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

  const removeSlide = (index: number) => {
    const updated = formData.images.slideBackgrounds.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: { ...formData.images, slideBackgrounds: updated }
    });
  };

  return (
    <div className="p-10 max-w-5xl mx-auto h-full overflow-y-auto custom-scrollbar animate-fade-in bg-white">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-slate-800 brand-font">Ajustes del Sistema</h2>
        <p className="text-slate-400 text-sm font-medium">Personaliza la identidad visual y redes sociales de tu local</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Identidad Visual */}
        <section className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xs font-black uppercase text-[#e91e63] tracking-[0.3em] flex items-center gap-3">
            <i className="fa-solid fa-palette"></i> Identidad Visual
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Logo Principal (PNG)</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none focus:border-pink-200"
                value={formData.images.logo}
                onChange={e => setFormData({...formData, images: {...formData.images, logo: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Logo Menú (Sticky)</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none focus:border-pink-200"
                value={formData.images.menuLogo}
                onChange={e => setFormData({...formData, images: {...formData.images, menuLogo: e.target.value}})}
              />
            </div>
          </div>
        </section>

        {/* Diapositivas de Inicio */}
        <section className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xs font-black uppercase text-[#e91e63] tracking-[0.3em] flex items-center gap-3">
            <i className="fa-solid fa-images"></i> Diapositivas Inicio
          </h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="URL de imagen nueva..."
                className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none focus:border-pink-200"
                value={newSlideUrl}
                onChange={e => setNewSlideUrl(e.target.value)}
              />
              <button onClick={addSlide} className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {formData.images.slideBackgrounds.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm group">
                  <img src={url} className="w-full h-full object-cover" alt="Slide" />
                  <button 
                    onClick={() => removeSlide(idx)}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Redes Sociales */}
        <section className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xs font-black uppercase text-[#e91e63] tracking-[0.3em] flex items-center gap-3">
            <i className="fa-solid fa-share-nodes"></i> Redes y Contacto
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">WhatsApp Ventas (9 dígitos)</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none focus:border-pink-200"
                value={formData.whatsappNumber}
                onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="Instagram URL" className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-bold outline-none" value={formData.socialMedia.instagram} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, instagram: e.target.value}})} />
              <input placeholder="TikTok URL" className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-bold outline-none" value={formData.socialMedia.tiktok} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, tiktok: e.target.value}})} />
              <input placeholder="Facebook URL" className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-bold outline-none" value={formData.socialMedia.facebook} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, facebook: e.target.value}})} />
            </div>
          </div>
        </section>

        {/* Pagos */}
        <section className="space-y-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xs font-black uppercase text-[#e91e63] tracking-[0.3em] flex items-center gap-3">
            <i className="fa-solid fa-qrcode"></i> Info de Pago
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Titular de Cuenta (Yape/Plin)</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none"
                value={formData.paymentName}
                onChange={e => setFormData({...formData, paymentName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-4">URL del QR de Pago</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-bold outline-none"
                value={formData.paymentQr}
                onChange={e => setFormData({...formData, paymentQr: e.target.value})}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 sticky bottom-0 bg-white py-6 border-t border-slate-50">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full py-6 bg-[#e91e63] text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-pink-100 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i><span>GUARDAR CONFIGURACIÓN</span></>}
        </button>
      </div>
    </div>
  );
};
