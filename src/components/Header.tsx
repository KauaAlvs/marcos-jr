'use client'; 

import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';
import { useUI } from '@/context/UIContext'; 

export default function Header() {
  const { openUserSidebar, openCartSidebar } = useUI(); // Pegando as duas funções

  return (
    <header className="fixed top-0 w-full z-[80] bg-white/80 backdrop-blur-md border-b border-gray-100 transition-colors duration-300">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Esquerda - Navegação */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/masculino" className="text-[11px] font-bold uppercase tracking-widest text-gray-950 hover:text-gray-500 transition-colors">
              MASCULINO
            </Link>
            <Link href="/feminino" className="text-[11px] font-bold uppercase tracking-widest text-gray-950 hover:text-gray-500 transition-colors">
              FEMININO
            </Link>
            <Link href="/acessorios" className="text-[11px] font-bold uppercase tracking-widest text-gray-950 hover:text-gray-500 transition-colors">
              ACESSÓRIOS
            </Link>
          </nav>

          {/* Centro - Logo */}
          <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-950">
              MARCOS<span className="font-light">.JR</span>
            </Link>
          </div>

          {/* Direita - Ícones de Ação */}
          <div className="flex items-center space-x-6 relative z-10">
            <button className="text-gray-950 hover:text-gray-500 transition-colors">
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            <button 
              onClick={openUserSidebar} 
              className="text-gray-950 hover:text-gray-500 transition-colors"
              aria-label="Abrir Perfil"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
            </button>
            
            {/* CORREÇÃO: Ícone do Carrinho agora abre o CartSidebar */}
            <button 
              onClick={openCartSidebar}
              className="text-gray-950 hover:text-gray-500 transition-colors relative"
              aria-label="Abrir Carrinho"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}