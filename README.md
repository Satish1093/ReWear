# 👗 ReWear – Sustainable Fashion Exchange Platform

ReWear is a community-driven platform where users can **sell, buy, and exchange** pre-loved fashion items such as clothes, accessories, and shoes.  
It promotes sustainability by encouraging reuse and reducing waste, while giving users a smooth and secure marketplace experience.

---

## 🚀 Features

### 🔐 Authentication
- Register & Login (JWT Authentication)
- Secure password hashing (bcrypt)
- User dashboard
- Admin role support

### 🧑‍💼 Admin Panel
- View pending items
- Approve or reject user-submitted items
- Fully protected admin-only access

### 🛍️ Item Management
- Add items with image, category, condition, description
- Items go through "pending → approved" stages
- Edit or delete own items
- Items displayed only after admin approval

### ❤️ Wishlist System
- Add/remove items to/from wishlist
- Wishlist stored in MongoDB
- Fully populated item details in wishlist

### 🛒 Buy / Sell Flow
- Users can purchase approved items
- Sold items automatically disappear from public listings
- Track buyer with `soldTo` field
- Separate dashboards for bought and sold items

### 📸 Image Upload Support
- Image upload using Multer
- Static image serving from backend `/uploads`

---

## 🏗️ Tech Stack

### 🔧 Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer for image uploads
- JWT for authentication

### 🎨 Frontend
- React.js
- Axios / Fetch API
- React Router
- Bootstrap UI framework

---

## 📁 Folder Structure


