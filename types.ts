
export interface Category {
  id: number | string;
  name: string;
}

export interface ItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  note?: string;
  isPopular?: boolean;
  isCombo?: boolean;
  comboItems?: string[];
  tags?: string[];
  variants?: ItemVariant[]; 
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedVariant?: ItemVariant; 
}

export interface AppConfig {
  images: {
    logo: string;
    menuLogo: string;
    selectorLogo: string;
    aiAvatar: string;
    slideBackgrounds: string[];
    menuBackground: string;
  };
  menu: MenuItem[];
  whatsappNumber: string;
  socialMedia: { facebook: string; instagram: string; tiktok: string; };
  paymentQr?: string;
  paymentName?: string;
}

// Fix: Added missing CashSession interface for POS shift management
export interface CashSession {
  id: number;
  user_name: string;
  status: 'open' | 'closed';
  opening_balance: number;
  total_sales: number;
  total_entry: number;
  total_exit: number;
  opened_at: string;
  closed_at?: string;
  closing_balance?: number;
}

// Fix: Added missing CashTransaction interface for recording money movements
export interface CashTransaction {
  id: number;
  session_id: number;
  type: 'entry' | 'exit';
  amount: number;
  reason: string;
  created_at: string;
}
