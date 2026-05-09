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
    description: 'Aromatic brown rice served with the iconic spicy, bleached-oil pepper sauce and assorted meats.',
    price: 6000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/ofada_rice.png',
    portion: 'full',
    tags: ['african', 'spicy', 'classic'],
    available: true
  },
  {
    id: 'biryani_full',
    name: 'Chicken Biryani Rice',
    description: 'Fragrant basmati rice cooked with spiced chicken, caramelized onions, and fresh herbs.',
    price: 5000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/biryani.png',
    portion: 'full',
    tags: ['intercontinental', 'fragrant'],
    available: true
  },
  {
    id: 'biryani_half',
    name: 'Chicken Biryani Rice (Half)',
    description: 'Fragrant basmati rice cooked with spiced chicken, caramelized onions, and fresh herbs.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/biryani.png',
    portion: 'half',
    tags: ['intercontinental', 'portion'],
    available: true
  },
  {
    id: 'asun_rice_full',
    name: 'Asun Rice',
    description: 'Spicy peppered goat meat incorporated into a rich rice base.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['spicy', 'goat-meat'],
    available: true,
    whatsappLink: 'https://wa.me/p/33557577183888462/2349024084911'
  },
  {
    id: 'asun_rice_half',
    name: 'Asun Rice (Half)',
    description: 'Spicy peppered goat meat incorporated into a rich rice base.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['spicy', 'portion'],
    available: true
  },
  {
    id: 'caribbean_rice_full',
    name: 'Caribbean Rice',
    description: 'A vibrant and exotic rice blend featuring tropical flavors and spices.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1536392706976-e486e2ba97af?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['exotic', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25895194433474718/2349024084911'
  },
  {
    id: 'caribbean_rice_half',
    name: 'Caribbean Rice (Half)',
    description: 'A vibrant and exotic rice blend featuring tropical flavors and spices.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1536392706976-e486e2ba97af?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['exotic', 'portion'],
    available: true
  },
  {
    id: 'chinese_rice_full',
    name: 'Chinese Rice',
    description: 'Stir-fried rice inspired by oriental traditions, rich in umami.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['oriental', 'umami'],
    available: true,
    whatsappLink: 'https://wa.me/p/26105223425804624/2349024084911'
  },
  {
    id: 'chinese_rice_half',
    name: 'Chinese Rice (Half)',
    description: 'Stir-fried rice inspired by oriental traditions, rich in umami.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['oriental', 'portion'],
    available: true
  },
  {
    id: 'jambalaya_rice_full',
    name: 'Jambalaya Rice',
    description: 'A bold, one-pot rice dish packed with meat, vegetables, and intense spices.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['bold', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25737566265863983/2349024084911'
  },
  {
    id: 'jambalaya_rice_half',
    name: 'Jambalaya Rice (Half)',
    description: 'A bold, one-pot rice dish packed with meat, vegetables, and intense spices.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['bold', 'portion'],
    available: true
  },
  {
    id: 'coconut_rice_full',
    name: 'Coconut Rice',
    description: 'Fragrant rice cooked in rich coconut milk with traditional spices.',
    price: 3500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['fragrant', 'coconut'],
    available: true,
    whatsappLink: 'https://wa.me/p/25861330760155652/2349024084911'
  },
  {
    id: 'coconut_rice_half',
    name: 'Coconut Rice (Half)',
    description: 'Fragrant rice cooked in rich coconut milk with traditional spices.',
    price: 1800,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['fragrant', 'portion'],
    available: true
  },
  {
    id: 'fried_rice_full',
    name: 'Fried Rice',
    description: 'Classic savory fried rice with mixed vegetables and aromatic seasoning.',
    price: 3500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['classic', 'savory'],
    available: true,
    whatsappLink: 'https://wa.me/p/33686886654259093/2349024084911'
  },
  {
    id: 'fried_rice_half',
    name: 'Fried Rice (Half)',
    description: 'Classic savory fried rice with mixed vegetables and aromatic seasoning.',
    price: 1800,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['classic', 'portion'],
    available: true
  },
  {
    id: 'homemade_jollof_full',
    name: 'Home made Jollof',
    description: 'Traditional Jollof rice prepared with love and authentic home spices.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    portion: 'full',
    tags: ['homemade', 'african'],
    available: true
  },
  {
    id: 'homemade_jollof_half',
    name: 'Home made Jollof (Half)',
    description: 'Traditional Jollof rice prepared with love and authentic home spices.',
    price: 1300,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    portion: 'half',
    tags: ['homemade', 'portion'],
    available: true
  },
  {
    id: 'smokey_jollof_full',
    name: 'Smokey Jollof',
    description: 'The legendary West African party favorite—rice cooked in a rich, smokey tomato base.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    portion: 'full',
    tags: ['popular', 'spicy', 'african'],
    available: true,
    whatsappLink: 'https://wa.me/p/25701161746178198/2349024084911'
  },
  {
    id: 'smokey_jollof_half',
    name: 'Smokey Jollof (Half)',
    description: 'The legendary West African party favorite—rice cooked in a rich, smokey tomato base.',
    price: 1300,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    portion: 'half',
    tags: ['popular', 'portion'],
    available: true
  },
  {
    id: 'party_jollof_full',
    name: 'Party Jollof',
    description: 'Authentic party-style Jollof rice with that unmistakable celebratory flavor.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    portion: 'full',
    tags: ['party', 'classic'],
    available: true
  },
  {
    id: 'party_jollof_half',
    name: 'Party Jollof (Half)',
    description: 'Authentic party-style Jollof rice with that unmistakable celebratory flavor.',
    price: 1300,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/jollof_smokey.png',
    portion: 'half',
    tags: ['party', 'portion'],
    available: true
  },
  {
    id: 'native_rice_full',
    name: 'Native Rice',
    description: 'Village-style rice prepared with palm oil, locust beans, and local spices.',
    price: 3000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/ofada_rice.png',
    portion: 'full',
    tags: ['traditional', 'native'],
    available: true,
    whatsappLink: 'https://wa.me/p/26630162943238544/2349024084911'
  },
  {
    id: 'native_rice_half',
    name: 'Native Rice (Half)',
    description: 'Village-style rice prepared with palm oil, locust beans, and local spices.',
    price: 1500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/ofada_rice.png',
    portion: 'half',
    tags: ['traditional', 'portion'],
    available: true
  },
  {
    id: 'stir_fried_rice_full',
    name: 'Stir Fried Rice',
    description: 'Vibrant rice stir-fried with fresh vegetables and heritage seasonings.',
    price: 3000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['vibrant', 'fresh'],
    available: true
  },
  {
    id: 'stir_fried_rice_half',
    name: 'Stir Fried Rice (Half)',
    description: 'Vibrant rice stir-fried with fresh vegetables and heritage seasonings.',
    price: 1500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['vibrant', 'portion'],
    available: true
  },
  {
    id: 'rice_and_beans_full',
    name: 'Rice and Beans',
    description: 'A balanced classic combining fluffy rice and slow-cooked beans.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800',
    portion: 'full',
    tags: ['balanced', 'classic'],
    available: true
  },
  {
    id: 'rice_and_beans_half',
    name: 'Rice and Beans (Half)',
    description: 'A balanced classic combining fluffy rice and slow-cooked beans.',
    price: 1500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&q=80&w=800',
    portion: 'half',
    tags: ['balanced', 'portion'],
    available: true
  },
  {
    id: 'white_rice_full',
    name: 'White Rice',
    description: 'Fluffy steamed white rice, a perfect canvas for our rich sauces.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/white_rice.png',
    portion: 'full',
    tags: ['basic', 'clean'],
    available: true,
    whatsappLink: 'https://wa.me/p/24880919871584809/2349024084911'
  },
  {
    id: 'white_rice_half',
    name: 'White Rice (Half)',
    description: 'Fluffy steamed white rice, a perfect canvas for our rich sauces.',
    price: 1000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/white_rice.png',
    portion: 'half',
    tags: ['basic', 'portion'],
    available: true
  },
  {
    id: 'basmati_white_rice',
    name: 'Basmati white rice',
    description: 'Long-grain fragrant basmati rice, steamed to perfection.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512058560366-cd2427ff5a63?auto=format&fit=crop&q=80&w=800',
    tags: ['premium', 'fragrant'],
    available: true
  },

  // ========================
  // 🍖 PROTEINS (Meat & Fish)
  // ========================
  {
    id: 'panla_fish',
    name: 'panla Fish',
    description: 'Crispy fried panla fish, perfectly seasoned.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['fish', 'crispy'],
    available: true
  },
  {
    id: 'full_panla_fish',
    name: 'Full panla Fish',
    description: 'A complete fried panla fish curation.',
    price: 10000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['fish', 'feast'],
    available: true
  },
  {
    id: 'turkey_standard',
    name: 'Turkey',
    description: 'Succulent grilled turkey meat with crispy, glazed skin.',
    price: 6000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/turkey.png',
    tags: ['meat', 'grilled'],
    available: true,
    whatsappLink: 'https://wa.me/p/26387980920798908/2349024084911'
  },
  {
    id: 'big_turkey',
    name: 'Big Turkey',
    description: 'A larger portion of our signature succulent grilled turkey.',
    price: 7000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/turkey.png',
    tags: ['meat', 'large'],
    available: true
  },
  {
    id: 'chicken_laps_standard',
    name: 'Chicken laps',
    description: 'Tender and juicy chicken laps, seasoned and grilled.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['chicken', 'tender'],
    available: true
  },
  {
    id: 'chicken_laps_large',
    name: 'Chicken Laps',
    description: 'Premium large chicken laps, seasoned and grilled.',
    price: 6000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['chicken', 'premium'],
    available: true
  },
  {
    id: 'croaker_fish',
    name: 'Croaker Fish',
    description: 'Freshly grilled or fried croaker fish with heritage herbs.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['fish', 'grilled'],
    available: true
  },
  {
    id: 'tilapia_fish',
    name: 'Tilapia Fish',
    description: 'Artisanal Tilapia fish curation, seasoned to perfection.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['fish', 'artisanal'],
    available: true
  },
  {
    id: 'asun_protein',
    name: 'Asun',
    description: 'Spicy peppered goat meat chunks, authentic and bold.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    tags: ['meat', 'spicy'],
    available: true
  },
  {
    id: 'goat_meat_standard',
    name: 'Goat Meat',
    description: 'Peppered goat meat chunks in a rich dark sauce.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/goat_meat.png',
    tags: ['meat', 'african'],
    available: true
  },
  {
    id: 'kote_fish',
    name: 'Kote Fish',
    description: 'Traditional fried Kote fish, well seasoned.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['fish', 'traditional'],
    available: true
  },
  {
    id: 'titus_protein',
    name: 'Titus',
    description: 'Fried Titus fish, seasoned with heritage spices.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'fried'],
    available: true,
    whatsappLink: 'https://wa.me/p/26597784393157127/2349024084911'
  },
  {
    id: 'catfish_peppered',
    name: 'Catfish Peppered',
    description: 'Spicy peppered catfish, a true heritage delicacy.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['fish', 'spicy'],
    available: true
  },
  {
    id: 'snail_standard',
    name: 'Snail',
    description: 'Large African peppered snails, glossy sauce coating.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/peppered_snail.jpg',
    tags: ['delicacy', 'spicy'],
    available: true
  },
  {
    id: 'crispy_chicken',
    name: 'Crispy Chicken',
    description: 'Golden fried chicken with a crunch that speaks of heritage.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['chicken', 'crispy'],
    available: true
  },
  {
    id: 'gizzard_standard',
    name: 'Gizzard',
    description: 'Spicy peppered gizzard, perfect for snacking or as a side.',
    price: 2500,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/goat_meat.png',
    tags: ['gizzard', 'peppered'],
    available: true,
    whatsappLink: 'https://wa.me/p/25685241957750962/2349024084911'
  },
  {
    id: 'chicken_wings_standard',
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings tossed in a spicy, glossy pepper sauce.',
    price: 2000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_wings.jpg',
    tags: ['chicken', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25975139568840526/2349024084911'
  },
  {
    id: 'assorted_meat',
    name: 'Assorted Meat',
    description: 'A variety of peppered meats curated for the true enthusiast.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['meat', 'assorted'],
    available: true
  },
  {
    id: 'beef_portion',
    name: 'Beef',
    description: 'Tender peppered beef chunks.',
    price: 1500,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['beef', 'tender'],
    available: true
  },
  {
    id: 'boiled_egg_protein',
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
  // 🍝 PASTA & NOODLES
  // ========================
  {
    id: 'seafood_pasta_verified',
    name: 'Seafood Pasta',
    description: 'Luxury seafood pasta with shrimp and mussels in a creamy heritage sauce.',
    price: 14000,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/seafood_pasta.png',
    tags: ['luxury', 'seafood'],
    available: true
  },
  {
    id: 'stir_fried_pasta',
    name: 'Stir Fried Pasta',
    description: 'Savory stir-fried pasta with vegetables and heritage seasonings.',
    price: 3000,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['savory', 'pasta'],
    available: true
  },
  {
    id: 'chicken_noodles_verified',
    name: 'Chicken Noodles',
    description: 'Stir-fried noodles with sliced chicken and glossy heritage sauce.',
    price: 6500,
    category: 'Pasta & Noodles',
    mealTime: ['Breakfast', 'Lunch'],
    image: '/images/meals/chicken_noodles.png',
    tags: ['quick', 'chicken'],
    available: true
  },
  {
    id: 'noodles_and_egg',
    name: 'Noodles & Egg (2 noodles & 2 eggs)',
    description: 'Double portion of noodles paired with two perfectly cooked eggs.',
    price: 5000,
    category: 'Pasta & Noodles',
    mealTime: ['Breakfast', 'Lunch'],
    image: '',
    tags: ['filling', 'breakfast'],
    available: true
  },
  {
    id: 'shredded_beef_pasta',
    name: 'Shredded Beef Pasta',
    description: 'Pasta tossed with tender shredded beef and rich sauce.',
    price: 3500,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['beef', 'pasta'],
    available: true
  },
  {
    id: 'spaghetti_jollof_full',
    name: 'Spaghetti Jollof',
    description: 'Spaghetti cooked in a rich and spicy tomato-based Jollof sauce.',
    price: 2500,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/spaghetti_jollof.png',
    portion: 'full',
    tags: ['pasta', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25883557641293785/2349024084911'
  },
  {
    id: 'spaghetti_jollof_half',
    name: 'Spaghetti Jollof (Half)',
    description: 'Spaghetti cooked in a rich and spicy tomato-based Jollof sauce.',
    price: 1300,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/spaghetti_jollof.png',
    portion: 'half',
    tags: ['pasta', 'portion'],
    available: true
  },

  // ========================
  // 🌯 SNACKS
  // ========================
  {
    id: 'burger_luxury',
    name: 'Burger (French Fresh & Classic Chicken)',
    description: 'Premium chicken burger served with French-style fresh fries.',
    price: 12000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/burger.png',
    tags: ['gourmet', 'chicken'],
    available: true
  },
  {
    id: 'big_chicken_chips',
    name: 'Big Chicken & Chips',
    description: 'Large portion of crispy fried chicken and golden potato chips.',
    price: 9000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['large', 'chicken'],
    available: true
  },
  {
    id: 'small_chicken_chips',
    name: 'Small Chicken & Chips',
    description: 'A standard portion of crispy fried chicken and golden potato chips.',
    price: 8000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['standard', 'chicken'],
    available: true
  },
  {
    id: 'chicken_shawarma_verified',
    name: 'Chicken Shawarma',
    description: 'Double-wrapped pita with spiced chicken and creamy garlic spread.',
    price: 6000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/chicken_shawarma.png',
    tags: ['popular', 'chicken'],
    available: true
  },
  {
    id: 'beef_shawarma',
    name: 'Beef Shawarma',
    description: 'Double-wrapped pita with spiced beef and creamy heritage sauce.',
    price: 6000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '',
    tags: ['popular', 'beef'],
    available: true
  },
  {
    id: 'yamarita',
    name: 'Yamarita',
    description: 'Egg-coated fried yam fingers, a local favorite.',
    price: 3000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch'],
    image: '',
    tags: ['yam', 'traditional'],
    available: true
  },
  {
    id: 'yam_chips',
    name: 'Yam Chips',
    description: 'Crispy deep-fried yam slices.',
    price: 3000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch'],
    image: '',
    tags: ['yam', 'crispy'],
    available: true
  },
  {
    id: 'moi_moi_standard',
    name: 'Moi Moi',
    description: 'Steamed bean pudding with traditional heritage filling.',
    price: 1000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch'],
    image: '/images/meals/moi_moi.png',
    tags: ['traditional', 'protein'],
    available: true
  },

  // ========================
  // 🍲 SIDES, SAUCES & PORRIDGE
  // ========================
  {
    id: 'peppersoup_catfish_yam',
    name: 'Peppersoup Catfish Yam',
    description: 'Spicy catfish pepper soup with slow-cooked yam cubes.',
    price: 6500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Dinner'],
    image: '',
    tags: ['spicy', 'yam'],
    available: true
  },
  {
    id: 'plantain_egg_sauce',
    name: 'Plantain and Egg Sauce',
    description: 'Fried plantain served with savory stir-fried egg sauce.',
    price: 5000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Breakfast', 'Lunch'],
    image: '',
    tags: ['classic', 'breakfast'],
    available: true
  },
  {
    id: 'vegetable_boiled_plantain',
    name: 'Vegetable and Boiled Plantain',
    description: 'Healthy boiled plantain served with rich vegetable sauce.',
    price: 5000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['healthy', 'vegetable'],
    available: true
  },
  {
    id: 'yam_egg_sauce',
    name: 'Yam and Egg Sauce',
    description: 'Boiled or fried yam served with savory egg sauce.',
    price: 4000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    tags: ['classic', 'breakfast'],
    available: true,
    whatsappLink: 'https://wa.me/p/25838240129165540/2349024084911'
  },
  {
    id: 'ukwa_standard',
    name: 'Breadfruit (Ukwa)',
    description: 'Premium breadfruit curation, a traditional Igbo delicacy.',
    price: 3000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['ukwa', 'delicacy'],
    available: true
  },
  {
    id: 'ukwa_dry_fish',
    name: 'Dry Fish (Ukwa)',
    description: 'Premium breadfruit curation paired with intense dry fish.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['ukwa', 'fish'],
    available: true
  },
  {
    id: 'yam_porridge',
    name: 'Yam Porridge',
    description: 'Slow-cooked yam in a rich tomato and palm oil base.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['yam', 'traditional'],
    available: true
  },
  {
    id: 'potato_porridge',
    name: 'Potato Porridge',
    description: 'Traditional porridge made with tender potatoes.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['potato', 'traditional'],
    available: true
  },
  {
    id: 'plantain_porridge',
    name: 'Plantain Porridge',
    description: 'Sweet and savory plantain porridge curation.',
    price: 1000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['plantain', 'sweet'],
    available: true
  },
  {
    id: 'beans_side',
    name: 'Beans',
    description: 'Slow-cooked honey beans portion.',
    price: 1000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['honey-beans', 'protein'],
    available: true
  },
  {
    id: 'ofada_sauce_side',
    name: 'Ofada Sauce',
    description: 'Extra portion of our signature spicy Ofada sauce.',
    price: 3000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['sauce', 'spicy'],
    available: true
  },
  {
    id: 'curry_sauce_side',
    name: 'Curry Sauce',
    description: 'Rich and aromatic heritage curry sauce.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['sauce', 'curry'],
    available: true
  },
  {
    id: 'plantain_side_verified',
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
  // 🍲 SIGNATURE SOUPS
  // ========================
  {
    id: 'goat_meat_peppersoup',
    name: 'Goat meat pepper soup',
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
    id: 'chicken_pepper_soup',
    name: 'Chicken pepper soup',
    description: 'Spicy chicken broth with heritage herbs.',
    price: 8000,
    category: 'African Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_peppersoup.jpg',
    tags: ['spicy', 'soup'],
    available: true
  },
  {
    id: 'turkey_pepper_soup',
    name: 'Turkey pepper soup',
    description: 'Turkey pepper soup with rich broth and visible heritage spices.',
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
    id: 'red_wine',
    name: 'Red Wine',
    description: 'Premium curated red wine bottle.',
    price: 10000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['luxury', 'wine'],
    available: true
  },
  {
    id: 'five_alive',
    name: '5Alive',
    description: 'Chilled 5Alive fruit juice.',
    price: 2000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '',
    tags: ['juice', 'chilled'],
    available: true
  },
  {
    id: 'hollandia',
    name: 'Hollandia',
    description: 'Hollandia yogurt curation.',
    price: 3000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '',
    tags: ['yogurt', 'chilled'],
    available: true
  },
  {
    id: 'chivita',
    name: 'Chivita',
    description: 'Premium Chivita fruit juice.',
    price: 3000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '',
    tags: ['juice', 'premium'],
    available: true
  },
  {
    id: 'active_juice',
    name: 'Active Juice',
    description: 'Refreshing Active fruit juice.',
    price: 3000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '',
    tags: ['juice', 'active'],
    available: true
  },
  {
    id: 'amstel_malt',
    name: 'Amstel Malt',
    description: 'Premium Amstel Malt beverage.',
    price: 1300,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['malt', 'premium'],
    available: true
  },
  {
    id: 'canned_fanta',
    name: 'Canned Fanta',
    description: 'Chilled Fanta in a can.',
    price: 1200,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['soft-drink', 'canned'],
    available: true
  },
  {
    id: 'malta_guinness',
    name: 'Malta Guinness',
    description: 'The legendary Malta Guinness beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['malt', 'classic'],
    available: true
  },
  {
    id: 'maltina',
    name: 'Maltina',
    description: 'Smooth Maltina beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['malt', 'smooth'],
    available: true
  },
  {
    id: 'nutri_milk',
    name: 'Nutri Milk',
    description: 'Nutritional milk beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Breakfast'],
    image: '',
    tags: ['milk', 'nutrition'],
    available: true
  },
  {
    id: 'active_zest',
    name: 'Active Zest',
    description: 'Zesty refreshing beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['zesty', 'refreshing'],
    available: true
  },
  {
    id: 'fearless',
    name: 'Fearless',
    description: 'Energy drink curation.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['energy', 'active'],
    available: true
  },
  {
    id: 'schweppes',
    name: 'Schweppes',
    description: 'Premium Schweppes beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['tonic', 'premium'],
    available: true
  },
  {
    id: 'pepsi',
    name: 'Pepsi',
    description: 'Chilled Pepsi bottle.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['soft-drink', 'pepsi'],
    available: true
  },
  {
    id: 'coke',
    name: 'Coke',
    description: 'Chilled bottle of Coca-Cola.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['soft', 'cold'],
    available: true
  },
  {
    id: 'seven_up',
    name: '7up',
    description: 'Chilled 7up bottle.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['soft-drink', 'lemon-lime'],
    available: true
  },
  {
    id: 'teem',
    name: 'Teem',
    description: 'Refreshing Teem beverage.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['soft-drink', 'teem'],
    available: true
  },
  {
    id: 'sprite',
    name: 'Sprite',
    description: 'Chilled Sprite bottle.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '',
    tags: ['soft-drink', 'lemon-lime'],
    available: true
  },
  {
    id: 'fanta',
    name: 'Fanta',
    description: 'Chilled Fanta bottle.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&q=80&w=800',
    tags: ['soft', 'orange'],
    available: true
  },
  {
    id: 'bottle_water',
    name: 'Bottle Water',
    description: 'Premium bottled water, minimal clean aesthetic.',
    price: 500,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/water.png',
    tags: ['basic', 'hydration'],
    available: true
  }
];
