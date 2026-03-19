'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Tipagem rigorosa do Contexto
interface UIContextType {
  isUserSidebarOpen: boolean;
  openUserSidebar: () => void;
  closeUserSidebar: () => void;
  toggleUserSidebar: () => void;
  
  // Novos estados para o Carrinho
  isCartSidebarOpen: boolean;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false);

  // Funções do Usuário
  const openUserSidebar = () => {
    setIsUserSidebarOpen(true);
    setIsCartSidebarOpen(false); // Fecha o carrinho se estiver aberto
  };
  const closeUserSidebar = () => setIsUserSidebarOpen(false);
  const toggleUserSidebar = () => setIsUserSidebarOpen(prev => !prev);

  // Funções do Carrinho
  const openCartSidebar = () => {
    setIsCartSidebarOpen(true);
    setIsUserSidebarOpen(false); // Fecha o usuário se estiver aberto
  };
  const closeCartSidebar = () => setIsCartSidebarOpen(false);

  return (
    <UIContext.Provider value={{ 
      isUserSidebarOpen, openUserSidebar, closeUserSidebar, toggleUserSidebar,
      isCartSidebarOpen, openCartSidebar, closeCartSidebar
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI deve ser usado dentro de um UIProvider');
  }
  return context;
}