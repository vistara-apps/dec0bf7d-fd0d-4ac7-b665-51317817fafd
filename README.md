# AutoDiagnostics AI

AI-powered vehicle diagnostics, reporting, and service management for mechanics and engineers.

## Features

- **AI Fault Detection**: Upload diagnostic data (video, audio, text, OBD-II) and leverage AI to automatically identify potential vehicle faults
- **Predictive Maintenance Insights**: Utilize historical and real-time data to forecast potential future failures
- **Automated Reporting & Estimates**: Generate professional repair documentation and cost projections
- **Integrated Service History**: Maintain centralized digital records of all vehicle maintenance and repairs
- **Customer & Fleet Sharing**: Securely share diagnostic findings and reports

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **React**: React 19 (required for OnchainKit compatibility)
- **Blockchain**: Base integration with OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety throughout
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── AppShell.tsx    # Main app layout with navigation
│   ├── MetricCard.tsx  # Dashboard metric display
│   ├── DiagnosticCard.tsx # Diagnostic session card
│   ├── MediaUploader.tsx  # File upload component
│   └── ThemeProvider.tsx  # Theme management
├── theme-preview/      # Theme preview page
├── globals.css         # Global styles and theme variables
├── layout.tsx          # Root layout
├── page.tsx           # Dashboard page
├── providers.tsx      # OnchainKit provider setup
├── loading.tsx        # Loading UI
└── error.tsx          # Error boundary

lib/
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
└── mockData.ts        # Mock data for development

```

## Theme System

The app supports multiple blockchain themes:

- **Default**: Automotive professional theme with dark teal background and coral accents
- **Celo**: Black background with yellow accents
- **Solana**: Dark purple with magenta accents
- **Base**: Dark blue with Base blue accents
- **Coinbase**: Dark navy with Coinbase blue accents

Themes can be switched via URL parameter: `?theme=celo` or through the theme preview page.

## Key Components

### AppShell
Main application layout with responsive sidebar navigation and wallet integration.

### MetricCard
Displays key performance metrics with trend indicators and icons.

### DiagnosticCard
Shows diagnostic session information with AI analysis results and status.

### MediaUploader
Drag-and-drop file upload component supporting video, audio, and OBD-II data.

## Data Models

### Vehicle
- vehicleId, make, model, year, vin
- owner, mileage, lastService

### Diagnostic
- diagnosticId, vehicleId, timestamp
- dataType (video, audio, text, obd2)
- aiAnalysis, detectedFaults, estimatedCost
- status, confidence, recommendations

### ServiceRecord
- recordId, vehicleId, date, description
- partsUsed, laborCost, totalCost
- mechanicId, mechanicName, status

## Base Mini App Integration

This app is built as a Base Mini App with:
- OnchainKit provider for Base blockchain integration
- Wallet connection and identity components
- Frame-ready architecture for Base ecosystem

## Development

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: Built-in with TypeScript

## License

Private - AutoDiagnostics AI Team
