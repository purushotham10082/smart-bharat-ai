import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LanguageProvider } from "@/context/lang-context";
import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Smart Bharat – AI Powered Civic Companion",
  description: "Your intelligent AI companion for Government Services, Issue Reporting, and Personalized Civic Support in India.",
  keywords: ["Smart Bharat", "Digital India", "AI Grievance Redressal", "Government Schemes", "Passport", "Aadhaar", "India Civic Portals"],
  manifest: "/manifest.json",
  icons: {
    icon: "/emblem.svg",
    apple: "/emblem.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
