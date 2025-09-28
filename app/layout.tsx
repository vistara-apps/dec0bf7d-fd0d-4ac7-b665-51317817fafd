import type { Metadata } from 'next';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoDiagnostics AI',
  description: 'AI-powered vehicle diagnostics, reporting, and service management for mechanics.',
  keywords: ['automotive', 'diagnostics', 'AI', 'mechanics', 'vehicle', 'repair'],
  authors: [{ name: 'AutoDiagnostics AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
