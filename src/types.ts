/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MenuCategory = 
  | 'Rice Dishes' 
  | 'Proteins' 
  | 'Pasta & Noodles' 
  | 'Snacks' 
  | 'Sides, Sauces & Porridge' 
  | 'Drinks' 
  | 'Heritage Collection'
  | 'African Dishes'
  | 'Intercontinental';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  mealTime: ('Breakfast' | 'Lunch' | 'Dinner')[];
  image: string;
  tag?: string;
  portion?: 'full' | 'half';
  tags: string[];
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  estimatedDeliveryTime: number; // minutes remaining
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export type Screen = 'home' | 'menu' | 'checkout' | 'kitchen' | 'blog' | 'contact' | 'track-order' | 'admin';
