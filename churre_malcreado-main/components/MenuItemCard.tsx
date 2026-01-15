
import { MenuItem } from '../types';
import React, { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, event: React.MouseEvent) => void;
  onShowDetails: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart, onShowDetails }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      onClick={onShowDetails}
      className="product-card group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl flex flex-col border border-white"
    >
      <div className="relative aspect-square overflow-hidden bg-pink-50/30">
        <img 
          src={item.image} 
          alt={item.name} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {item.isPopular && (
          <div className="absolute top-3 right-3">
             <span className="bg-[#fdd835] text-black text-[9px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg border-2 border-white">🔥 Malcriado</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
           <span className="text-[9px] font-black uppercase text-[#e91e63]/30 tracking-widest">{item.category}</span>
           <h3 className="brand-font text-sm font-bold text-[#3d1a1a] leading-tight line-clamp-2 h-9 flex items-center">{item.name}</h3>
        </div>
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-[#f8eded]">
          <span className="text-lg font-black text-[#e91e63] brand-font tracking-tighter">S/ {item.price.toFixed(2)}</span>
          <div className="w-8 h-8 rounded-full bg-[#f8eded] text-[#e91e63] flex items-center justify-center group-hover:bg-[#e91e63] group-hover:text-white transition-all shadow-inner">
             <i className="fa-solid fa-plus text-[10px]"></i>
          </div>
        </div>
      </div>
    </div>
  );
};
