import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Nav from "./components/nav/nav";
import Footer from "./components/footer/footer";
import Providers from "./providers";


export const metadata: Metadata = {
  title: 'shed',
  description: 'a chosen-family resource sharing platform',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const betaUnlocked = cookies().get('shed_access')?.value === 'granted';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Nav betaUnlocked={betaUnlocked} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
