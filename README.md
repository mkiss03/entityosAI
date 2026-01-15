# EntityOS - Knowledge Graph Optimization (GEO) Platform

The world's first Knowledge Graph Optimization (GEO) platform. Build entity authority, reduce hallucinations, and win citations inside AI answers.

## 📁 Project Structure

```
entityosAI/
├── src/
│   ├── components/
│   │   └── ui/                      # Reusable UI components
│   │       ├── AmbientNeon.jsx
│   │       ├── AnimatedMeshGradient.jsx
│   │       ├── Badge.jsx
│   │       ├── GlassCard.jsx
│   │       ├── NeonDivider.jsx
│   │       ├── NeonHoverCard.jsx
│   │       ├── NetworkHeroArt.jsx
│   │       ├── PageTransition.jsx
│   │       ├── ParticleNetwork.jsx
│   │       ├── Reveal.jsx
│   │       └── index.js
│   ├── constants/
│   │   └── index.js                 # Application constants (NAV, MOCK, KIND_BADGES)
│   ├── pages/
│   │   ├── Index.jsx                # Landing page
│   │   ├── Dashboard.jsx            # Main dashboard with D3 force graph
│   │   └── index.js
│   ├── utils/
│   │   └── helpers.js               # Utility functions (cn, useInterval, formatPct)
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles with Tailwind
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

### Development

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

### Build

3. **Build for production:**
   ```bash
   npm run build
   ```
   The built files will be in the `dist/` directory.

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **D3.js** - Data visualization and force-directed graphs
- **Lucide React** - Icon library

## 📄 Pages

### Landing Page (`/`)
- Hero section with particle network animation
- Features showcase
- Pricing plans
- SEO comparison section

### Dashboard (`/dashboard`)
- Interactive D3 force-directed graph
- Entity relationship visualization
- Real-time RAG simulation
- Terminal-style activity logs
- Entity focus panel

## 🎨 Components

### UI Components (`src/components/ui/`)
- **AmbientNeon** - Background gradient effects
- **AnimatedMeshGradient** - Animated mesh background
- **Badge** - Entity type badges
- **GlassCard** - Glass morphism card container
- **NeonDivider** - Neon-styled divider
- **NeonHoverCard** - Interactive card with glow effects
- **NetworkHeroArt** - Hero section SVG network visualization
- **PageTransition** - Page transition wrapper
- **ParticleNetwork** - Canvas-based particle animation
- **Reveal** - Scroll-based reveal animation

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Features

- **Production-ready architecture** - Clean separation of concerns
- **Component-based structure** - Reusable UI components
- **Modern routing** - React Router v6 with page transitions
- **Responsive design** - Mobile-first approach with Tailwind CSS
- **Interactive visualizations** - D3.js force-directed graphs
- **Optimized performance** - Vite for fast builds and HMR

## 📦 Refactoring Summary

The monolith file has been successfully refactored into a production-ready structure:

1. ✅ **Extracted UI Components** - 10 reusable components in `src/components/ui/`
2. ✅ **Separated Pages** - Landing page and Dashboard in `src/pages/`
3. ✅ **Utility Functions** - Helper functions in `src/utils/helpers.js`
4. ✅ **Constants** - Application constants in `src/constants/`
5. ✅ **Routing** - React Router DOM setup in `App.jsx`
6. ✅ **Configuration** - Vite, Tailwind, and PostCSS configs
7. ✅ **Build Setup** - Complete Vite + React + Tailwind stack

## 🔧 Development Notes

- All dependencies are installed and ready
- ESLint is configured for code quality
- Tailwind CSS is set up with custom color palette
- D3.js is integrated for graph visualizations
- Source maps enabled for debugging

## 📄 License

Private - All rights reserved

## 👨‍💻 Author

EntityOS Team
