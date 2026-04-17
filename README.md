# 🍲 Bamanda Heritage Restaurant

Welcome to the **Bamanda Heritage Restaurant** digital experience. This is a modern, responsive web application designed to showcase the rich culinary heritage of Bamanda, offering a seamless blend of traditional African delicacies and premium intercontinental dishes.

## ✨ Features

- **Gourmet Menu:** Explore a diverse range of categories from Rice Dishes and Proteins to Pasta, Snacks, and traditional African Soups.
- **Dynamic Cart System:** Easily add, adjust, and manage your selected meals with a sleek, real-time cart drawer.
- **Premium Checkout Experience:** A structured and intuitive checkout flow for a frictionless ordering process.
- **Interactive UI:** Powered by Framer Motion (Motion) for smooth transitions and high-end visual feedback.
- **Kitchen & Admin Views:** Dedicated screens for order management and kitchen operations.
- **Visual Richness:** Optimized local assets for all signature dishes including Ofada Sauce, Smokey Jollof, and Peppered Snail.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Motion](https://motion.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lukewealth/bamandakitchen.git
   cd bamandakitchen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file based on `.env.example` if you need to use AI-powered features:
   ```bash
   cp .env.example .env
   ```
   Set your `GEMINI_API_KEY` in the `.env` file.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📁 Project Structure

- `src/components/`: Reusable UI components like `MenuCard`, `CartDrawer`, `Header`, and `Footer`.
- `src/screens/`: Main page views including `HomeScreen`, `MenuScreen`, `CheckoutScreen`, and `KitchenScreen`.
- `src/data.ts`: Centralized menu item data and configurations.
- `public/images/meals/`: Optimized local assets for menu items.
- `stitch_bamanda_luxury_digital_experience/`: Design artifacts and PRD documents.

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

---

*Experience the luxury of Bamanda Heritage Restaurant.*
