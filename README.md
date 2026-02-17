# 💰 FinTrack: Your Premium Personal Finance Companion

[![Made with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Powered by Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![Styled with CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/TR/CSS/)

**FinTrack** is a modern, high-performance personal finance tracker designed to provide absolute clarity over your monthly spending. Inspired by premium fintech apps like Toshl, it combines real-time data synchronization with advanced visualizations to help you master your money.

---

## ✨ Key Features

### 📊 Professional Dashboard
- **Financial Overview**: Instant visibility into your Total Balance, Monthly Income, and Monthly Expenses.
- **Toshl-Inspired Budgeting**: A dedicated "Left to Spend" indicator with real-time progress tracking against your monthly limit.
- **Smart Insights**: Interactive Hero section providing personalized category breakdown at a glance.

### 🌎 Global Market Feed
- **Dedicated Market Page**: Live tracking of global currency rates (USD, EUR, GBP, JPY) relative to the **Indian Rupee (INR)**.
- **Personalized Valuation**: Automatically calculates your total portfolio value in multiple global currencies.
- **Base Currency Selection**: Instantly switch base currencies to see the market from any perspective.

### 📈 Advanced Visualizations
- **Cash Flow Analysis**: Smooth Area charts tracking your income vs. expense trends over time.
- **Category Breakdown**: Premium doughnut charts showing exactly where your money goes.

### 🛠️ Core Functionality
- **Transaction Management**: Effortlessly add, edit (in-place), or delete transactions with real-time Firebase sync.
- **Glassmorphism UI**: A stunning, modern design with subtle micro-animations and hover effects.
- **Themes**: Full support for both **Light** and **Dark** modes to suit your preference.

---

## 🚀 Tech Stack

- **Frontend**: React 18 (Vite) + TypeScript
- **Backend/Database**: Firebase Firestore (Real-time sync)
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **Icons**: Lucide-React
- **Charts**: Recharts
- **Routing**: React Router v6

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sanmaaya/Finance-Tracker.git
   cd Finance-Tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

---

## 📱 Mobile Preview
FinTrack is fully responsive. Whether you're on a desktop or a smartphone, your financial data is always accessible and beautifully formatted.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

---

*Designed with ❤️ for better financial health.*
