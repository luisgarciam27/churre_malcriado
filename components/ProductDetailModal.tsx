
import React, { useState, useEffect } from 'react';
import { MenuItem, ItemVariant } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, selectedVariant: ItemVariant | undefined, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item && item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1); // Reiniciar cantidad al cambiar de item
  }, [item]);

  if (!item) return null;

  const unitPrice = selectedVariant ? selectedVariant.price : item.price;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-[#3d1a1a]/60 backdrop-blur-md"></div>
      
      <div 
        className="relative bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] md:rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[210] w-10 h-10 bg-white text-[#e91e63] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Imagen del Producto - Reducida en móvil */}
        <div className="w-full md:w-1/2 h-[35vh] md:h-auto bg-pink-50 relative">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          {item.isPopular && (
            <div className="absolute bottom-4 left-4">
               <span className="bg-[#fdd835] text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg border-2 border-white">🔥 Recomendado</span>
            </div>
          )}
        </div>

        {/* Contenido del Producto - Más compacto */}
        <div className="w-full md:w-1/2 flex flex-col bg-white overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-10 flex-1">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#e91e63]/30 mb-2 block">Detalle Malcriado</span>
            <h2 className="brand-font text-3xl md:text-4xl font-bold text-[#3d1a1a] mb-3 leading-tight">
              {item.name}
            </h2>
            <div className="h-1 w-12 bg-[#fdd835] mb-6 rounded-full"></div>
            
            {/* Sección de Descripción Compacta */}
            <div className="mb-6">
              <h4 className="text-[9px] font-black uppercase text-[#e91e63] tracking-widest mb-2">Sobre esta delicia:</h4>
              <p className="text-[#3d1a1a]/70 text-sm md:text-base leading-relaxed font-medium">
                {item.description}
              </p>
            </div>

            {/* Variantes (si existen) - Diseño más apretado */}
            {item.variants && item.variants.length > 0 && (
              <div className="mb-6 space-y-3">
                <label className="text-[9px] font-black uppercase text-[#e91e63] tracking-widest ml-1">Selecciona el tamaño / combo:</label>
                <div className="grid grid-cols-1 gap-2">
                  {item.variants.map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => setSelectedVariant(v)} 
                      className={`flex justify-between items-center p-4 rounded-2xl border-2 transition-all ${selectedVariant?.id === v.id ? 'border-[#e91e63] bg-pink-50' : 'border-[#f8eded] text-[#3d1a1a]/40 hover:border-pink-50 hover:bg-slate-50'}`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{v.name}</span>
                      <span className="text-xs font-black">S/ {v.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de Cantidad - Más esbelto */}
            <div className="mb-6">
              <h4 className="text-[9px] font-black uppercase text-[#e91e63] tracking-widest mb-3">¿Cuántos vas a querer?</h4>
              <div className="flex items-center gap-4 bg-slate-50 w-fit p-2 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white text-[#e91e63] rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-90 transition-all border border-slate-100"
                >
                  <i className="fa-solid fa-minus text-xs"></i>
                </button>
                <span className="text-xl font-black brand-font w-6 text-center text-[#3d1a1a]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white text-[#e91e63] rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-90 transition-all border border-slate-100"
                >
                  <i className="fa-solid fa-plus text-xs"></i>
                </button>
              </div>
            </div>
            
            {item.note && (
              <div className="p-4 bg-[#fdd835]/10 border border-[#fdd835]/30 rounded-2xl flex items-center gap-3 mb-2">
                 <i className="fa-solid fa-circle-info text-[#fdd835] text-lg"></i>
                 <p className="text-[9px] font-black uppercase text-[#3d1a1a]/60 leading-tight">{item.note}</p>
              </div>
            )}
          </div>

          {/* Footer del Modal - Más apretado contra el contenido */}
          <div className="p-6 md:px-10 md:py-8 border-t border-[#f8eded] flex flex-row items-center gap-6 bg-[#f8eded]/30">
            <div className="flex flex-col">
              <span className="text-[#3d1a1a]/30 text-[9px] font-black uppercase tracking-widest">Inversión Total</span>
              <span className="text-3xl font-black text-[#e91e63] brand-font tracking-tighter">S/ {totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { onAddToCart(item, selectedVariant, quantity); onClose(); }} 
              className="flex-1 bg-[#e91e63] text-white py-5 rounded-2xl brand-font font-bold uppercase tracking-[0.15em] text-xs shadow-xl shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-3 hover:brightness-110"
            >
              <i className="fa-solid fa-cart-plus text-base"></i>
              <span>¡Al Carro!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
