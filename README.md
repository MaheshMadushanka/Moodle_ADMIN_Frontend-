# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 📱 Mobile Responsive Dashboard

### ✅ Features
- **Fully Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Touch-Friendly**: All buttons and controls sized for easy mobile interaction (44px minimum)
- **Smart Layouts**: Adaptive views (table ↔ cards, sidebar ↔ tabs)
- **Dark Mode Support**: Maintained across all responsive breakpoints
- **Optimized Performance**: No unnecessary horizontal scrolling

### 📊 Responsive Pages
1. **Lecturer Management** - Desktop table switches to mobile cards
2. **Course Management** - Responsive grid (1→2→3-4 columns)
3. **Settings Dashboard** - Adaptive sidebar/tab navigation
4. **Reports & Analytics** - Responsive charts and data visualization

### 🎯 Responsive Breakpoints
- **Mobile**: < 640px (phones)
- **Tablet**: 640px - 1024px (tablets, small laptops)  
- **Desktop**: > 1024px (desktops and larger)

### 📖 Documentation
- See `MOBILE_RESPONSIVE_COMPLETE.md` for overview
- See `MOBILE_RESPONSIVE_UPDATES.md` for technical details
- See `MOBILE_TESTING_GUIDE.md` for testing checklist
