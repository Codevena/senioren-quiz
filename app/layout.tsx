import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Senior Quiz - Barrierefreies Deutschland-Quiz',
  description: 'Ein barrierefreies Allgemeinwissen-Quiz für Senior*innen',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}

