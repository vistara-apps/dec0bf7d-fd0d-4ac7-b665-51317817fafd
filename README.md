# AutoDiagnostics AI - Base Mini App

A production-ready Next.js application for AI-powered vehicle diagnostics, reporting, and service management integrated with Base Wallet MiniApps.

## 🚀 Features

### Core Functionality
- **AI Fault Detection**: Upload diagnostic data (video, audio, text, OBD-II) and leverage AI to automatically identify potential vehicle faults
- **Predictive Maintenance Insights**: Utilize historical and real-time data to forecast potential future failures
- **Automated Reporting & Estimates**: Generate professional repair documentation and cost projections directly from diagnostic data
- **Integrated Service History**: Maintain a centralized, digital record of all vehicle maintenance and repairs
- **Customer & Fleet Sharing**: Securely share diagnostic findings, reports, and service history with customers and fleet managers

### Technical Features
- **Base Mini App Integration**: Full integration with Base Wallet for seamless user experience
- **Real-time AI Processing**: Advanced AI analysis with confidence scoring
- **Cloud Storage**: Secure file storage with IPFS integration
- **Caching System**: Optimized performance with intelligent caching
- **Responsive Design**: Mobile-first design with dark mode support
- **Production Ready**: Error handling, loading states, and security measures

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **State Management**: React Query for server state
- **Database**: In-memory database (replace with PostgreSQL/MySQL in production)
- **Storage**: IPFS for file storage (configurable)
- **AI Integration**: OpenAI API for diagnostics
- **Authentication**: Base Wallet integration
- **Caching**: Custom Redis-like caching system

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── ai/                # AI processing endpoints
│   │   ├── diagnostics/       # Diagnostic management
│   │   ├── reports/           # Report generation
│   │   ├── share/             # Sharing functionality
│   │   ├── upload/            # File upload handling
│   │   ├── vehicles/          # Vehicle management
│   │   └── frame/             # Base Mini App integration
│   ├── auth/                  # Authentication pages
│   ├── components/            # Reusable components
│   ├── vehicles/              # Vehicle-specific pages
│   ├── share/                 # Shared report pages
│   ├── error.tsx             # Error boundary
│   ├── loading.tsx           # Loading UI
│   └── page.tsx              # Main dashboard
├── lib/
│   ├── ai-service.ts         # AI processing logic
│   ├── auth.ts               # Authentication utilities
│   ├── base-integration.ts   # Base Mini App integration
│   ├── cache.ts              # Caching system
│   ├── database.ts           # Database operations
│   ├── predictive-analytics.ts # Predictive maintenance
│   ├── report-generator.ts   # Report generation
│   ├── sharing.ts            # Sharing functionality
│   ├── storage.ts            # File storage
│   ├── subscription.ts       # Subscription management
│   ├── types.ts              # TypeScript definitions
│   └── utils.ts              # Utility functions
├── middleware.ts             # Next.js middleware
├── tailwind.config.js        # Tailwind configuration
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Base Wallet account (for Mini App testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/dec0bf7d-fd0d-4ac7-b665-51317817fafd.git
   cd dec0bf7d-fd0d-4ac7-b665-51317817fafd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   # Base Mini App Configuration
   NEXT_PUBLIC_BASE_APP_ID=your-base-app-id
   NEXT_PUBLIC_BASE_API_URL=https://api.base.org

   # AI Service Configuration
   OPENAI_API_KEY=your-openai-api-key

   # Storage Configuration (IPFS)
   IPFS_PROJECT_ID=your-ipfs-project-id
   IPFS_PROJECT_SECRET=your-ipfs-project-secret

   # Database (for production)
   DATABASE_URL=your-database-url

   # Caching (Redis for production)
   REDIS_URL=your-redis-url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Design System
The app uses a custom design system with the following tokens:

```typescript
// Colors
--bg: hsl(215, 30%, 98%)        // Background
--accent: hsl(160, 80%, 40%)    // Accent color
--primary: hsl(210, 80%, 50%)   // Primary color
--surface: hsl(0,0%,100%)       // Surface color
--text-primary: hsl(210, 30%, 10%)   // Primary text
--text-secondary: hsl(210, 30%, 30%) // Secondary text

// Spacing
--sm: 8px
--md: 16px
--lg: 24px
--xl: 32px

// Border Radius
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
```

### API Endpoints

#### Diagnostics
- `POST /api/diagnostics` - Create new diagnostic
- `GET /api/diagnostics` - List diagnostics
- `GET /api/diagnostics/[id]` - Get diagnostic details
- `PUT /api/diagnostics/[id]` - Update diagnostic

#### AI Processing
- `POST /api/ai/analyze` - Process diagnostic data with AI

#### Reports
- `POST /api/reports/generate` - Generate repair reports
- `GET /api/reports/generate` - Generate service history reports

#### Sharing
- `POST /api/share/create` - Create shareable links
- `GET /api/share/[token]` - Access shared reports

#### File Upload
- `POST /api/upload` - Upload diagnostic files

## 🔐 Authentication

The app integrates with Base Wallet for authentication. Users connect their wallets to access the Mini App functionality.

### Demo Credentials
For testing purposes, use:
- Email: `alex@autodiagnostics.ai`
- Password: `password`

## 📊 Business Model

### Subscription Tiers
- **Basic**: $20/month - Core diagnostic features
- **Professional**: $50/month - Advanced AI + Fleet management
- **Enterprise**: $150/month - Unlimited usage + API access

### Revenue Streams
- Monthly subscriptions
- Micro-transactions for premium reports
- Tokenized access to advanced AI features

## 🚀 Deployment

### Production Checklist
- [ ] Configure production database
- [ ] Set up Redis for caching
- [ ] Configure IPFS storage
- [ ] Set up monitoring and logging
- [ ] Configure CI/CD pipeline
- [ ] Set up error tracking
- [ ] Configure backup systems

### Environment Variables
Ensure all production environment variables are set:
- Database connection strings
- API keys (encrypted)
- Storage credentials
- Monitoring service keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Updates

### Version 1.0.0
- Initial release with core diagnostic functionality
- Base Mini App integration
- AI-powered fault detection
- Report generation and sharing
- Service history management

---

Built with ❤️ for the Base ecosystem

