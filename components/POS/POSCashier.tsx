
import React, { useState, useMemo } from 'react';
import { MenuItem, Category, CashSession, CartItem, ItemVariant } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface POSCashierProps {
  menu: MenuItem[];
  categories: Category[];
  session: CashSession;
  onOrderComplete: () => void;
}

export const POSCashier: React.FC<POSCashierProps> = ({ menu, categories, session, onOrderComplete }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [paymentMethod, setPaymentMethod] = useState<'Efectivo' | 'Yape' | 'Plin' | 'Tarjeta'>('Efectivo');
  const [receivedAmount, setReceivedAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [itemForVariant, setItemForVariant] = useState<MenuItem | null>(null);
  
  // Imagen por defecto si falla el link de PostImages
  const DEFAULT_IMAGE = "https://i.ibb.co/3mN9fL8/logo-churre.png";

  const addToCart = (item: MenuItem, variant?: ItemVariant) => {
    if (item.variants && item.variants.length > 0 && !variant) {
      setItemForVariant(item);
      return;
    }

    setCart(prev => {
      const variantId = variant?.id;
      const existing = prev.find(i => i.id === item.id && i.selectedVariant?.id === variantId);
      if (existing) {
        return prev.map(i => (i.id === item.id && i.selectedVariant?.id === variantId) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, selectedVariant: variant }];
    });
    setItemForVariant(null);
  };

  const updateQty = (id: string, delta: number, variantId?: string) => {
    setCart(prev => prev.map(i => 
      (i.id === id && i.selectedVariant?.id === variantId) 
        ? { ...i, quantity: i.quantity + delta } 
        : i
    ).filter(i => i.quantity > 0));
  };

  const total = useMemo(() => cart.reduce((acc, curr) => {
    const price = curr.selectedVariant ? curr.selectedVariant.price : curr.price;
    return acc + (price * curr.quantity);
  }, 0), [cart]);

  const effectiveReceived = receivedAmount === '' ? total : parseFloat(receivedAmount);
  const changeAmount = paymentMethod === 'Efectivo' ? Math.max(0, effectiveReceived - total) : 0;

  const handleProcessOrder = async () => {
    if (cart.length === 0 || isProcessing) return;
    setIsProcessing(true);
    
    const orderData = {
      customer_name: "Venta Local",
      customer_phone: "POS",
      items: cart.map(i => ({ 
        name: i.name, 
        quantity: i.quantity, 
        price: i.selectedVariant ? i.selectedVariant.price : i.price,
        variant: i.selectedVariant?.name || null
      })),
      total: total,
      modality: 'pickup',
      address: 'Mostrador',
      status: 'Completado', 
      payment_method: paymentMethod,
      order_origin: 'Local',
      session_id: session.id
    };

    try {
      const { data, error } = await supabase.from('orders').insert(orderData).select().single();
      if (error) throw error;

      await supabase.rpc('increment_session_sales', { session_id: session.id, amount: total });
      
      const finalReceipt = {
        ...data,
        received: effectiveReceived,
        change: changeAmount,
        cashier: session.user_name
      };
      
      setReceiptData(finalReceipt);
      setShowReceiptModal(true);
      
      setCart([]);
      setReceivedAmount('');
      onOrderComplete();
    } catch (e: any) {
      alert("⚠️ Error: " + (e.message || "Problema al cobrar"));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMenu = menu.filter(m => 
    (activeCategory === 'Todos' || m.category === activeCategory) &&
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Estado del Recibo
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  return (
    <div className="h-full flex overflow-hidden bg-slate-100 relative select-none">
      
      {/* 1. SECCIÓN PRODUCTOS */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        <div className="h-16 bg-white border-b border-slate-100 flex items-center px-4 gap-4">
          <div className="relative w-64">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
            <input 
              type="text" 
              placeholder="Buscar plato..." 
              className="w-full bg-slate-50 border-none px-8 py-2 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-pink-100 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1 py-1">
            <button 
              onClick={() => setActiveCategory('Todos')} 
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === 'Todos' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
            >
              Todos
            </button>
            {categories.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveCategory(c.name)} 
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === c.name ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-300'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 content-start">
            {filteredMenu.map(item => (
              <button 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="group relative bg-white p-3 rounded-[2rem] flex flex-col items-center gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 border border-slate-100"
              >
                <div className="w-full aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100">
                   <img 
                    src={item.image || DEFAULT_IMAGE} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                   />
                </div>
                <div className="text-center px-1">
                  <p className="text-[10px] font-black text-slate-800 uppercase leading-tight mb-1 line-clamp-2 h-6 flex items-center justify-center">{item.name}</p>
                  <p className="text-sm font-black text-[#e91e63] tracking-tighter brand-font">S/ {item.price.toFixed(2)}</p>
                </div>
                {item.variants && item.variants.length > 0 && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-pink-500 rounded-full border-2 border-white shadow-md"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PANEL DE COBRO (IDEM AL ANTERIOR PERO MANTENIENDO COHERENCIA) */}
      <div className="w-[380px] flex flex-col bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-10">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Caja Local</h3>
          <button onClick={() => {if(confirm('¿Vaciar carrito?')) setCart([])}} className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-all">Limpiar</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
               <i className="fa-solid fa-shopping-basket text-7xl mb-4"></i>
               <p className="font-black text-[9px] uppercase tracking-widest text-center">Sin productos seleccionados</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.id}-${item.selectedVariant?.id || idx}`} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between group animate-fade-in-up">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-black text-slate-800 text-[10px] uppercase truncate leading-none mb-1">{item.name}</p>
                  {item.selectedVariant && <p className="text-[8px] font-black text-[#e91e63] uppercase mb-1">{item.selectedVariant.name}</p>}
                  <p className="text-[9px] font-bold text-slate-400">S/ {(item.selectedVariant?.price || item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1, item.selectedVariant?.id)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><i className="fa-solid fa-minus text-[9px]"></i></button>
                  <span className="w-5 text-center font-black text-slate-800 text-xs">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, 1, item.selectedVariant?.id)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><i className="fa-solid fa-plus text-[9px]"></i></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel de Cobro */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-5 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-4 gap-1.5">
            {['Efectivo', 'Yape', 'Plin', 'Tarjeta'].map(m => (
              <button 
                key={m} 
                onClick={() => setPaymentMethod(m as any)} 
                className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${paymentMethod === m ? 'bg-pink-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-pink-200'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[8px] font-black uppercase text-slate-300">Paga con</span>
                <button onClick={() => setReceivedAmount('')} className="text-[8px] font-black text-pink-500 bg-pink-50 px-2 py-1 rounded-lg uppercase">S/ Exacto</button>
             </div>
             <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder={total.toFixed(2)}
                  className="w-full bg-slate-50 border-none px-4 py-3 rounded-xl font-black text-slate-800 text-2xl outline-none"
                  value={receivedAmount}
                  onChange={e => setReceivedAmount(e.target.value)}
                />
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-300 uppercase">Vuelto</p>
                  <p className="text-lg font-black text-green-600 leading-none">S/ {changeAmount.toFixed(2)}</p>
                </div>
             </div>
          </div>

          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total</span>
             <span className="text-4xl font-black text-slate-900 tracking-tighter brand-font">S/ {total.toFixed(2)}</span>
          </div>

          <button 
            disabled={cart.length === 0 || isProcessing || (paymentMethod === 'Efectivo' && receivedAmount !== '' && parseFloat(receivedAmount) < total)}
            onClick={handleProcessOrder}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${cart.length === 0 ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-black shadow-slate-200'}`}
          >
            {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : <><i className="fa-solid fa-bolt-lightning text-yellow-300"></i><span>COBRAR</span></>}
          </button>
        </div>
      </div>

      {/* Modal de variantes al seleccionar en POS */}
      {itemForVariant && (
        <div className="fixed inset-0 z-[220] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setItemForVariant(null)}>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-zoom-in" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-800 uppercase text-center mb-6">Selecciona Opción</h3>
            <div className="space-y-3">
              {itemForVariant.variants?.map(v => (
                <button 
                  key={v.id} 
                  onClick={() => addToCart(itemForVariant, v)}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 flex justify-between items-center hover:border-[#e91e63] hover:bg-pink-50 transition-all text-left"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">{v.name}</span>
                  <span className="text-sm font-black text-[#e91e63]">S/ {v.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL RECIBO */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-[360px] rounded-[3rem] p-8 shadow-2xl animate-zoom-in my-auto">
            <div id="thermal-receipt" className="bg-white font-mono text-[9px] text-black p-6 border-2 border-slate-100 rounded-2xl leading-snug shadow-inner mb-6">
               <div className="text-center mb-6 space-y-1">
                  <h2 className="text-[14px] font-black uppercase tracking-tight">CHURRE MALCRIADO</h2>
                  <p className="text-[8px] font-bold opacity-60">Sabor 100% Piurano</p>
                  <div className="border-y border-dashed border-black/30 py-2 my-3">
                     <p className="font-black text-xs">TICKET #000{receiptData.id}</p>
                     <p className="text-[7px] uppercase">{new Date(receiptData.created_at).toLocaleString('es-PE')}</p>
                  </div>
               </div>

               <div className="mb-6">
                  <div className="flex justify-between border-b border-dashed border-black/20 pb-1 mb-2 font-bold uppercase text-[8px]">
                     <span className="w-8">Cant</span>
                     <span className="flex-1 text-center">Producto</span>
                     <span className="w-16 text-right">Total</span>
                  </div>
                  <div className="space-y-1.5">
                    {receiptData.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start">
                        <span className="w-8 font-bold">{it.quantity}</span>
                        <div className="flex-1 px-1 overflow-hidden">
                           <p className="truncate uppercase font-medium">{it.name}</p>
                           {it.variant && <p className="text-[7px] italic opacity-60">{it.variant}</p>}
                        </div>
                        <span className="w-16 text-right font-black">S/ {(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="border-t border-dashed border-black/30 pt-3 space-y-1.5">
                  <div className="flex justify-between font-black text-[11px]">
                     <span>TOTAL PAGADO:</span>
                     <span>S/ {receiptData.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[8px] font-bold opacity-60">
                     <span>PAGO:</span>
                     <span className="uppercase">{receiptData.payment_method}</span>
                  </div>
                  {receiptData.payment_method === 'Efectivo' && (
                    <div className="flex justify-between font-black text-[10px] border-t border-black/10 pt-1.5 mt-1.5">
                       <span>VUELTO:</span>
                       <span>S/ {parseFloat(receiptData.change || '0').toFixed(2)}</span>
                    </div>
                  )}
               </div>

               <div className="mt-8 text-center text-[7px] uppercase font-bold space-y-1 opacity-40">
                  <p>¡Gracias por tu compra, churre!</p>
                  <p>Cajero: {receiptData.cashier}</p>
               </div>
            </div>

            <div className="space-y-2 no-print">
               <div className="grid grid-cols-2 gap-3">
                 <button onClick={() => window.print()} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                   <i className="fa-solid fa-print"></i>Imprimir
                 </button>
                 <button 
                  onClick={() => {
                    const msg = encodeURIComponent(`🔥 *TICKET MALCRIADO*\nOrden #000${receiptData.id}\nTotal: S/ ${receiptData.total.toFixed(2)}\n¡Vuelve pronto sobrino! 🌶️`);
                    window.open(`https://wa.me/?text=${msg}`, '_blank');
                  }} 
                  className="py-4 bg-green-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-100"
                 >
                   <i className="fa-brands fa-whatsapp"></i>WhatsApp
                 </button>
               </div>
               <button 
                onClick={() => { setShowReceiptModal(false); setReceiptData(null); }}
                className="w-full py-5 bg-pink-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-pink-200 transition-all active:scale-[0.98]"
               >
                 NUEVA VENTA
               </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #thermal-receipt, #thermal-receipt * { visibility: visible; }
          #thermal-receipt {
            position: fixed; left: 0; top: 0; width: 100%;
            border: none !important; box-shadow: none !important; margin: 0; padding: 0;
          }
          .no-print { display: none !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};
