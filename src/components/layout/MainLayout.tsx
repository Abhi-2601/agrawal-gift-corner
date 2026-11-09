import type { ReactNode } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";

export interface MainLayoutProps {
  children: ReactNode;
  showAnnouncement?: boolean;
  announcementMessage?: string;
}

export default function MainLayout({ children, showAnnouncement = true, announcementMessage }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory selection:bg-champagne-gold/30">
      {showAnnouncement && <AnnouncementBar message={announcementMessage} />}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
