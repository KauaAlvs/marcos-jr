import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import UserSidebar from "@/components/UserSidebar"; 
import CartSidebar from "@/components/CartSidebar"; // Importando o carrinho
import { UIProvider } from "@/context/UIContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "COPRÊ.",
  description: "Equipamentos premium de ciclismo inspirados no design clean da MAAP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-white text-gray-950`}>
        <UIProvider>
          <Header />
          <UserSidebar /> 
          <CartSidebar /> {/* Carrinho injetado no app */}
          {children}
        </UIProvider>
      </body>
    </html>
  );
}