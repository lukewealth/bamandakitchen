/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // ========================
  // 🍛 RICE DISHES (WhatsApp Verified)
  // ========================
  {
    id: 'smokey_jollof',
    name: 'Smoky Jollof',
    description: 'The legendary West African party favorite—rice cooked in a rich, smokey tomato base.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    tags: ['popular', 'spicy', 'african'],
    available: true,
    whatsappLink: 'https://wa.me/p/25701161746178198/2349024084911'
  },
  {
    id: 'white_rice_portion',
    name: 'White Rice',
    description: 'Fluffy steamed white rice, a perfect canvas for our rich sauces.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/white_rice.png',
    tags: ['basic', 'clean'],
    available: true,
    whatsappLink: 'https://wa.me/p/24880919871584809/2349024084911'
  },
  {
    id: 'coconut_rice',
    name: 'Coconut Rice',
    description: 'Fragrant rice cooked in rich coconut milk with traditional spices.',
    price: 3000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    tags: ['fragrant', 'coconut', 'african'],
    available: true,
    whatsappLink: 'https://wa.me/p/25861330760155652/2349024084911'
  },
  {
    id: 'caribbean_rice',
    name: 'Caribbean Rice',
    description: 'A vibrant and exotic rice blend featuring tropical flavors and spices.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1536392706976-e486e2ba97af?auto=format&fit=crop&q=80&w=800',
    tags: ['exotic', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25895194433474718/2349024084911'
  },
  {
    id: 'fried_rice_portion',
    name: 'Fried Rice',
    description: 'Classic savory fried rice with mixed vegetables and aromatic seasoning.',
    price: 3500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    tags: ['classic', 'savory'],
    available: true,
    whatsappLink: 'https://wa.me/p/33686886654259093/2349024084911'
  },
  {
    id: 'chinese_rice',
    name: 'Chinese Rice',
    description: 'Stir-fried rice inspired by oriental traditions, rich in umami.',
    price: 3500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    tags: ['oriental', 'umami'],
    available: true,
    whatsappLink: 'https://wa.me/p/26105223425804624/2349024084911'
  },
  {
    id: 'jambalaya_rice',
    name: 'Jambalaya Rice',
    description: 'A bold, one-pot rice dish packed with meat, vegetables, and intense spices.',
    price: 3500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    tags: ['bold', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25737566265863983/2349024084911'
  },
  {
    id: 'asun_rice',
    name: 'Asun Rice',
    description: 'Spicy peppered goat meat (Asun) incorporated into a rich rice base.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    tags: ['spicy', 'goat-meat'],
    available: true,
    whatsappLink: 'https://wa.me/p/33557577183888462/2349024084911'
  },
  {
    id: 'native_rice',
    name: 'Native Rice',
    description: 'Village-style rice prepared with palm oil, locust beans, and local spices.',
    price: 3000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/ofada_rice.png',
    tags: ['traditional', 'native'],
    available: true,
    whatsappLink: 'https://wa.me/p/26630162943238544/2349024084911'
  },

  // ========================
  // 🍖 PROTEINS (WhatsApp Verified)
  // ========================
  {
    id: 'peppered_wings_verified',
    name: 'Peppered Chicken Wings',
    description: 'Crispy fried chicken wings tossed in a spicy, glossy pepper sauce.',
    price: 1500,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_wings.jpg',
    tags: ['chicken', 'spicy', 'snack'],
    available: true,
    whatsappLink: 'https://wa.me/p/25975139568840526/2349024084911'
  },
  {
    id: 'chicken_curation',
    name: 'Chicken',
    description: 'Succulent and well-seasoned curated chicken, grilled to perfection.',
    price: 6000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/turkey.png',
    tags: ['protein', 'grilled'],
    available: true,
    whatsappLink: 'https://wa.me/p/26387980920798908/2349024084911'
  },
  {
    id: 'titus_fish',
    name: 'Titus Fish',
    description: 'Fried Titus fish, seasoned with heritage spices.',
    price: 3000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'fried'],
    available: true,
    whatsappLink: 'https://wa.me/p/26597784393157127/2349024084911'
  },
  {
    id: 'gizzard_portion',
    name: 'Gizzard',
    description: 'Spicy peppered gizzard, a perfect crunchy protein addition.',
    price: 2500,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/goat_meat.png',
    tags: ['gizzard', 'peppered'],
    available: true,
    whatsappLink: 'https://wa.me/p/25685241957750962/2349024084911'
  },
  {
    id: 'boiled_egg',
    name: 'Boiled Egg',
    description: 'Perfectly boiled egg for that extra protein boost.',
    price: 500,
    category: 'Proteins',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1506084868730-342337f90f23?auto=format&fit=crop&q=80&w=800',
    tags: ['protein', 'basic'],
    available: true,
    whatsappLink: 'https://wa.me/p/25501974992817913/2349024084911'
  },

  // ========================
  // 🍝 PASTA & SIDES (WhatsApp Verified)
  // ========================
  {
    id: 'jollof_spaghetti_portion',
    name: 'Jollof Spaghetti',
    description: 'Spaghetti cooked in a rich and spicy tomato-based Jollof sauce.',
    price: 2500,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/spaghetti_jollof.png',
    tags: ['pasta', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25883557641293785/2349024084911'
  },
  {
    id: 'egg_sauce',
    name: 'Egg Sauce',
    description: 'Savory stir-fried egg sauce with tomatoes, onions, and peppers.',
    price: 2000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    tags: ['savory', 'breakfast'],
    available: true,
    whatsappLink: 'https://wa.me/p/25838240129165540/2349024084911'
  },
  {
    id: 'plantain_portion',
    name: 'Plantain',
    description: 'Sweet fried golden plantain portions.',
    price: 1000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1594914141253-066929949633?auto=format&fit=crop&q=80&w=800',
    tags: ['sweet', 'classic'],
    available: true,
    whatsappLink: 'https://wa.me/p/25839136712442644/2349024084911'
  },

  // ========================
  // 🍲 SIGNATURE SOUPS & OTHERS (Existing Specialties)
  // ========================
  {
    id: 'goat_peppersoup_verified',
    name: 'Goat Meat Pepper Soup',
    description: 'Hot spicy goat meat soup with traditional healing herbs.',
    price: 8000,
    category: 'African Dishes',
    mealTime: ['Dinner'],
    image: '/images/meals/goat_peppersoup.webp',
    tags: ['spicy', 'soup'],
    available: true,
    isTrending: true
  },
  {
    id: 'seafood_pasta_luxury',
    name: 'Seafood Pasta',
    description: 'Luxury seafood pasta with shrimp and mussels in a creamy heritage sauce.',
    price: 14000,
    category: 'Intercontinental',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/seafood_pasta.png',
    tags: ['luxury', 'seafood'],
    available: true
  },
  {
    id: 'water_premium',
    name: 'Water',
    description: 'Premium bottled water, chilled.',
    price: 500,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/water.png',
    tags: ['basic', 'hydration'],
    available: true
  }
];
