# 💰 SpendWise - Smart Expense Tracker

A full-stack expense tracking application with shared wallet functionality, budget management, and detailed analytics. Built with React Native (Expo) and Node.js.

## 📹 Demo

[🎥 Watch Demo Video](https://drive.google.com/file/d/13D2hyJYGJkURtl6dAwIOpUaUEhrFWDeZ/view)


---

## 🚀 Features

- **User Authentication** - Secure registration and login with JWT
- **Personal Wallets** - Track individual expenses across multiple wallets
- **Shared Wallets** - Split bills with roommates, friends, or groups
- **Budget Management** - Set monthly budgets and track spending by category
- **Analytics & Charts** - Visualize spending patterns with detailed insights
- **Multi-Currency Support** - Support for USD, EUR, GBP, INR, JPY, AUD, CAD
- **Expense Categories** - Organize expenses by food, transport, shopping, bills, etc.
- **Real-time Balance Tracking** - See who owes what in shared wallets
- **Dark/Light Themes** - Multiple theme options for personalization

---

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native 0.81** - Cross-platform mobile framework
- **Expo ~54.0** - Development platform and tooling
- **React Navigation 7** - Navigation library (Stack & Bottom Tabs)
- **Axios 1.13** - HTTP client for API calls
- **AsyncStorage 2.2** - Local data persistence
- **Expo Linear Gradient** - Gradient UI components
- **React Native Gesture Handler** - Touch gesture handling
- **React Native Chart Kit** - Data visualization
- **React Native SVG** - SVG rendering support

### Backend (API)
- **Node.js** - JavaScript runtime
- **Express.js 4.18** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 8.0** - MongoDB object modeling
- **JWT 9.0** - JSON Web Tokens for authentication
- **bcryptjs 2.4** - Password hashing
- **dotenv 16.3** - Environment variable management
- **CORS 2.8** - Cross-origin resource sharing
- **Nodemon 3.0** - Development auto-reload

---

## 📐 Architecture

```
spendwise/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   │   ├── User.js        # User schema
│   │   ├── Wallet.js      # Wallet schema
│   │   ├── Expense.js     # Expense schema
│   │   └── Budget.js      # Budget schema
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── .env               # Environment variables
│
└── mobile/                 # React Native/Expo app
    ├── src/
    │   ├── api/           # API client configuration
    │   ├── components/    # Reusable UI components
    │   ├── context/       # React Context (Auth, Theme)
    │   ├── hooks/         # Custom React hooks
    │   ├── navigation/    # Navigation configuration
    │   ├── screens/       # App screens
    │   └── utils/         # Helper functions
    ├── assets/            # Images and icons
    ├── App.js            # Root component
    └── package.json      # Dependencies
```

### Data Flow

```
User Interface (React Native)
        ↓
Context Providers (Auth, Theme)
        ↓
API Client (Axios)
        ↓
Express Routes
        ↓
Middleware (Auth)
        ↓
Controllers
        ↓
Mongoose Models
        ↓
MongoDB Database
```

---

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (for mobile development)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/spendwise
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   ```

   For MongoDB Atlas (cloud):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendwise
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint**
   
   Update `mobile/src/api/client.js` with your backend URL:
   ```javascript
   const API_URL = 'http://localhost:5000/api';  // For local development
   // or
   const API_URL = 'https://your-backend-url.com/api';  // For production
   ```

4. **Start the Expo development server**
   ```bash
   npm start
   ```
   
   Or use specific platform commands:
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web Browser
   ```

5. **Run on your device**
   - **iOS Simulator**: Press `i` in terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in terminal or run `npm run android`
   - **Physical Device**: Scan QR code with Expo Go app
   - **Web Browser**: Press `w` in terminal or run `npm run web`

---

## 📱 Usage Guide

### Getting Started

1. **Register an Account**
   - Open the app and tap "Sign Up"
   - Enter your name, email, and password
   - Choose your preferred currency

2. **Create a Wallet**
   - Tap the "+" button on the Wallets screen
   - Choose between Personal or Shared wallet
   - For shared wallets, add members by email

3. **Add Expenses**
   - Select a wallet
   - Tap "Add Expense"
   - Enter amount, category, description, and payment method
   - For shared wallets, expenses are automatically split

4. **Set Budgets**
   - Go to Budget screen
   - Tap edit icon
   - Set monthly budget and category limits
   - Track your spending progress

5. **View Analytics**
   - Check Charts screen for spending insights
   - Compare month-over-month trends
   - View category breakdowns

### Shared Wallet Features

- **Balance Tracking**: See who paid what and who owes whom
- **Split Bills**: Expenses are automatically split equally among members
- **Settlement**: Track settled and unsettled amounts
- **Member Management**: Add or remove members anytime

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Wallets
- `GET /api/wallets` - Get all user wallets
- `POST /api/wallets` - Create new wallet
- `GET /api/wallets/:id` - Get wallet details with balances
- `PUT /api/wallets/:id` - Update wallet
- `DELETE /api/wallets/:id` - Delete wallet
- `POST /api/wallets/:id/members` - Add member to shared wallet
- `DELETE /api/wallets/:id/members/:userId` - Remove member

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense details
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `GET /api/budgets` - Get user budget
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets/status` - Get budget status and progress

### Analytics
- `GET /api/analytics/summary` - Get spending summary
- `GET /api/analytics/trends` - Get spending trends
- `GET /api/analytics/categories` - Get category breakdown

---

## 🎨 Themes

SpendWise includes 4 beautiful themes:

- **Ocean Blue** - Calming blue gradients
- **Sunset Orange** - Warm orange tones
- **Forest Green** - Natural green palette
- **Purple Dream** - Vibrant purple shades

Change themes from the Profile screen.

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd mobile
npm test
```

---

## 📦 Building for Production

### Backend Deployment

1. **Set production environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   ```

2. **Deploy to your preferred platform**
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway
   - Render

### Mobile App Build

**iOS Build:**
```bash
cd mobile
eas build --platform ios
```

**Android Build:**
```bash
cd mobile
eas build --platform android
```

**Web Build:**
```bash
cd mobile
expo build:web
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@looper12349](https://github.com/looper12349)
- Email: amriteshindal29@gmail.com

---

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- MongoDB for the flexible database solution
- React Native community for excellent libraries and support

---

**Made with ❤️ using React Native and Node.js**
