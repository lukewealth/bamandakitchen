/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // ========================
  // 🍛 RICE DISHES
  // ========================
  {
    id: 'ofada_rice_full',
    name: 'Ofada Sauce & Rice',
    description: 'Aromatic brown rice served with the iconic spicy, bleached-oil pepper sauce and assorted meats in a rustic wooden bowl.',
    price: 6000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/Ofada_Rice.png',
    portion: 'full',
    tags: ['african', 'spicy', 'classic'],
    available: true
  },
  {
    id: 'biryani_full',
    name: 'Chicken Biryani Rice',
    description: 'Fragrant basmati rice cooked with spiced chicken, caramelized onions, and fresh herbs on a ceramic plate.',
    price: 5000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/biryani.png',
    portion: 'full',
    tags: ['intercontinental', 'fragrant'],
    available: true
  },
  {
    id: 'jollof_smokey_full',
    name: 'Smokey Jollof',
    description: 'The legendary West African party favorite—rice cooked in a rich, smokey tomato base, served with grilled chicken on a dark plate.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    tag: 'Signature',
    portion: 'full',
    tags: ['popular', 'spicy', 'african'],
    available: true
  },
  {
    id: 'white_rice_full',
    name: 'White Rice',
    description: 'Fluffy steamed white rice served in a minimalist bowl, paired with a small sauce bowl.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/white_rice.png',
    portion: 'full',
    tags: ['basic', 'clean'],
    available: true
  },

  // ========================
  // 🍖 PROTEINS
  // ========================
  {
    id: 'turkey',
    name: 'Grilled Turkey',
    description: 'Succulent grilled turkey meat with crispy, glazed skin, served on a wooden platter.',
    price: 6000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/turkey.png',
    tags: ['meat', 'grilled'],
    available: true
  },
  {
    id: 'goat_meat',
    name: 'Goat Meat',
    description: 'Peppered goat meat chunks in a rich dark sauce, glossy finish, served in a rustic bowl.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/goat_meat.png',
    tags: ['meat', 'african'],
    available: true
  },
  {
    id: 'snail',
    name: 'Snail',
    description: 'Large African peppered snails, glossy sauce coating, served elegantly on a dark ceramic dish.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/peppered_snail.jpg',
    tags: ['delicacy', 'african', 'spicy'],
    available: true
  },
  {
    id: 'chicken_wings',
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings with golden texture and slight oil sheen, served with dipping sauce.',
    price: 2000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_wings.jpg',
    tags: ['chicken', 'crispy'],
    available: true
  },

  // ========================
  // 🍝 PASTA & NOODLES
  // ========================
  {
    id: 'seafood_pasta',
    name: 'Seafood Pasta',
    description: 'Luxury seafood pasta with shrimp, mussels, and creamy sauce on a white ceramic plate.',
    price: 14000,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/seafood_pasta.png',
    tags: ['luxury', 'seafood', 'intercontinental'],
    available: true
  },
  {
    id: 'chicken_noodles',
    name: 'Chicken Noodles',
    description: 'Stir-fried noodles with sliced chicken, vegetables, and glossy sauce in a modern bowl.',
    price: 6500,
    category: 'Pasta & Noodles',
    mealTime: ['Breakfast', 'Lunch'],
    image: '/images/meals/chicken_noodles.png',
    tags: ['quick', 'asian'],
    available: true
  },
  {
    id: 'spaghetti_jollof',
    name: 'Spaghetti Jollof',
    description: 'Spaghetti cooked in rich jollof sauce, deep red color, served on a modern plate.',
    price: 2500,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/spaghetti_jollof.png',
    tags: ['classic', 'african'],
    available: true
  },

  // ========================
  // 🌯 SNACKS
  // ========================
  {
    id: 'chicken_shawarma',
    name: 'Chicken Shawarma',
    description: 'Double-wrapped pita with spiced chicken, creamy garlic spread, sliced open to show filling.',
    price: 6000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/chicken_shawarma.png',
    tags: ['popular', 'quick', 'street-food'],
    available: true
  },
  {
    id: 'burger',
    name: 'Burger',
    description: 'Premium chicken burger with melted cheese, lettuce, tomato, served stacked with fries.',
    price: 12000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/burger.png',
    tags: ['gourmet', 'fastfood'],
    available: true
  },
  {
    id: 'moi_moi',
    name: 'Moi Moi',
    description: 'Steamed bean pudding sliced open showing egg and fish filling, served in a traditional wrap.',
    price: 1000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch'],
    image: '/images/meals/moi_moi.png',
    tags: ['traditional', 'healthy', 'protein'],
    available: true
  },

  // ========================
  // 🍲 SOUPS
  // ========================
  {
    id: 'goat_peppersoup',
    name: 'Goat Meat Pepper Soup',
    description: 'Hot spicy goat meat soup in a deep bowl, rich broth with steam rising.',
    price: 8000,
    category: 'African Dishes',
    mealTime: ['Dinner'],
    image: '/images/meals/goat_peppersoup.webp',
    tags: ['spicy', 'african', 'comfort'],
    available: true
  },
  {
    id: 'chicken_peppersoup',
    name: 'Chicken Pepper Soup',
    description: 'Spicy chicken broth with herbs floating, served in a rustic bowl with steam effect.',
    price: 8000,
    category: 'African Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_peppersoup.jpg',
    tags: ['spicy', 'soup'],
    available: true
  },
  {
    id: 'turkey_peppersoup',
    name: 'Turkey Pepper Soup',
    description: 'Turkey pepper soup with rich broth and visible spices in a premium bowl.',
    price: 7000,
    category: 'African Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/turkey_peppersoup.jpg',
    tags: ['spicy', 'protein'],
    available: true
  },

  // ========================
  // 🥤 DRINKS
  // ========================
  {
    id: 'coke',
    name: 'Coke',
    description: 'Chilled bottle of Coca-Cola with condensation droplets on a wooden table.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['soft', 'cold'],
    available: true
  },
  {
    id: 'fanta',
    name: 'Fanta',
    description: 'Cold Fanta bottle with bright orange color and condensation droplets.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=800',
    tags: ['soft', 'orange'],
    available: true
  },
  {
    id: 'water',
    name: 'Water',
    description: 'Premium bottled water with condensation, minimal clean aesthetic.',
    price: 500,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/water.png',
    tags: ['basic', 'hydration'],
    available: true
  }
];
