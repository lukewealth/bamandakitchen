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

export type Screen = 'home' | 'menu' | 'checkout' | 'kitchen' | 'blog';
