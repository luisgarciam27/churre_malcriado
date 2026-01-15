
import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { supabase } from '../services/supabaseClient';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string, variantId?: string) => void;
  onUpdateQuantity: (id: string, delta: number, variantId?: string) => void;
  onClearCart: () => void;
  isOpen: boolean;
  onToggle: () => void;
  initialModality: 'delivery' | 'pickup';
  whatsappNumber: string;
  paymentQr?: string;
  paymentName?: string;
}

type OrderType = 'delivery' | 'pickup';

export const Cart: React.FC<CartProps> = ({ 
  items, onRemove, onUpdateQuantity, onClearCart, isOpen, onToggle, 
  initialModality, whatsappNumber, paymentQr, paymentName 
}) => {
  const [orderType, setOrderType] = useState<OrderType>(initialModality);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const STORE_ADDRESS = "Mercado 2 de Surquillo, Puesto 651";

  useEffect(() => {
    setOrderType(initialModality);
    if (isOpen && !isSuccess) setHasCopied(false);
  }, [initialModality, isOpen, isSuccess]);

  const total = items.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price : item.price;
    return sum + price * item.quantity;
  }, 0);
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCopyNumber = () => {
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    navigator.clipboard.writeText(cleanNumber);
    setHasCopied(true);
  };

  const handleResetAfterOrder = () => {
    setIsSuccess(false);
    onClearCart();
    onToggle();
    setAddress('');
    setCustomerName('');
    setCustomerPhone('');
    setHasCopied(false);
  };

  const handleWhatsAppOrder = async () => {
    if (!customerName || !customerPhone || (orderType === 'delivery' && !address)) {
      alert("¡Habla sobrino! Completa todos los datos para llevarte tu pedido.");
      return;
    }

    if (!hasCopied) return;

    setIsSaving(true);
    try {
      await supabase.from('orders').insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items.map(i => ({ 
          name: i.name, 
          quantity: i.quantity, 
          price: i.selectedVariant ? i.selectedVariant.price : i.price,
          variant: i.selectedVariant?.name || null
        })),
        total: total,
        modality: orderType,
        address: orderType === 'delivery' ? address : 'Tienda Principal',
        status: 'Pendiente',
        order_origin: 'Web'
      });
    } catch (e) { 
      console.error("Error saving order:", e); 
    }

    const message = encodeURIComponent(
      `*PEDIDO MALCRIADO - WEB*\n\n` +
      `🔥 *Cliente:* ${customerName}\n` +
      `📞 *Teléfono:* ${customerPhone}\n` +
      `📍 *Modo:* ${orderType === 'delivery' ? '🚀 Delivery' : '🏪 Recojo en Tienda'}\n` +
      (orderType === 'delivery' ? `🏠 *Dirección:* ${address}\n` : `🏢 *Punto:* ${STORE_ADDRESS}\n`) +
      `\n*DETALLE DEL BANQUETE:*\n` +
      items.map(i => `• ${i.quantity}x ${i.name} ${i.selectedVariant ? `(${i.selectedVariant.name})` : ''} - S/ ${((i.selectedVariant?.price || i.price) * i.quantity).toFixed(2)}`).join('\n') +
      `\n\n*TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n` +
      `\n--------------------------------\n` +
      `_¡Churre, ya copié el número de pago! Aquí te mando el pedido para yapearte y mandar la captura._ 🌶️`
    );

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    
    setIsSaving(false);
    setIsSuccess(true);
  };

  if (!isOpen) {
    if (totalItems === 0) return null;
    return (
      <button 
        onClick={onToggle} 
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-[#e91e63] text-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-[0_15px_30px_rgba(233,30,99,0.4)] z-50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-bounce-slow"
      >
        <i className="fa-solid fa-basket-shopping text-xl md:text-2xl"></i>
        <span className="absolute -top-1 -right-1 bg-[#fdd835] text-black text-[10px] md:text-[11px] font-black w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2 md:border-4 border-white shadow-md">{totalItems}</span>
      </button>
    );
  }

  const isFormComplete = customerName.trim().length > 2 && customerPhone.trim().length > 6 && (orderType === 'pickup' || address.trim().length > 4);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end">
      <div className="absolute inset-0 bg-[#3d1a1a]/40 backdrop-blur-sm" onClick={onToggle}></div>
      
      <div className="relative bg-[#f8eded] w-full max-w-lg h-[100dvh] shadow-2xl flex flex-col animate-slide-left overflow-hidden">
        
        {isSuccess ? (
          /* PANTALLA DE ÉXITO */
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in bg-white">
            <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-green-200 animate-zoom-in">
              <i className="fa-solid fa-check text-5xl"></i>
            </div>
            
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 mb-2">¡Pedido Realizado!</span>
            <h2 className="text-4xl font-bold brand-font text-[#3d1a1a] mb-6 tracking-tighter">¡Gracias por tu compra, churre!</h2>
            
            <div className="p-6 bg-[#f8eded] rounded-[2rem] border border-[#e91e63]/5 mb-10 max-w-xs">
              <p className="text-xs font-bold text-[#3d1a1a]/60 leading-relaxed italic">
                "No olvides enviar el mensaje que se abrió en tu WhatsApp y adjuntar la captura de tu yapeo para empezar a cocinar."
              </p>
            </div>

            <button 
              onClick={handleResetAfterOrder}
              className="w-full max-w-xs py-6 bg-[#e91e63] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-pink-200 hover:scale-105 active:scale-95 transition-all"
            >
              Hacer otro pedido
            </button>
          </div>
        ) : (
          /* FLUJO NORMAL DEL CARRITO */
          <>
            <div className="shrink-0 p-6 md:p-8 border-b border-[#e91e63]/10 flex justify-between items-center bg-white z-10">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#e91e63]/40 block mb-0.5">Finalizar Pedido</span>
                <h2 className="text-2xl font-bold brand-font text-[#3d1a1a]">Su Carrito</h2>
              </div>
              <button 
                onClick={onToggle} 
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-[#e91e63] flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center opacity-20">
                    <i className="fa-solid fa-shopping-basket text-6xl mb-4"></i>
                    <p className="font-black text-[10px] uppercase tracking-widest">Carrito vacío</p>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-[2rem] border border-[#e91e63]/5 shadow-sm flex items-center gap-4 animate-fade-in-up">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-[#3d1a1a] uppercase truncate leading-tight">{item.name}</p>
                        {item.selectedVariant && <p className="text-[9px] font-black text-[#e91e63] uppercase">{item.selectedVariant.name}</p>}
                        <div className="flex items-center gap-4 mt-1.5">
                           <div className="flex items-center gap-3 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                             <button onClick={() => onUpdateQuantity(item.id, -1, item.selectedVariant?.id)} className="text-slate-300 hover:text-[#e91e63]"><i className="fa-solid fa-minus text-[8px]"></i></button>
                             <span className="text-[11px] font-black w-3 text-center">{item.quantity}</span>
                             <button onClick={() => onUpdateQuantity(item.id, 1, item.selectedVariant?.id)} className="text-slate-300 hover:text-[#e91e63]"><i className="fa-solid fa-plus text-[8px]"></i></button>
                           </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-[#3d1a1a]">S/ {((item.selectedVariant?.price || item.price) * item.quantity).toFixed(2)}</p>
                        <button onClick={() => onRemove(item.id, item.selectedVariant?.id)} className="text-[9px] font-black text-red-300 uppercase mt-1">Quitar</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 pt-2 bg-white/50 space-y-6">
                <div className="flex bg-[#f8eded] p-1.5 rounded-2xl gap-1 border border-[#e91e63]/5">
                  <button onClick={() => setOrderType('pickup')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${orderType === 'pickup' ? 'bg-[#e91e63] text-white shadow-md' : 'text-[#e91e63]/40'}`}>RECOJO</button>
                  <button onClick={() => setOrderType('delivery')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${orderType === 'delivery' ? 'bg-[#e91e63] text-white shadow-md' : 'text-[#e91e63]/40'}`}>DELIVERY</button>
                </div>

                <div className="space-y-3">
                  <input type="text" placeholder="TU NOMBRE COMPLETO" className="w-full bg-white border border-[#e91e63]/5 py-4 px-6 rounded-2xl text-[10px] font-black outline-none focus:ring-2 focus:ring-[#e91e63]/20 uppercase tracking-widest shadow-sm" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  <input type="tel" placeholder="NÚMERO DE TELÉFONO" className="w-full bg-white border border-[#e91e63]/5 py-4 px-6 rounded-2xl text-[10px] font-black outline-none focus:ring-2 focus:ring-[#e91e63]/20 uppercase tracking-widest shadow-sm" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  {orderType === 'delivery' && (
                    <input type="text" placeholder="DIRECCIÓN DE ENTREGA" className="w-full bg-white border border-[#e91e63]/5 py-4 px-6 rounded-2xl text-[10px] font-black outline-none focus:ring-2 focus:ring-[#e91e63]/20 uppercase tracking-widest shadow-sm animate-fade-in" value={address} onChange={e => setAddress(e.target.value)} />
                  )}
                </div>

                {items.length > 0 && isFormComplete && (
                  <div className="animate-fade-in">
                    <div className={`p-5 rounded-[2.5rem] border-2 transition-all duration-500 ${hasCopied ? 'bg-green-50 border-green-200' : 'bg-[#fdd835]/10 border-dashed border-[#fdd835]'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${hasCopied ? 'text-green-600' : 'text-[#3d1a1a]/60'}`}>{hasCopied ? '✓ NÚMERO COPIADO' : '🔥 PASO 1: COPIA EL NÚMERO'}</span>
                        {hasCopied && <i className="fa-solid fa-circle-check text-green-500 text-lg"></i>}
                      </div>
                      <p className="text-[10px] font-bold text-[#3d1a1a]/70 leading-snug mb-4">Toca el número abajo para copiarlo, realiza el Yape/Plin y luego dale clic al botón rosa:</p>
                      <button onClick={handleCopyNumber} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95 ${hasCopied ? 'bg-green-500 text-white' : 'bg-white text-[#e91e63] border border-[#e91e63]/10 shadow-sm animate-pulse'}`}>
                        <div className="flex items-center gap-3">
                          <i className={`fa-solid ${hasCopied ? 'fa-check-double' : 'fa-copy'} text-lg`}></i>
                          <span className="text-xl font-black tracking-widest">{whatsappNumber.replace(/\D/g, '')}</span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest">{hasCopied ? '¡LISTO!' : 'TOCA AQUÍ'}</span>
                      </button>
                    </div>
                  </div>
                )}
                <div className="h-4"></div>
              </div>
            </div>

            <div className="shrink-0 p-6 md:p-8 bg-white border-t border-[#e91e63]/10 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-20">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="text-[10px] font-black text-[#e91e63]/40 uppercase tracking-widest block mb-0.5">Total a Pagar</span>
                  <span className="text-3xl font-black text-[#e91e63] brand-font tracking-tighter">S/ {total.toFixed(2)}</span>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-[#3d1a1a]/30 uppercase tracking-[0.2em]">Puesto 651</p>
                </div>
              </div>

              <button 
                disabled={!isFormComplete || items.length === 0 || isSaving || !hasCopied} 
                onClick={handleWhatsAppOrder}
                className={`w-full py-6 md:py-7 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 ${!hasCopied ? 'bg-slate-100 text-slate-300' : 'bg-[#e91e63] text-white shadow-pink-200 active:scale-[0.97]'} disabled:opacity-80`}
              >
                {isSaving ? <i className="fa-solid fa-spinner fa-spin text-lg"></i> : <><i className="fa-brands fa-whatsapp text-lg ${hasCopied ? 'animate-bounce' : ''}"></i><span>{hasCopied ? 'PASO 2: ¡PEDIR AHORA!' : 'COPIA EL NÚMERO ARRIBA'}</span></>}
              </button>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(233, 30, 99, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};
