
import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // SANGUCHES
  {
    id: 's1',
    name: 'Mal Mandao',
    description: 'Seco de res al estilo norteño, con sarsa criollita, acompañado de mayonesa de la casa, en pan francés.',
    price: 15,
    category: 'SANGUCHES',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=800',
    isPopular: true,
    tags: ['norteño', 'res', 'especialidad']
  },
  {
    id: 's2',
    name: 'Pavo al Horno',
    description: 'Jugoso pavito al horno, acompañado de salsa criolla y mayonesa de la casa en pan francés.',
    price: 15,
    category: 'SANGUCHES',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800',
    isPopular: true,
    tags: ['clásico', 'pavo']
  },
  {
    id: 's3',
    name: 'Salchicha Huachana',
    description: 'Salchicha huachana al horno, con chimichurri y mayonesa casera en pan francés. Uno de los más pedidos.',
    price: 12,
    category: 'SANGUCHES',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=800',
    tags: ['tradicional', 'favorito']
  },
  {
    id: 's4',
    name: 'Pan con Chicharrón',
    description: 'Delicioso chicharrón acompañado de camote amarillo, sarsa criolla en pan francés.',
    price: 15,
    category: 'SANGUCHES',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800',
    isPopular: true,
    tags: ['clásico', 'chicharrón']
  },
  {
    id: 's5',
    name: 'Choripan Artesanal',
    description: 'Choripan artesanal con salsa chimichurri y mayonesa de la casa en pan francés.',
    price: 9,
    category: 'SANGUCHES',
    image: 'https://images.unsplash.com/photo-1629814249584-bd4d53cb0ee0?q=80&w=800',
    tags: ['artesanal', 'parrilla']
  },
  {
    id: 's6',
    name: 'Lechón al Horno',
    description: 'Lechoncito al horno, acompañado de salsa criolla y mayonesa de la casa en pan francés.',
    price: 15,
    category: 'SANGUCHES',
    image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?q=80&w=800',
    tags: ['lechón', 'tradición']
  },

  // PLATOS & ESPECIALIDADES
  {
    id: 'p1',
    name: 'Tallarines con Pavo',
    description: 'Tallarines con pavo al horno acompañado de chifles y sarsa criolla.',
    price: 45,
    category: 'PLATOS',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800',
    tags: ['contundente', 'piura']
  },
  {
    id: 'p2',
    name: 'Carne Seca con Chifles',
    description: 'Lo mejor de Piura, su carne seca con chifles, acompañada de sarsa criollita.',
    price: 20,
    category: 'PLATOS',
    image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=800',
    tags: ['piura', 'carne seca']
  },
  {
    id: 'p3',
    name: 'Frito Piurano',
    description: 'Delicioso adobo de chanchito, acompañado de arroz amarillo, camote, plátano, tamal, y encebollado. (Solo los domingos).',
    price: 30,
    category: 'PLATOS',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800',
    note: 'Solo los domingos',
    tags: ['domingos', 'festín']
  },
  {
    id: 'p4',
    name: 'Tamalitos de Chancho',
    description: 'Tamalitos piuranos de puro chancho con su sarsa criollita.',
    price: 6,
    category: 'PLATOS',
    image: 'https://images.unsplash.com/photo-1583024834641-72148b52817a?q=80&w=800',
    tags: ['entrada', 'tradición']
  },

  // BEBIDAS & EXTRAS
  {
    id: 'b1',
    name: 'Chicha Morada',
    description: 'Refrescante y casera.',
    price: 5,
    category: 'BEBIDAS',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
    tags: ['casera', 'fría']
  },
  {
    id: 'b2',
    name: 'Café Pasadito',
    description: 'Café de puro grano para acompañar tu sánguche.',
    price: 5,
    category: 'BEBIDAS',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800',
    tags: ['caliente', 'mañanero']
  },
  {
    id: 'e1',
    name: 'Chifles',
    description: 'Bolsas de chifles piuranos artesanales.',
    price: 10,
    category: 'EXTRAS',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=800',
    variants: [
      { id: 'v1', name: 'Bolsa S/ 10', price: 10 },
      { id: 'v2', name: 'Bolsa S/ 15', price: 15 }
    ]
  }
];
