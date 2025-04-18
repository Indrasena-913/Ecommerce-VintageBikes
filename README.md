# 🚲 VintageBikes - E-Commerce Platform

A modern, full-stack e-commerce platform for vintage bike enthusiasts. Featuring a seamless UI, real-time features, secure authentication, and full Stripe payment integration.

Live Site: [vbikeindra.netlify.app](https://vbikeindra.netlify.app/)  
Backend: [backend-vintagebikes.onrender.com](https://backend-vintagebikes.onrender.com)

---

## 📦 Features

### 🔐 Authentication & Security
- **User Registration & Login** (JWT-based)
- **Email Verification** after sign-up
- **Secure Password Reset Flow** (via email token)
- **Protected Routes** for authenticated access

### 🛒 E-Commerce Core
- **Product Catalog** with details: name, year, description, image, category, reviews
- **Filtering & Search** (by category, model year, price)
- **Pagination & Reset Filters**
- **Wishlist** and **Cart** Management with Redux + DB sync
- **Real-Time Count Badges** (Cart, Wishlist)
- **Stripe Payments** and Order Checkout Flow
- **Order History & Status Tracking**

### 🎨 UI & UX
- Fully **Responsive** and **Mobile-Friendly**
- **Tailwind CSS** styled design
- **Lazy Loading** for images
- **Skeleton Screens** during data fetching

---

## 🖼️ Screens & Features

- **Login / Signup / Forgot / Reset Password**  
- **Product Listing** with filters, search, pagination  
- **Product Detail View** with add to cart & wishlist  
- **Cart & Wishlist** pages (edit, remove, persist state)  
- **Checkout Page** with Stripe payment integration  
- **Order History Page** with tracking and status  

---

## ⚙️ Tech Stack

### 🧠 Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Modern UI)
- **Redux Toolkit** (State Management)
- **React Router DOM** (Routing)
- **React Hook Form** (Forms)
- **Axios** (API calls)
- **LocalStorage** (JWT Handling)

### 🧰 Backend
- **Node.js + Express.js**
- **Prisma ORM** (PostgreSQL)
- **JWT** (Authentication)
- **Nodemailer** (Email Service)
- **Crypto, Bcrypt** (Security)
- **RESTful APIs**

### 🗄️ Database
- **PostgreSQL** on Render
- **Database Tables**:
  - `Users`
  - `Products`
  - `Categories`
  - `Wishlist`
  - `Cart`
  - `Orders`
  - `Order_Items`
  - `Payments`

---

## 📡 API Overview

### 🔐 Auth Endpoints
- `POST /register` – Register new user  
- `POST /login` – Login and get token  
- `GET /verify-email?token=` – Email verification  
- `POST /forgot-password` – Send reset link  
- `POST /reset-password/:token` – Reset password

### 🛍️ Product Endpoints
- `GET /products` – Get all products  
- `GET /products/:id` – Get single product  
- `GET /categories` – Get all categories

### ❤️ Wishlist
- `POST /wishlist` – Add/remove item  
- `GET /wishlist/:id` – Get user's wishlist  
- `DELETE /wishlist/:id` – Remove item

### 🛒 Cart
- `POST /cart` – Add item  
- `GET /cart` – Fetch cart  
- `PATCH /cart/:id` – Update quantity  
- `DELETE /cart/:id` – Remove item  
- `DELETE /cart` – Clear cart

### 📦 Orders & Payments
- `GET /myorders/:userId` – Get user's orders  
- `POST /checkout` – Create Stripe intent  
- `POST /confirm-payment` – Confirm payment

---

## ☁️ Deployment

### 🔗 Frontend (Netlify)
- URL: [vbikeindra.netlify.app](https://vbikeindra.netlify.app/)
- Build: `npm run build`

### 🔗 Backend (Render)
- URL: [backend-vintagebikes.onrender.com](https://backend-vintagebikes.onrender.com)
- Auto-deployed from GitHub
- Environment Variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `EMAIL_SERVICE_CONFIG`
  - `STRIPE_SECRET_KEY`
  - `FRONTEND_URL`

### 🛢️ PostgreSQL (Render DB)
- Hosted on Render Cloud PostgreSQL
- SSL-secured connection
- Auto backups enabled

---

## 🗺️ Database Schema Diagram

(You can use tools like [dbdiagram.io](https://dbdiagram.io/) or Prisma's `erd` generator.)

---

## 🧑‍💻 Developer

Built with ❤️ by **[S INDRASENA]**  
Open to feedback, improvements, and collaboration!

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---
# 🧱 Getting Started

## 🚀 Frontend Setup

1. **Clone the repository & navigate**

```bash
git clone https://github.com/yourusername/vintagebikes.git
cd vintagebikes/frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**  
   Create a `.env` file in `frontend/` with:

```
BASE_API_URL=http://localhost:3000
```

4. **Run development server**

```bash
npm run dev
```

## 🔧 Backend Setup

1. **Navigate to backend**

```bash
cd ../backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**  
   Create a `.env` file in `backend/` with:

```
DATABASE_URL=postgresql://your-postgres-url
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
STRIPE_SECRET_KEY=your-stripe-secret
```

4. **Generate Prisma client**

```bash
npx prisma generate
```

5. **Apply database migrations**

```bash
npx prisma migrate deploy
```

6. **Start the backend server**

```bash
npm start
```

✅ Your backend will run on http://localhost:3000  
✅ Your frontend will run on http://localhost:5173
