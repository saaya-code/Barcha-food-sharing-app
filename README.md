# 🍽️ Barcha - Community Food Sharing Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

> **Barcha** means "surplus" in Arabic - our mission is to transform surplus food into community connections.

A modern, responsive web application that connects people with surplus food to those who can use it, helping reduce food waste while strengthening communities across Tunisia and beyond.

## 🌟 Features

### 🏠 **Core Features**
- **Food Sharing**: Share surplus food with your community
- **Smart Browse**: Discover available food near you with advanced filtering
- **Real-time Requests**: Request food items and coordinate pickup directly
- **User Profiles**: Manage your donations and track community impact
- **Email Verification**: Secure authentication with custom email templates
- **Image Upload**: Upload food photos via Cloudinary integration
- **Responsive Design**: Beautiful UI that works on all devices

### 🔧 **Technical Features**
- **Development Mode**: Works offline with mock data when database isn't configured
- **Error Resilience**: Graceful fallbacks and comprehensive error handling
- **Row Level Security**: Secure database access with Supabase RLS policies
- **Performance Optimized**: Fast loading with Next.js 15 and Turbopack
- **Type Safe**: Full TypeScript implementation
- **Testing Ready**: Jest setup with testing utilities

## 🎯 Mission & Impact

Barcha aims to create a more sustainable Tunisia by:
- **Reducing Food Waste**: Connecting surplus food with people who need it
- **Building Community**: Strengthening bonds between neighbors
- **Environmental Impact**: Contributing to a more eco-conscious society
- **Food Security**: Helping ensure everyone has access to quality food

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional for development)
- Cloudinary account (optional for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/barcha.git
   cd barcha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   # Supabase Configuration (optional for development)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Cloudinary Configuration (optional)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration (for custom verification emails)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🗄️ Database Setup (Optional)

Barcha includes a **development mode** that works with mock data when no database is configured. For production:

1. **Create Supabase project** at [supabase.com](https://supabase.com)

2. **Run database setup**
   ```bash
   npm run setup-db
   ```

3. **Apply database schema**
   ```bash
   # The schema is in database/schema.sql
   # Run it in your Supabase SQL editor
   ```

## 📁 Project Structure

```
barcha/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── add-item/          # Add food item page
│   │   ├── browse/            # Browse food items
│   │   ├── profile/           # User profile management
│   │   ├── requests/          # Food request management
│   │   ├── login/             # Authentication
│   │   └── signup/            # User registration
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Base UI components
│   │   ├── FoodCard.tsx      # Food item display card
│   │   ├── Header.tsx        # Navigation header
│   │   └── SearchFilters.tsx # Search and filter functionality
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── lib/                  # Utility libraries
│   │   ├── supabase.ts       # Database operations
│   │   ├── cloudinary.ts     # Image upload handling
│   │   ├── email.ts          # Email functionality
│   │   ├── dev-config.ts     # Development mode configuration
│   │   └── mock-data.ts      # Mock data for development
│   └── types/                # TypeScript type definitions
├── database/                 # Database schema and migrations
├── email-templates/          # Custom email templates
├── scripts/                  # Setup and utility scripts
└── public/                  # Static assets
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface with gradient backgrounds
- **Mobile-First**: Responsive design that works perfectly on all devices
- **Accessibility**: WCAG compliant with proper contrast and keyboard navigation
- **Micro-Interactions**: Smooth animations and hover effects
- **Dark Mode Ready**: Architecture supports future dark mode implementation

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Email Verification**: Secure user registration process
- **Input Validation**: Client and server-side validation
- **Safe Image Uploads**: Secure image handling via Cloudinary
- **Privacy Controls**: Users control their contact information visibility

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Development Deployment
The app includes a development mode that works without external services:
- Mock authentication with test users
- Sample food data for demonstration
- Offline-first functionality

### Production Deployment

1. **Set up services**
   - Create Supabase project and configure database
   - Set up Cloudinary for image uploads
   - Configure SMTP for emails

2. **Deploy to Vercel** (recommended)
   ```bash
   npm run build
   # Deploy to your preferred platform
   ```

3. **Environment variables**
   Set all production environment variables in your deployment platform

## 🤖 AI Features Roadmap

### 🎯 **Phase 1: Smart Matching** (Coming Soon)
- **Intelligent Food Recommendations**: AI-powered suggestions based on user preferences, dietary restrictions, and past requests
- **Optimal Pickup Routes**: Smart routing algorithms to help users find the most efficient pickup locations
- **Expiry Prediction**: Machine learning to better predict food freshness and optimal sharing times

### 🎯 **Phase 2: Community Intelligence** (Future)
- **Demand Forecasting**: Predict food demand patterns in different areas to optimize sharing
- **Waste Pattern Analysis**: Identify food waste hotspots and suggest targeted sharing campaigns
- **Auto-Translation**: Real-time translation for Arabic/French/English to serve Tunisia's multilingual community

### 🎯 **Phase 3: Advanced Features** (Future)
- **Image Recognition**: Auto-categorize food items and detect freshness from uploaded photos
- **Nutritional Analysis**: AI-powered nutritional information and meal planning suggestions
- **Community Insights**: Data-driven insights on local food sharing patterns and environmental impact

### 🎯 **Phase 4: Integration & Automation** (Future)
- **Restaurant Integration**: API connections with POS systems for automatic surplus food listing
- **IoT Integration**: Smart refrigerator integration for automatic expiry tracking
- **Blockchain Tracking**: Transparent food journey tracking for enhanced trust and safety

## 🧪 Beta Testing Program

### 🎯 **Join Our Beta Community**

We're looking for passionate community members to help shape Barcha's future! Our beta testing program offers:

#### **What We're Testing**
- **Core Functionality**: Food sharing, request system, user profiles
- **Mobile Experience**: iOS/Android responsive performance
- **Community Features**: Communication tools, rating systems
- **AI Features**: Smart recommendations and matching algorithms (Phase 1)

#### **Beta Tester Benefits**
- 🎁 **Exclusive Access**: First access to new features
- 🏆 **Founder Status**: Special recognition in your profile
- 📊 **Direct Impact**: Your feedback directly shapes development
- 🎯 **Community Building**: Help establish the first food sharing communities

#### **How to Join**

1. **Sign up for beta**: [barcha-beta@example.com](mailto:barcha-beta@example.com)
2. **Provide your info**:
   - Location in Tunisia (or international)
   - Type of tester (donor, requester, or both)
   - Device types you'll test on
   - Availability for feedback sessions

3. **Get started**:
   - Receive beta access credentials
   - Join our Discord community
   - Attend optional onboarding session

#### **Testing Focus Areas**

**Week 1-2: Core Functionality**
- User registration and profile setup
- Food item posting and browsing
- Request and communication system

**Week 3-4: User Experience**
- Mobile app performance
- Photo upload and quality
- Search and filter accuracy

**Week 5-6: Community Features**
- User interactions and trust building
- Pickup coordination tools
- Safety and reporting features

**Week 7-8: AI Features (Phase 1)**
- Smart food recommendations
- Location-based matching
- Expiry time optimization

#### **Feedback Methods**
- **Weekly Surveys**: Quick 5-minute feedback forms
- **Focus Groups**: Monthly 1-hour video sessions
- **Bug Reports**: In-app reporting system
- **Feature Requests**: Dedicated feedback channel

#### **Beta Testing Rewards**
- **Community Champion**: Top contributors get special badges
- **Feature Naming**: Help name new features
- **Beta Graduation**: First 100 beta testers get lifetime premium features
- **Local Recognition**: Featured in community success stories

### 📊 **Success Metrics We're Tracking**

- **User Engagement**: Daily/weekly active users
- **Food Items Shared**: Number and variety of items posted
- **Successful Connections**: Completed food transfers
- **Community Growth**: User acquisition and retention
- **Environmental Impact**: Estimated food waste reduction
- **User Satisfaction**: NPS scores and feedback quality

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run setup-db     # Set up database schema
npm run test-db      # Test database connection
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- **TypeScript**: All new code must be TypeScript
- **ESLint**: Follow the configured ESLint rules
- **Testing**: Add tests for new features
- **Accessibility**: Maintain WCAG 2.1 AA compliance
- **Performance**: Keep bundle size and loading times optimal

## 🌍 Community & Support

### Get Involved
- **Discord**: [Join our community](https://discord.gg/barcha) (coming soon)
- **Issues**: [Report bugs or request features](https://github.com/yourusername/barcha/issues)
- **Discussions**: [Community discussions](https://github.com/yourusername/barcha/discussions)

### Community Guidelines
- **Respect**: Treat all community members with respect
- **Safety**: Prioritize food safety and personal safety
- **Honesty**: Be truthful about food condition and availability
- **Responsibility**: Follow through on commitments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Vercel** for hosting and deployment
- **Cloudinary** for image management
- **The open source community** for the incredible tools and libraries
- **Tunisia's food sharing pioneers** who inspired this project

## 📞 Contact & Support

- **Email**: boualimohamed74@gmail.com
- **GitHub**: [saaya-code](https://github.com/saaya-code)

<div align="center">

**Made with ❤️ for the community**

*Together, we can reduce food waste and build stronger communities.*

[⭐ Star this repo](https://github.com/saaya-code/Barcha-food-sharing-app) | [🐛 Report Bug](https://github.com/saaya-code/Barcha-food-sharing-app/issues) | [💡 Request Feature](https://github.com/saaya-code/Barcha-food-sharing-app/issues)

</div>
