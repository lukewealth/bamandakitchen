```markdown
# Design System Document: High-End Editorial

## 1. Overview & Creative North Star
### The Creative North Star: "The Ancestral Gallery"
This design system rejects the clinical, "boxed-in" nature of standard web templates. Instead, it draws inspiration from the curated space of a high-end art gallery and the rhythmic, organic textures of modern African architecture. We are not building a website; we are curating a digital sanctuary that balances the heavy, grounded permanence of dark forest greens and wood textures with the ethereal lightness of glass and cream.

**The Signature Aesthetic:**
To achieve a premium, custom feel, we prioritize **Intentional Asymmetry**. Break the traditional 12-column rigid alignment by allowing high-quality imagery of ingredients or interiors to bleed off-canvas or overlap across different surface tiers. Use the typography scale to create a rhythmic "visual pulse"—large, authoritative serif headlines paired with wide-tracked, minimalist sans-serif labels.

---

## 2. Colors & Tonal Depth
The palette is a sophisticated interplay between the earthy and the royal. We use color not just for decoration, but to define the physical environment of the UI.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections. High-end design is felt through tonal shifts, not outlines. Boundaries must be defined solely by background color transitions. For example, a `surface-container-low` section should sit directly against a `surface` background to create a subtle, sophisticated change in "light."

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass or fine wood veneer.
*   **Base:** `surface` (#fcf9f4) acts as the primary gallery wall.
*   **The Layering Stack:** Use `surface-container-low` (#f6f3ee) for large secondary sections and `surface-container-lowest` (#ffffff) for floating cards to create a natural, soft "lift."
*   **The Depth Play:** To define importance, nest a `surface-container-highest` (#e5e2dd) element within a `surface-container` (#f0ede9) base.

### The "Glass & Wood" Rule
To bridge the gap between "Modern" and "Luxury," use **Glassmorphism** for floating UI elements like navigation bars or reservation overlays. 
*   **Token Usage:** Use `surface-variant` (#e5e2dd) at 60% opacity with a `24px` backdrop-blur. 
*   **Signature Textures:** Apply a subtle grain or wood-texture overlay (set to 'Multiply' or 'Overlay' at 5% opacity) specifically to the `primary-container` (#0f3d2e) and `tertiary-container` (#48301d) areas to evoke the tactile feel of the restaurant's interior.

---

## 3. Typography
The typography system is built on the tension between the heritage-rich **Noto Serif** and the contemporary, geometric **Manrope**.

*   **Display (Noto Serif):** These are the "Hero" moments. Use `display-lg` for impactful menu categories or philosophical brand statements. Tighten the letter-spacing (-2%) to make it feel editorial.
*   **Headlines (Noto Serif):** Used for storytelling and section titles. They should feel authoritative and grounded.
*   **Body (Manrope):** The workhorse. Always use `body-lg` or `body-md` for descriptions. Ensure a line height of at least 1.6 to maintain the "Art Gallery" breathability.
*   **Labels (Manrope):** Use these for "Metadata" (e.g., prices, calorie counts, or tags). Set these in All Caps with a `0.1rem` letter-spacing to distinguish them from body copy.

---

## 4. Elevation & Depth
We move away from the "drop shadow" era into an era of **Ambient Light**.

*   **Tonal Layering:** Depth is primarily achieved by "stacking" the `surface-container` tiers. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "paper-on-table" lift.
*   **Ambient Shadows:** If an element must float (like a modal), use a shadow with a 40px blur and only 4% opacity, using the `on-surface` (#1c1c19) color. It should feel like a soft glow of shadow, not a dark stain.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline-variant` (#c0c8c3) token at **15% opacity**. A 100% opaque border is a failure of the design language.
*   **Glassmorphism Integration:** Use semi-transparent surface colors to let the underlying wood textures or rich forest greens bleed through, softening the layout’s edges.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#00261a) with `on-primary` (#ffffff) text. Use the `md` (0.375rem) roundedness for a slightly softened architectural feel.
*   **Secondary (The Gold Standard):** A "Ghost" style button using a `secondary` (#755b00) text color and a subtle 10% opacity `secondary-container` background.
*   **Tertiary:** Text-only, using `secondary` for the font color with a `label-md` uppercase style.

### Cards & Menu Items
**Strict Rule:** No divider lines between menu items. 
*   Use `surface-container-low` for the card background. 
*   Use vertical white space (32px or 48px from the spacing scale) to separate items. 
*   Title: `title-lg` (Manrope); Price: `label-md` (Manrope, Gold).

### Inputs & Selection
*   **Input Fields:** Use a `surface-container-highest` background. No border. Use a 2px `secondary` (#755b00) bottom-only highlight when focused.
*   **Chips:** Use `tertiary-fixed` (#ffdcc4) with `on-tertiary-fixed` (#2b1706) for a warm, organic selection feel.

### Additional Signature Component: "The Gallery Scroller"
Horizontal scrolling sections for signature dishes should use high-contrast imagery where the image container uses `xl` (0.75rem) roundedness on one corner only (top-left) to mimic custom artisan framing.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme white space. If you think there is enough room between sections, double it.
*   **Do** use `secondary_container` (#fdd670) sparingly as a "highlight" for call-to-actions or special offers to draw the eye like a spotlight on a painting.
*   **Do** ensure all images have a consistent "warm" temperature to align with the Wood and Cream tones.

### Don't:
*   **Don't** use 100% black (#000000). Use `primary` (#00261a) for deep shadows and `on-background` (#1c1c19) for text.
*   **Don't** use standard "hover" states like bright blue. Hover states should be subtle transitions in opacity or a shift from `surface-container` to `surface-container-high`.
*   **Don't** use centered text for long paragraphs. Keep it left-aligned to maintain the editorial, "Art Catalog" structure.

---
*Note: This system is designed to evolve. When in doubt, prioritize the feeling of "Weight" and "Light"—the heavy green of the forest versus the translucent glow of the glass.*```