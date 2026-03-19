import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageTransition } from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export function Layout({ children, hideHeader = false, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
