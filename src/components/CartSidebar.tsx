'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUI } from '@/context/UIContext'; 

export default function CartSidebar() {
  const { isCartSidebarOpen, closeCartSidebar } = useUI(); 

  // Fecha a sidebar ao apertar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCartSidebar();
    };
    if (isCartSidebarOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isCartSidebarOpen, closeCartSidebar]);

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sidebarVariants: Variants = {
    hidden: { x: '100%' },
    visible: { x: '0%', transition: { type: 'spring', stiffness: 300, damping: 30 } }, 
    exit: { x: '100%', transition: { ease: 'easeInOut', duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isCartSidebarOpen && (
        <>
          {/* Fundo Desfocado */}
          <motion.div
            key="backdrop-cart"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeCartSidebar} 
          />

          {/* Sidebar do Carrinho */}
          <motion.div
            key="sidebar-cart"
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col overflow-hidden border-l border-gray-100"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header do Carrinho */}
            <div className="flex items-center justify-between p-6 sm:px-10 sm:py-8 border-b border-gray-100">
              <span className="text-xl font-light tracking-widest text-gray-950 uppercase">
                Seu Carrinho
              </span>
              <button 
                onClick={closeCartSidebar}
                className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
                aria-label="Fechar Carrinho"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Corpo do Carrinho (Vazio por enquanto) */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:px-10 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-300" strokeWidth={1} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-950 mb-3">
                Seu carrinho está vazio
              </h3>
              <p className="text-xs text-gray-500 font-light max-w-[250px] leading-relaxed mb-8">
                Parece que você ainda não adicionou nenhum equipamento de alta performance ao seu carrinho.
              </p>
              <button 
                onClick={closeCartSidebar}
                className="flex items-center justify-center py-4 px-8 border border-transparent text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors group"
              >
                Continuar Comprando
                <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}