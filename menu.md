# Bamanda Kitchen Menu  
## Eating Well. Living Healthy.

---

## 🍛 Rice Dishes
- Ofada Sauce & Rice — ₦6,000  
- Chicken Biryani Rice — ₦5,000  
- Smokey Jollof — ₦2,500  
- White Rice — ₦2,000  

---

## 🍖 Proteins
- Turkey — ₦6,000  
- Goat Meat — ₦4,000  
- Snail — ₦4,000  

---

## 🍝 Pasta & Noodles
- Seafood Pasta — ₦14,000  
- Spaghetti Jollof — ₦2,500  

---

## 🌯 Snacks
- Chicken Shawarma — ₦6,000  
- Moi Moi — ₦1,000  

---

## 🥤 Drinks
- Coke — ₦800  
- Bottle Water — ₦500  

const url = `https://wa.me/234XXXXXXXXXX?text=${message}`;
window.open(url, "_blank");

Rice Dishes

Ofada Sauce & Rice - 6,000
Chicken Biryani Rice - 5,000
Chicken Biryani Rice half portion - 2,500
Asun Rice - 4,000
Asun Rice half portion - 2,000
Caribbean Rice - 4,000
Caribbean Rice half portion - 2,000
Chinese Rice - 4,000
Chinese Rice half portion - 2,000
Jambalaya Rice - 4,000
Jambalaya Rice half portion - 2,000
Coconut Rice - 3,500
Coconut Rice half portion - 1,800
Fried Rice - 3,500
Fried Rice half portion - 1,800
Home made Jollof - 2,500
Home made Jollof half portion - 1,300
Smokey Jollof - 2,500
Smokey Jollof half portion - 1,300
Party Jollof - 2,500
Party Jollof half portion - 1,300
Native Rice - 3,000
Native Rice half portion - 1,500
Stir Fried Rice - 3,000
Stir Fried Rice half portion - 1,500
Rice and Beans - 2,500
Rice and Beans half portion - 1,500
White Rice - 2,000
White Rice half portion - 1,000

Proteins (Meat & Fish)

panla Fish - 4,000 
Full panla Fish - 10,000
Turkey - 6,000
Big Turkey - 7,000
Chicken laps - 4,000 
Chicken Laps - 6,000
Croaker Fish - 5,000
Tilapia Fish - 5,000
Asun - 5,000
Goat Meat 4,000
Kote Fish - 4,000
Titus - 4,000
Catfish Peppered - 4,000
Snail - 4,000
Crispy Chicken - 5,000
Goat Meat - 4,000
Gizzard - 2,500
Chicken Wings - 2,000
Assorted Meat - 4,000
Beef - 1,500
Boiled Egg - 500

Pasta & Noodle’s

Seafood Pasta - 14,000
Stir Fried Pasta - 3,000
Chicken Noodles - 6,500
Noodles & Egg (2 noodles & 2 eggs) - 5,000
Shredded Beef Pasta - 3,500
Spaghetti Jollof - 2,500
Spaghetti Jollof half portion - 1,300

Snacks

Burger (French Fresh & Classic Chicken) - 12,000
Big Chicken & Chips - 9,000
Small Chicken & Chips - 8,000
Chicken Shawarma - 6,000
Beef Shawarma - 6,000
Yamarita - 3,000
Yam Chips - 3,000
Moi Moi - 1,000

Sides, Sauces & Porridge

Peppersoup Catfish Yam - 6,500
Plantain and Egg Sauce - 5,000
Vegetable and Boiled Plantain - 5,000
Yam and Egg Sauce - 4,000
Breadfruit (Ukwa) - 3,000
Dry Fish (Ukwa) - 2,500
Yam Porridge - 2,500
Potato Porridge - 2,500
Plantain Porridge - 1,000
Beans - 1,000
Ofada Sauce - 3,000
Curry Sauce - 2,500

Drinks

Red Wine - 10,000
5Alive - 2,000
Hollandia - 3,000 
Chivita - 3,000
Active Juice - 3,000
Amstel Malt - 1,300
Canned Fanta - 1,200
Malta Guinness - 1,000
Maltina - 1,000
Nutri Milk - 1,000
Active Zest - 1,000
Fearless 1,000
Schweppes - 1,000
Pepsi - 800
Coke  - 800
7up - 800
Teem  - 800
Sprite - 800
Fanta - 800
Bottle Water - 500 

Write with image references and Naira price with a Menu.json and menu.md Agent insytructions alongside the current dishies with async and metadatas across app search quary and input for checkout processing 

const url = `https://wa.me/234XXXXXXXXXX?text=${message}`;
window.open(url, "_blank");

async function fetchMenu() {
  const res = await fetch('/menu.json');
  return await res.json();
}
User → Search → Select Item → Add to Cart →
Cart State → Generate Metadata → Checkout → WhatsApp