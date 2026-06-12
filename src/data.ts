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
    description: 'Aromatic heritage brown rice served with our signature spicy, bleached-oil pepper sauce and tender assorted meats.',
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
    description: 'Fragrant premium basmati rice slow-cooked with spiced chicken, caramelized onions, and fresh garden herbs.',
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
    description: 'A delicate portion of our fragrant basmati rice cooked with spiced chicken and aromatic herbs.',
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
    description: 'Boldly spiced peppered goat meat seamlessly incorporated into a rich, heritage-inspired rice base.',
    price: 4000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Asun Rice.jpg',
    portion: 'full',
    tags: ['spicy', 'goat-meat'],
    available: true,
    whatsappLink: 'https://wa.me/p/33557577183888462/2349024084911'
  },
  {
    id: 'asun_rice_half',
    name: 'Asun Rice (Half)',
    description: 'A refined portion of our spicy peppered goat meat rice, perfect for a light yet bold meal.',
    price: 2000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Asun Rice.jpg',
    portion: 'half',
    tags: ['spicy', 'portion'],
    available: true
  },
  {
    id: 'caribbean_rice_full',
    name: 'Caribbean Rice',
    description: 'A vibrant and exotic rice blend featuring tropical flavors, heritage spices, and a hint of the islands.',
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
    description: 'A lighter portion of our vibrant Caribbean rice, packed with tropical essence.',
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
    description: 'Artisanal stir-fried rice inspired by oriental traditions, rich in umami and heritage seasoning.',
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
    description: 'A curated portion of our oriental-inspired stir-fried rice.',
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
    description: 'A bold, one-pot masterpiece packed with tender meats, fresh vegetables, and intense heritage spices.',
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
    description: 'A refined portion of our intense and bold Jambalaya rice.',
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
    description: 'Fragrant long-grain rice slow-cooked in rich, creamy coconut milk with traditional spices.',
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
    description: 'A delicate portion of our fragrant coconut milk-infused rice.',
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
    description: 'Classic savory fried rice tossed with fresh garden vegetables and aromatic heritage seasoning.',
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
    description: 'A perfectly sized portion of our classic savory fried rice.',
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
    description: 'Heartfelt traditional Jollof rice prepared with authentic home-style spices and love.',
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
    description: 'A nostalgic portion of our authentic home-style Jollof rice.',
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
    description: 'The legendary West African party favorite—premium rice cooked in a rich, intensely smokey tomato base.',
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
    description: 'A refined portion of our legendary smokey tomato-base Jollof rice.',
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
    description: 'Authentic celebratory-style Jollof rice with that unmistakable and beloved festive flavor.',
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
    description: 'A celebratory portion of our authentic party-style Jollof rice.',
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
    description: 'Traditional village-style rice prepared with pure palm oil, locust beans, and local heritage spices.',
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
    description: 'An authentic portion of our palm oil and locust bean-infused village rice.',
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
    description: 'Vibrant rice professionally stir-fried with fresh vegetables and heritage seasonings.',
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
    description: 'A vibrant portion of our vegetable-packed stir-fried rice.',
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
    name: 'White rice & beans',
    description: 'A balanced heritage classic combining fluffy steamed rice and slow-cooked honey beans.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Beans .jpeg',
    portion: 'full',
    tags: ['balanced', 'classic'],
    available: true
  },
  {
    id: 'rice_and_beans_half',
    name: 'White rice & beans (Half)',
    description: 'A balanced portion of our classic rice and slow-cooked honey beans.',
    price: 1500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Beans .jpeg',
    portion: 'half',
    tags: ['balanced', 'portion'],
    available: true
  },
  {
    id: 'white_rice_full_std',
    name: 'White Rice',
    description: 'Perfectly fluffy steamed white rice, serving as a clean canvas for our rich, flavorful sauces.',
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
    id: 'white_rice_half_std',
    name: 'White Rice (Half)',
    description: 'A simple and elegant portion of our fluffy steamed white rice.',
    price: 1000,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/white_rice.png',
    portion: 'half',
    tags: ['basic', 'portion'],
    available: true
  },
  {
    id: 'heritage_moi_moi_deluxe',
    name: 'Heritage Moi Moi Deluxe',
    description: 'Slow-steamed honey bean pudding enriched with wild-caught prawns, boiled eggs, and ancestral spices.',
    price: 3500,
    category: 'Heritage Collection',
    mealTime: ['Breakfast', 'Lunch'],
    image: '/images/1780956444283.jpeg',
    tags: ['luxury', 'traditional', 'protein'],
    available: true,
    isTrending: true
  },
  {
    id: 'basmati_white_rice_std',
    name: 'Basmati white rice',
    description: 'Premium long-grain fragrant basmati rice, steamed to perfection for a light and airy experience.',
    price: 2500,
    category: 'Rice Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Basmati white rice.webp',
    tags: ['premium', 'fragrant'],
    available: true
  },

  // ========================
  // 🍖 PROTEINS (Meat & Fish)
  // ========================
  {
    id: 'panla_fish_std',
    name: 'Panla Fish',
    description: 'Crispy fried Panla fish, seasoned with our secret heritage herb blend.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'crispy'],
    available: true
  },
  {
    id: 'full_panla_fish_std',
    name: 'Full Panla Fish',
    description: 'A complete, grand curation of our signature fried Panla fish.',
    price: 10000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'feast'],
    available: true
  },
  {
    id: 'turkey_std',
    name: 'Turkey',
    description: 'Succulent grilled turkey meat with a perfectly crispy, heritage-glazed skin.',
    price: 6000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Smoked Turkey Wings.jpg',
    tags: ['meat', 'grilled'],
    available: true,
    whatsappLink: 'https://wa.me/p/26387980920798908/2349024084911'
  },
  {
    id: 'big_turkey_std',
    name: 'Big Turkey',
    description: 'A majestic portion of our signature succulent grilled heritage turkey.',
    price: 7000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Smoked Turkey Wings.jpg',
    tags: ['meat', 'large'],
    available: true
  },
  {
    id: 'chicken_laps_std',
    name: 'Chicken Laps',
    description: 'Tender and juicy chicken laps, expertly seasoned and grilled to perfection.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1606728035253-49df8bbd6dee?auto=format&fit=crop&q=80&w=800',
    tags: ['chicken', 'tender'],
    available: true
  },
  {
    id: 'chicken_laps_large_std',
    name: 'Premium Chicken Laps',
    description: 'Large, premium chicken laps, seasoned with heritage spices and slow-grilled.',
    price: 6000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1606728035253-49df8bbd6dee?auto=format&fit=crop&q=80&w=800',
    tags: ['chicken', 'premium'],
    available: true
  },
  {
    id: 'croaker_fish_std',
    name: 'Croaker Fish',
    description: 'Freshly grilled or fried croaker fish infused with aromatic heritage herbs.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'grilled'],
    available: true
  },
  {
    id: 'tilapia_fish_std',
    name: 'Tilapia Fish',
    description: 'Artisanal Tilapia fish curation, seasoned with a blend of heritage spices.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'artisanal'],
    available: true
  },
  {
    id: 'asun_protein_std',
    name: 'Asun',
    description: 'Intensely spicy peppered goat meat chunks, authentic, bold, and unforgettable.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Asun.png',
    tags: ['meat', 'spicy'],
    available: true
  },
  {
    id: 'goat_meat_std',
    name: 'Goat Meat',
    description: 'Tender peppered goat meat chunks slow-cooked in a rich, dark heritage sauce.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/goat_meat.png',
    tags: ['meat', 'african'],
    available: true
  },
  {
    id: 'kote_fish_std',
    name: 'Kote Fish',
    description: 'Traditional fried Kote fish, well-seasoned for a deep, authentic flavor.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'traditional'],
    available: true
  },
  {
    id: 'titus_protein_std',
    name: 'Titus Fish',
    description: 'Succulent fried Titus fish, seasoned with a selection of heritage spices.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'fried'],
    available: true,
    whatsappLink: 'https://wa.me/p/26597784393157127/2349024084911'
  },
  {
    id: 'catfish_peppered_std',
    name: 'Catfish Peppered',
    description: 'Spicy, flame-inspired peppered catfish, a true heritage delicacy for the brave.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    tags: ['fish', 'spicy'],
    available: true
  },
  {
    id: 'snail_std',
    name: 'Snail',
    description: 'Large African peppered snails, finished with a glossy, aromatic heritage sauce coating.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/peppered_snail.jpg',
    tags: ['delicacy', 'spicy'],
    available: true
  },
  {
    id: 'crispy_chicken_std',
    name: 'Crispy Chicken',
    description: 'Golden fried chicken with a signature crunch that speaks of heritage and quality.',
    price: 5000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    tags: ['chicken', 'crispy'],
    available: true
  },
  {
    id: 'gizzard_std_protein',
    name: 'Gizzard',
    description: 'Spicy peppered gizzard, perfectly textured and seasoned for an ideal side or snack.',
    price: 2500,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/goat_meat.png',
    tags: ['gizzard', 'peppered'],
    available: true,
    whatsappLink: 'https://wa.me/p/25685241957750962/2349024084911'
  },
  {
    id: 'chicken_wings_std_protein',
    name: 'Chicken Wings',
    description: 'Crispy fried chicken wings tossed in a vibrant, spicy, and glossy pepper sauce.',
    price: 2000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_wings.jpg',
    tags: ['chicken', 'spicy'],
    available: true,
    whatsappLink: 'https://wa.me/p/25975139568840526/2349024084911'
  },
  {
    id: 'assorted_meat_std',
    name: 'Assorted Meat',
    description: 'A grand variety of peppered meats curated for the true heritage culinary enthusiast.',
    price: 4000,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Assorted Meat.png',
    tags: ['meat', 'assorted'],
    available: true
  },
  {
    id: 'beef_portion_std',
    name: 'Beef',
    description: 'Tender peppered beef chunks, slow-cooked to capture every ounce of heritage flavor.',
    price: 1500,
    category: 'Proteins',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/beaf.jpg',
    tags: ['beef', 'tender'],
    available: true
  },
  {
    id: 'boiled_egg_std_protein',
    name: 'Boiled Egg',
    description: 'A perfectly soft-boiled egg, an ideal protein addition to any heritage meal.',
    price: 500,
    category: 'Proteins',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/Boiled Eg.webp',
    tags: ['protein', 'basic'],
    available: true,
    whatsappLink: 'https://wa.me/p/25501974992817913/2349024084911'
  },

  // ========================
  // 🍝 PASTA & NOODLES
  // ========================
  {
    id: 'seafood_pasta_std',
    name: 'Seafood Pasta',
    description: 'Luxury pasta featuring fresh shrimp and mussels in a rich, creamy heritage-inspired sauce.',
    price: 14000,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/seafood_pasta.png',
    tags: ['luxury', 'seafood'],
    available: true
  },
  {
    id: 'stir_fried_pasta_std',
    name: 'Stir Fried Pasta',
    description: 'Savory stir-fried pasta tossed with crisp vegetables and aromatic heritage seasonings.',
    price: 3000,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=80&w=800',
    tags: ['savory', 'pasta'],
    available: true
  },
  {
    id: 'chicken_noodles_std',
    name: 'Chicken Noodles',
    description: 'Authentic stir-fried noodles paired with tender chicken and a glossy heritage sauce.',
    price: 6500,
    category: 'Pasta & Noodles',
    mealTime: ['Breakfast', 'Lunch'],
    image: '/images/meals/chicken_noodles.png',
    tags: ['quick', 'chicken'],
    available: true
  },
  {
    id: 'noodles_and_egg_std',
    name: 'Noodles & Egg Deluxe',
    description: 'A generous double portion of noodles paired with two perfectly cooked eggs.',
    price: 5000,
    category: 'Pasta & Noodles',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
    tags: ['filling', 'breakfast'],
    available: true
  },
  {
    id: 'shredded_beef_pasta_std',
    name: 'Shredded Beef Pasta',
    description: 'Elegant pasta tossed with tender shredded beef and a rich, savory heritage sauce.',
    price: 3500,
    category: 'Pasta & Noodles',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800',
    tags: ['beef', 'pasta'],
    available: true
  },
  {
    id: 'spaghetti_jollof_full_std',
    name: 'Spaghetti Jollof',
    description: 'Al dente spaghetti cooked in a rich, spicy, and aromatic tomato-based Jollof sauce.',
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
    id: 'spaghetti_jollof_half_std',
    name: 'Spaghetti Jollof (Half)',
    description: 'A refined portion of our rich and spicy tomato-based Jollof spaghetti.',
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
    id: 'burger_std',
    name: 'Heritage Chicken Burger',
    description: 'Premium chicken burger served with French-style fresh fries and our signature sauce.',
    price: 12000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/burger.png',
    tags: ['gourmet', 'chicken'],
    available: true
  },
  {
    id: 'big_chicken_chips_std',
    name: 'Big Chicken & Chips',
    description: 'A grand portion of crispy heritage fried chicken and golden potato chips.',
    price: 9000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Big Chicken & Chips.jpg',
    tags: ['large', 'chicken'],
    available: true
  },
  {
    id: 'small_chicken_chips_std',
    name: 'Small Chicken & Chips',
    description: 'A classic portion of our crispy heritage fried chicken and golden potato chips.',
    price: 8000,
    category: 'Snacks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Big Chicken & Chips.jpg',
    tags: ['standard', 'chicken'],
    available: true
  },
  {
    id: 'chicken_shawarma_std',
    name: 'Chicken Shawarma',
    description: 'Double-wrapped pita with spiced heritage chicken and our creamy garlic spread.',
    price: 6000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/chicken_shawarma.png',
    tags: ['popular', 'chicken'],
    available: true
  },
  {
    id: 'beef_shawarma_std',
    name: 'Beef Shawarma',
    description: 'Double-wrapped pita with spiced heritage beef and our signature creamy sauce.',
    price: 6000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/beefshawarma.jpg',
    tags: ['popular', 'beef'],
    available: true
  },
  {
    id: 'yamarita_std',
    name: 'Yamarita',
    description: 'Delicate egg-coated fried yam fingers, a local favorite reimagined with luxury.',
    price: 3000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1518013391915-e44359403fea?auto=format&fit=crop&q=80&w=800',
    tags: ['yam', 'traditional'],
    available: true
  },
  {
    id: 'yam_chips_std',
    name: 'Yam Chips',
    description: 'Perfectly crispy deep-fried yam slices, seasoned with heritage salt.',
    price: 3000,
    category: 'Snacks',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1518013391915-e44359403fea?auto=format&fit=crop&q=80&w=800',
    tags: ['yam', 'crispy'],
    available: true
  },
  {
    id: 'moi_moi_std',
    name: 'Moi Moi',
    description: 'Traditional steamed bean pudding enriched with our secret heritage filling.',
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
    id: 'peppersoup_catfish_yam_std',
    name: 'Peppersoup Catfish Yam',
    description: 'Spicy heritage catfish pepper soup paired with slow-cooked, tender yam cubes.',
    price: 6500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Dinner'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    tags: ['spicy', 'yam'],
    available: true
  },
  {
    id: 'plantain_egg_sauce_std',
    name: 'Plantain and Egg Sauce',
    description: 'Sweet fried plantain served with our savory, garden-fresh stir-fried egg sauce.',
    price: 5000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    tags: ['classic', 'breakfast'],
    available: true
  },
  {
    id: 'vegetable_boiled_plantain_std',
    name: 'Vegetable and Boiled Plantain',
    description: 'Nutritious boiled plantain served with our rich and healthy vegetable heritage sauce.',
    price: 5000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    tags: ['healthy', 'vegetable'],
    available: true
  },
  {
    id: 'yam_egg_sauce_std',
    name: 'Yam and Egg Sauce',
    description: 'Choice of boiled or fried yam served with our savory and rich egg sauce.',
    price: 4000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Breakfast', 'Lunch'],
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800',
    tags: ['classic', 'breakfast'],
    available: true,
    whatsappLink: 'https://wa.me/p/25838240129165540/2349024084911'
  },
  {
    id: 'ukwa_std_side',
    name: 'Breadfruit (Ukwa)',
    description: 'Premium heritage breadfruit curation, a traditional and refined Igbo delicacy.',
    price: 3000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    tags: ['ukwa', 'delicacy'],
    available: true
  },
  {
    id: 'ukwa_dry_fish_std',
    name: 'Dry Fish (Ukwa)',
    description: 'Premium heritage breadfruit curation paired with intensely flavorful dry fish.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    tags: ['ukwa', 'fish'],
    available: true
  },
  {
    id: 'yam_porridge_std',
    name: 'Yam Porridge',
    description: 'Slow-cooked heritage yam in a rich tomato and pure palm oil base.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    tags: ['yam', 'traditional'],
    available: true
  },
  {
    id: 'potato_porridge_std',
    name: 'Potato Porridge',
    description: 'Traditional heritage porridge made with tender, slow-cooked potatoes.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    tags: ['potato', 'traditional'],
    available: true
  },
  {
    id: 'plantain_porridge_std',
    name: 'Plantain Porridge',
    description: 'A sweet and savory plantain porridge curation, bursting with heritage flavors.',
    price: 1000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800',
    tags: ['plantain', 'sweet'],
    available: true
  },
  {
    id: 'beans_side_std',
    name: 'Heritage Beans',
    description: 'A delicate portion of our slow-cooked honey beans.',
    price: 1000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Beans .jpeg',
    tags: ['honey-beans', 'protein'],
    available: true
  },
  {
    id: 'ofada_sauce_side_std',
    name: 'Ofada Sauce',
    description: 'An extra portion of our legendary and intensely spicy Ofada heritage sauce.',
    price: 3000,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1599481238640-4c1288750d7a?auto=format&fit=crop&q=80&w=800',
    tags: ['sauce', 'spicy'],
    available: true
  },
  {
    id: 'curry_sauce_side_std',
    name: 'Curry Sauce',
    description: 'Rich, creamy, and aromatic heritage curry sauce, crafted to perfection.',
    price: 2500,
    category: 'Sides, Sauces & Porridge',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1455619411441-2a3a9275a21c?auto=format&fit=crop&q=80&w=800',
    tags: ['sauce', 'curry'],
    available: true
  },
  {
    id: 'plantain_side_std',
    name: 'Plantain',
    description: 'Sweet, golden-fried plantain portions, the perfect heritage accompaniment.',
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
    id: 'goat_meat_peppersoup_std',
    name: 'Goat Meat Pepper Soup',
    description: 'Intense and spicy goat meat soup infused with traditional heritage healing herbs.',
    price: 8000,
    category: 'African Dishes',
    mealTime: ['Dinner'],
    image: '/images/meals/goat_peppersoup.webp',
    tags: ['spicy', 'soup'],
    available: true,
    isTrending: true
  },
  {
    id: 'chicken_pepper_soup_std',
    name: 'Chicken Pepper Soup',
    description: 'A restorative and spicy chicken broth slow-cooked with heritage spices.',
    price: 8000,
    category: 'African Dishes',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/meals/chicken_peppersoup.jpg',
    tags: ['spicy', 'soup'],
    available: true
  },
  {
    id: 'turkey_pepper_soup_std',
    name: 'Turkey Pepper Soup',
    description: 'Rich turkey pepper soup with a bold broth and visible heritage spices.',
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
    id: 'red_wine_std',
    name: 'Premium Red Wine',
    description: 'A curated selection of premium red wine, perfect for pairing with heritage flavors.',
    price: 10000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    tags: ['luxury', 'wine'],
    available: true
  },
  {
    id: 'five_alive_std',
    name: '5Alive',
    description: 'Chilled 5Alive fruit juice, a refreshing blend of tropical fruits.',
    price: 2000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/5Alive.png',
    tags: ['juice', 'chilled'],
    available: true
  },
  {
    id: 'hollandia_std',
    name: 'Hollandia Yogurt',
    description: 'Creamy and refreshing Hollandia yogurt curation.',
    price: 3000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=800',
    tags: ['yogurt', 'chilled'],
    available: true
  },
  {
    id: 'chivita_std',
    name: 'Chivita Juice',
    description: 'Premium Chivita fruit juice, pure and refreshing.',
    price: 3000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800',
    tags: ['juice', 'premium'],
    available: true
  },
  {
    id: 'active_juice_std',
    name: 'Active Juice',
    description: 'Refreshing and revitalizing Active fruit juice.',
    price: 3000,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/Active Juice.png',
    tags: ['juice', 'active'],
    available: true
  },
  {
    id: 'amstel_malt_std',
    name: 'Amstel Malt',
    description: 'Premium Amstel Malt beverage, chilled and nourishing.',
    price: 1300,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Amstel Malt.png',
    tags: ['malt', 'premium'],
    available: true
  },
  {
    id: 'canned_fanta_std',
    name: 'Canned Fanta',
    description: 'Chilled Fanta in a sleek can, bursting with orange flavor.',
    price: 1200,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Fanta.jpg',
    tags: ['soft-drink', 'canned'],
    available: true
  },
  {
    id: 'malta_guinness_std',
    name: 'Malta Guinness',
    description: 'The legendary Malta Guinness beverage, a heritage favorite.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1600213959891-bd3d502ad7b4?auto=format&fit=crop&q=80&w=800',
    tags: ['malt', 'classic'],
    available: true
  },
  {
    id: 'maltina_std',
    name: 'Maltina',
    description: 'Smooth and classic Maltina beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1600213959891-bd3d502ad7b4?auto=format&fit=crop&q=80&w=800',
    tags: ['malt', 'smooth'],
    available: true
  },
  {
    id: 'nutri_milk_std',
    name: 'Nutri Milk',
    description: 'Nutritional milk beverage, a healthy choice for any time of day.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Breakfast'],
    image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=800',
    tags: ['milk', 'nutrition'],
    available: true
  },
  {
    id: 'active_zest_std',
    name: 'Active Zest',
    description: 'A zesty and refreshing citrus beverage.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/Active Zest.png',
    tags: ['zesty', 'refreshing'],
    available: true
  },
  {
    id: 'fearless_std',
    name: 'Fearless Energy',
    description: 'An energizing drink curation to keep you bold and active.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['energy', 'active'],
    available: true
  },
  {
    id: 'schweppes_std',
    name: 'Schweppes',
    description: 'Premium Schweppes beverage, ideal for a refined thirst.',
    price: 1000,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['tonic', 'premium'],
    available: true
  },
  {
    id: 'pepsi_std',
    name: 'Pepsi',
    description: 'Chilled Pepsi bottle, the classic refreshing soft drink.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['soft-drink', 'pepsi'],
    available: true
  },
  {
    id: 'coke_std',
    name: 'Coca-Cola',
    description: 'A chilled bottle of classic Coca-Cola, refreshing and timeless.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['soft', 'cold'],
    available: true
  },
  {
    id: 'seven_up_std',
    name: '7up',
    description: 'Chilled 7up, a crisp lemon-lime refreshment.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: '/images/7up.png',
    tags: ['soft-drink', 'lemon-lime'],
    available: true
  },
  {
    id: 'teem_std',
    name: 'Teem',
    description: 'Refreshing and zesty Teem beverage.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['soft-drink', 'teem'],
    available: true
  },
  {
    id: 'sprite_std',
    name: 'Sprite',
    description: 'Chilled Sprite, clear and refreshing lemon-lime flavor.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Lunch', 'Dinner'],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    tags: ['soft-drink', 'lemon-lime'],
    available: true
  },
  {
    id: 'fanta_std',
    name: 'Fanta',
    description: 'Chilled Fanta bottle, the vibrant orange soft drink.',
    price: 800,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/Fanta.jpg',
    tags: ['soft', 'orange'],
    available: true
  },
  {
    id: 'bottle_water_std',
    name: 'Premium Bottled Water',
    description: 'Pristine bottled water, providing pure and clean hydration.',
    price: 500,
    category: 'Drinks',
    mealTime: ['Breakfast', 'Lunch', 'Dinner'],
    image: '/images/meals/water.png',
    tags: ['basic', 'hydration'],
    available: true
  }
];
