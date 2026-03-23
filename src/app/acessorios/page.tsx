'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Instagram, Youtube, Twitter } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

const CopreLogo = ({ className = "text-3xl" }: { className?: string }) => (
  <span className={`tracking-tighter text-gray-950 flex items-center ${className} font-sans`}>
    <span className="font-extrabold tracking-[-0.05em]">CO</span>
    <span className="font-light italic ml-[2px] tracking-normal">PRÊ.</span>
  </span>
);

const PremiumProductCard = ({ product }: { product: any }) => (
  <div className="group flex flex-col w-full snap-start flex-shrink-0">
    <Link href={`/produto/${product.slug}`} className="relative bg-[#F3F3F3] aspect-[2/3] overflow-hidden mb-5 flex items-center justify-center cursor-pointer">
      {product.isNew && (
        <div className="absolute top-4 left-4 z-30 bg-white text-black text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 shadow-sm">
          NOVO
        </div>
      )}
      {product.images && product.images.length > 0 && (
         <img src={product.images[0]} alt="Frente" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-opacity duration-700 ease-in-out opacity-100 group-hover:opacity-0 z-10 pointer-events-none" />
      )}
      {product.images && product.images.length > 1 && (
         <img src={product.images[1]} alt="Costas" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-all duration-1000 ease-out opacity-0 group-hover:opacity-100 z-20 group-hover:scale-105 pointer-events-none" />
      )}
      <div 
        className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 flex items-center justify-between p-4 z-30 border-t border-gray-100"
        onClick={(e) => e.preventDefault()} 
      >
        <span className="text-[9px] font-bold text-gray-950 uppercase tracking-[0.2em]">Ver Detalhes</span>
      </div>
    </Link>
    <div className="flex flex-col px-1">
      <div className="flex justify-between items-start mb-2">
        <Link href={`/produto/${product.slug}`} className="text-sm font-bold text-gray-950 tracking-tight hover:text-gray-500 transition-colors uppercase pr-2 cursor-pointer leading-tight">
          {product.name}
        </Link>
        <p className="text-xs text-gray-950 font-bold whitespace-nowrap">R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}</p>
      </div>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        {product.gender} // {product.category}
      </span>
    </div>
  </div>
);

// ==========================================
// PÁGINA ACESSÓRIOS
// ==========================================

export default function AcessoriosPage() {
  const [productsDatabase, setProductsDatabase] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // BUSCA NO SUPABASE (Filtro por Acessórios)
  // ==========================================
  useEffect(() => {
    async function fetchAccessoriesProducts() {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select(`
            id, nome, slug, preco, genero, is_new,
            categorias ( nome, slug ),
            subcategorias ( nome, slug ),
            produto_variacoes ( imagens_principais )
          `)
          .eq('ativo', true);

        if (error) throw error;

        if (data) {
          // FILTRO INTELIGENTE: Busca a palavra "acess" (Acessórios, acessorios) na Categoria ou Subcategoria
          const accessoriesData = data.filter((p: any) => {
            const catName = (p.categorias?.nome || '').toLowerCase();
            const subcatName = (p.subcategorias?.nome || '').toLowerCase();
            const catSlug = (p.categorias?.slug || '').toLowerCase();
            const subcatSlug = (p.subcategorias?.slug || '').toLowerCase();

            return (
              catName.includes('acess') || 
              subcatName.includes('acess') ||
              catSlug.includes('acess') ||
              subcatSlug.includes('acess')
            );
          });

          const formattedProducts = accessoriesData.map((p: any) => {
            const mainImagesArray = p.produto_variacoes?.[0]?.imagens_principais || [];
            
            return {
              id: p.id,
              name: p.nome,
              slug: p.slug,
              price: p.preco,
              gender: p.genero === 'UNISEX' ? 'UNISSEX' : p.genero,
              isNew: p.is_new,
              images: mainImagesArray, 
              category: p.categorias?.nome || 'ACESSÓRIO'
            };
          });
          
          setProductsDatabase(formattedProducts);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos acessórios do Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAccessoriesProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-950 font-sans selection:bg-black selection:text-white">
      <Header />

      {/* Faixa Rotativa de Marca */}
      <div className="bg-black text-white py-3 border-b border-gray-800 flex justify-center items-center overflow-hidden relative z-40 mt-20 uppercase font-bold text-[9px] tracking-[0.3em]">
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="whitespace-nowrap flex gap-12">
          <span>A NOVA CULTURA DO CICLISMO</span><span>FRETE GRÁTIS ACIMA DE R$ 500</span><span>PERFORMANCE SEM LIMITES</span>
          <span>A NOVA CULTURA DO CICLISMO</span><span>FRETE GRÁTIS ACIMA DE R$ 500</span>
        </motion.div>
      </div>

      {/* 1. HERO CATEGORIA (ACESSÓRIOS) */}
      <section className="relative h-[60dvh] lg:h-[70dvh] w-full overflow-hidden bg-gray-900 group">
        <img 
          src="https://images.unsplash.com/photo-1576435728678-68ce0b62e478?q=80&w=2000&auto=format&fit=crop" 
          alt="Accessories Collection" 
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] opacity-80 transition-transform duration-[3s] group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24 z-10 pointer-events-none max-w-[1600px] mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
              The Urban Syndicate
            </span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.85]">
              Accessories <br/> <span className="font-light italic opacity-90">Collection</span>
            </h1>
            <p className="text-gray-300 mt-6 text-sm md:text-base tracking-widest uppercase max-w-md font-medium">
              Os detalhes que definem a alta performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. GRID DE PRODUTOS ACESSÓRIOS */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-950">
              {productsDatabase.length} {productsDatabase.length === 1 ? 'Produto' : 'Produtos'}
            </h2>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              <button className="hover:text-black transition-colors">Filtrar</button>
              <button className="hover:text-black transition-colors">Ordenar</button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-32 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : productsDatabase.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
              {productsDatabase.map((product) => (
                <PremiumProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col justify-center items-center text-center bg-gray-50 border border-gray-100">
              <CopreLogo className="text-gray-300 mb-6 text-2xl" />
              <h3 className="text-2xl font-light uppercase tracking-widest text-gray-900 mb-2">Coleção em Breve</h3>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Nenhum acessório disponível no momento.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 10. FOOTER PREMIUM */}
      <footer className="bg-white border-t border-gray-100 font-sans pt-24 pb-12 overflow-hidden">
        <div className="px-4 sm:px-8 lg:px-16 max-w-[1600px] mx-auto">
          
          <div className="mb-24 overflow-hidden">
            <motion.h2 
              initial={{ y: 100 }} 
              whileInView={{ y: 0 }} 
              viewport={{ once: true }}
              className="text-[18vw] font-extrabold tracking-[-0.08em] leading-none text-gray-950 select-none text-center"
            >
              COPRÊ.
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 mb-20">
            <div className="col-span-1 md:col-span-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-400">O Syndicate</h4>
              <p className="text-lg md:text-xl font-light text-gray-900 leading-relaxed max-w-sm italic">
                Projetando o futuro da estética e performance no asfalto. Desenvolvido no caos urbano, testado nos picos mais altos.
              </p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-400">Coleções</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link href="/colecao" className="hover:text-gray-500 transition-colors">Novidades</Link></li>
                <li><Link href="/masculino" className="hover:text-gray-500 transition-colors">Masculino</Link></li>
                <li><Link href="/feminino" className="hover:text-gray-500 transition-colors">Feminino</Link></li>
                <li><Link href="/acessorios" className="hover:text-gray-500 transition-colors">Acessórios</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-400">Atendimento</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link href="#" className="hover:text-gray-500 transition-colors">Envios</Link></li>
                <li><Link href="#" className="hover:text-gray-500 transition-colors">Devoluções</Link></li>
                <li><Link href="#" className="hover:text-gray-500 transition-colors">Tamanhos</Link></li>
                <li><Link href="#" className="hover:text-gray-500 transition-colors">Contato</Link></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-gray-400">Syndicate News</h4>
              <div className="flex border-b border-gray-300 pb-2 transition-all focus-within:border-black group">
                <input type="email" placeholder="SEU EMAIL" className="bg-transparent w-full outline-none text-[10px] font-bold uppercase tracking-widest" />
                <button className="px-2"><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
              </div>
              <div className="flex gap-6 mt-10">
                <Link href="#" className="text-gray-950 hover:text-gray-500 transition-colors"><Instagram className="w-5 h-5" /></Link>
                <Link href="#" className="text-gray-950 hover:text-gray-500 transition-colors"><Youtube className="w-5 h-5" /></Link>
                <Link href="#" className="text-gray-950 hover:text-gray-500 transition-colors"><Twitter className="w-5 h-5" /></Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 text-[9px] font-bold tracking-[0.3em] text-gray-400 uppercase">
            <p>© {new Date().getFullYear()} COPRÊ SYNDICATE. TODOS OS DIREITOS RESERVADOS.</p>
            <div className="flex gap-8 mt-6 md:mt-0">
              <Link href="#" className="hover:text-gray-950">Privacidade</Link>
              <Link href="#" className="hover:text-gray-950">Termos</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}