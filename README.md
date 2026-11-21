# Memory-Game

Interactive two-player memory card game built with **TypeScript**, **SCSS (7-1 Architecture)**, and **Vite**.

## Features & Extras

- **Customizable Game Settings:**
  - Choose starting player (**Blue** or **Orange**)
  - Select board size (**4x4 / 16 Cards**, **4x6 / 24 Cards**, or **6x6 / 36 Cards**)
  - Switch between **3 complete visual themes** (*Code Vibes*, *DA Projects*, *Foods*) with live preview on hover
- **Interactive Gameplay:**
  - Smooth 3D card flip animations
  - Live score tracking and active turn indicator
  - Confirmation modal before exiting a running match
- **Game Over & Winner Flow:**
  - Two-stage end screen showing final scores followed by an automatic winner/draw announcement
- **Responsive Design:**
  - Optimized layout adjustments for desktop, tablet, and smaller viewports

## Tech Stack

- **TypeScript** (strictly typed, modular structure with TSDoc comments)
- **SCSS** (organized in the 7-1 pattern with centralized variables and theme overrides)
- **HTML5**
- **Vite** (bundling & build tool)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start local development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```
