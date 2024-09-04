import './globals.css';
import type { Metadata } from 'next';
import Nav from "./components/nav/nav";


export const metadata: Metadata = {
  title: 'shed',
  description: 'a chosen-family resource sharing platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
