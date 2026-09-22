# R.D TEXTILE - Ripan Saree Center

<div align="center">
  <img src="public/logo.png" width="140" height="140" alt="R.D Textile Logo" style="border-radius: 50%;" />
  <h3>Luxury Handloom Boutique & E-Commerce Web App (PWA)</h3>
  <p>Authentic Handloom Sarees, Silk & Luxury Collections</p>
</div>

---

## 📱 Features

- **PWA (Progressive Web App)**: Installable directly onto Android, iOS, Windows, and Mac devices without going through app stores.
- **Offline Readiness**: Service Worker precaching of branding, circular RD logo, and core application shell.
- **Product Catalog**: Filter by categories (Silk, Cotton, Wedding, Party Wear), real-time search, price ranges, and video showcase.
- **Order Tracking**: Visual status tracker (Processing, Shipped, Delivered) in user profile.
- **Admin Dashboard**: Product management, inventory controls, order updates, customer reviews, and customizable store settings.
- **Firebase Firestore & Auth**: Secure database persistence for items, cart, wishlist, orders, and authentication.

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

### 4. Build for Production
```bash
npm run build
```
The compiled, optimized production files will be output to the `dist/` directory.

---

## 📲 How to Install / Download the App

### On Android (Chrome / Edge / Samsung Internet):
1. Open the deployed website link.
2. Tap the **"Download App"** button in the top navigation bar or tap the **"Install"** banner on the home page.
3. Or tap the three vertical dots (`⋮`) in your browser and select **"Install app"** or **"Add to Home screen"**.
4. The circular **R.D TEXTILE** icon will appear on your phone's home screen and app drawer.

### On iPhone / iPad (Safari):
1. Open the website in **Safari**.
2. Tap the **Share** button (box with an upward arrow at the bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top-right corner.

### On Desktop (Chrome / Edge):
1. Look for the install icon in the address bar (or click the **Download App** button).
2. Click **Install** to run R.D Textile as a standalone desktop window.

---

## 🌐 Deploying to GitHub Pages, Vercel, or Netlify

- **Vercel**: Import your GitHub repository, choose framework preset **Vite**, and click Deploy.
- **Netlify**: Connect your repository, set build command to `npm run build` and publish directory to `dist`.
- **GitHub Pages**: Build the project with `npm run build` and deploy the `dist/` folder via GitHub Actions.
