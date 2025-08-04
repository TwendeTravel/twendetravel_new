# 🌍 Twende Travel - Seamless Travel Experiences

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://twendetravel-new.vercel.app/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

Transform your journeys into effortless, meaningful experiences through personalized planning, local expertise, and technology-enhanced convenience.

## ✨ Features

### 🎯 Core Functionality
- **🏠 Dashboard**: Comprehensive travel management hub with recent activity
- **👤 Profile Management**: Full user profile with Firebase Storage integration
- **🗺️ Interactive Maps**: MapLibre-powered destination exploration
- **✈️ Trip Planning**: AI-assisted itinerary creation and management
- **💬 Real-time Chat**: Firebase-powered messaging system
- **🎫 Booking Management**: Flight, hotel, and experience bookings
- **📱 PWA Support**: Install as mobile app with offline capabilities

### 🎨 User Experience
- **🌟 Modern UI**: Beautiful interface with travel-themed doodles
- **🎭 Animations**: Smooth Framer Motion transitions
- **🌙 Theme Support**: Light/dark mode toggle
- **📱 Responsive**: Works seamlessly on all devices
- **🔄 Real-time Updates**: Live data synchronization

### 🔐 Security & Authentication
- **🔒 Firebase Auth**: Secure user authentication
- **👥 Role-based Access**: Admin and user permissions
- **🛡️ Protected Routes**: Route guards for secure navigation
- **🔐 Password Management**: Secure password updates

## 🚀 Tech Stack

### Frontend
- **⚛️ React 18** - Modern React with hooks and concurrent features
- **📘 TypeScript** - Type-safe development
- **⚡ Vite** - Lightning-fast build tool and dev server
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🧩 Shadcn/ui** - Beautiful, accessible UI components
- **🎭 Framer Motion** - Smooth animations and transitions

### Backend & Services
- **🔥 Firebase Authentication** - User management and security
- **🗄️ Firestore Database** - Real-time NoSQL database
- **💾 Firebase Storage** - File and image storage
- **☁️ Firebase Functions** - Serverless backend logic
- **🌐 Vercel** - Deployment and hosting platform

### Development Tools
- **📦 npm** - Package management
- **🔧 ESLint** - Code linting and quality
- **🎯 TypeScript** - Static type checking
- **🔄 Hot Reload** - Development efficiency

## 🛠️ Installation & Setup

### Prerequisites
```bash
Node.js 18+ and npm
Firebase CLI (optional)
```

### 1. Clone Repository
```bash
git clone https://github.com/TwendeTravel/twendetravel_new.git
cd twendetravel_new
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env.local` file:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Development Settings
VITE_USE_FIREBASE_EMULATOR=false
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:8080` to see the application.

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `twendetravel-b4821`
3. Enable Authentication, Firestore, and Storage

### 2. Configure Authentication
- Enable Email/Password authentication
- Add authorized domains for production

### 3. Set up Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Configure Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{imageId} {
      allow read: if true;
      allow write, delete: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🌐 Deployment

### Vercel Deployment
1. **Connect Repository**
   - Import project to Vercel
   - Connect your GitHub repository

2. **Configure Environment Variables**
   - Add all `VITE_*` variables from `.env.local`
   - Set `VITE_USE_FIREBASE_EMULATOR=false`

3. **Deploy**
   ```bash
   # Automatic deployment on git push
   git push origin main
   ```

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── chat/           # Chat system components
│   └── admin/          # Admin panel components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   ├── utils.ts        # General utilities
│   └── firestore-service.ts # Firestore operations
├── pages/              # Main application pages
├── routes/             # Routing configuration
├── services/           # External service integrations
└── utils/              # Helper functions
```

## 🎨 Key Components

### Dashboard Features
- **Recent Activity Feed** - Latest user actions and updates
- **Quick Actions** - Fast access to common tasks
- **Trip Overview** - Current and upcoming travel plans
- **Weather Integration** - Destination weather information

### Profile Management
- **Profile Picture Upload** - Firebase Storage integration
- **Personal Information** - Comprehensive user details
- **Security Settings** - Password management and 2FA
- **Preferences** - Personalized travel settings

### Admin Features
- **User Management** - Admin user controls
- **Analytics Dashboard** - Travel statistics and insights
- **Content Management** - Destinations and experiences
- **System Monitoring** - Application health and performance

## 🔧 Configuration Files

- **`vite.config.ts`** - Vite build configuration with PWA support
- **`tailwind.config.cjs`** - Tailwind CSS customization
- **`firebase.json`** - Firebase project configuration
- **`vercel.json`** - Vercel deployment settings
- **`tsconfig.json`** - TypeScript configuration

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase project configuration
- Ensure authorized domains include your deployment URL

#### CORS Errors with Firebase Storage
```bash
# Apply CORS configuration
gsutil cors set cors.json gs://your-storage-bucket.appspot.com
```

### Development Tips
- Use browser dev tools for debugging
- Check Firebase Console for backend issues
- Monitor Vercel deployment logs for production issues

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Test thoroughly before submitting PR

## 📄 License

This project is proprietary software owned by Twende Travel. All rights reserved.

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ User authentication and profiles
- ✅ Basic trip planning
- ✅ Dashboard and admin features
- ✅ Firebase integration
- ✅ PWA support

### Upcoming Features (v1.1)
- 🔄 Enhanced AI trip planning
- 🔄 Real-time chat improvements
- 🔄 Advanced booking system
- 🔄 Mobile app version
- 🔄 Offline map support

### Future Vision (v2.0)
- 🎯 Multi-language support
- 🎯 Advanced analytics
- 🎯 Third-party integrations
- 🎯 Social features
- 🎯 Enterprise solutions

## 📞 Support

- **Website**: [https://twendetravel-new.vercel.app/](https://twendetravel-new.vercel.app/)
- **Documentation**: Available in `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/TwendeTravel/twendetravel_new/issues)
- **Email**: support@twendetravel.com

---

**Built with ❤️ by the Twende Travel Team**

*Transform your journeys into effortless, meaningful experiences.*