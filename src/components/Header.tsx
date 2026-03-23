'use client'; 

import Link from 'next/link';
import { ShoppingCart, User, Search } from 'lucide-react';
import { useUI } from '@/context/UIContext'; 

// ==========================================
// LOGO COPRÊ (Mesmo componente da Home para consistência)
// ==========================================
const CopreLogo = ({ className = "text-2xl" }: { className?: string }) => (
  <span className={`tracking-tighter text-gray-950 flex items-center ${className} font-sans`}>
    <span className="font-extrabold tracking-[-0.05em]">CO</span>
    <span className="font-light italic ml-[2px] tracking-normal">PÊ.</span>
  </span>
);

export default function Header() {
  const { openUserSidebar, openCartSidebar } = useUI(); // Pegando as duas funções

  return (
    <header className="fixed top-0 w-full z-[80] bg-white/90 backdrop-blur-md border-b border-gray-100 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex justify-between items-center h-20">
          
          {/* Esquerda - Navegação (Tipografia refinada) */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/masculino" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors">
              MASCULINO
            </Link>
            <Link href="/feminino" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors">
              FEMININO
            </Link>
            <Link href="/acessorios" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-gray-500 transition-colors">
              ACESSÓRIOS
            </Link>
          </nav>

          {/* Centro - Logo da Marca */}
          <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <CopreLogo />
            </Link>
          </div>

          {/* Direita - Ícones de Ação (Respiro ajustado) */}
          <div className="flex items-center space-x-7 relative z-10">
            <button className="text-gray-950 hover:text-gray-500 transition-colors" aria-label="Buscar">
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            
            <button 
              onClick={openUserSidebar} 
              className="text-gray-950 hover:text-gray-500 transition-colors"
              aria-label="Abrir Perfil"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
            
            {/* Ícone do Carrinho abrindo a CartSidebar */}
            <button 
              onClick={openCartSidebar}
              className="text-gray-950 hover:text-gray-500 transition-colors relative"
              aria-label="Abrir Carrinho"
            >
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2.5 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}