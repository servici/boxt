import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'DramaBox — Stream Binge-Worthy Short Drama Series',
  description: 'Watch addictive, fast-paced vertical 9:16 short drama series anytime, anywhere. Discover CEO romance, martial arts revenge, and urban thrillers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0E] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-[#FF2A55] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
