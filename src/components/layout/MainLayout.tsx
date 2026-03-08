import { ReactNode, useRef } from 'react';
import Footer from './Footer';
import { Navbar } from '../common/Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const topRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <div ref={topRef} className="absolute top-0 h-20 w-full pointer-events-none" />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;