'use client';

import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wind, Droplets, Thermometer, Zap, Play, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// ==========================================
// DADOS HARDCODED - ANATOMIA DA PEÇA
// ==========================================
const anatomyImages = [
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/4.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/1.1.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/2.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/3.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/5.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/6.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/7.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/8.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/9.webp',
  'https://ik.imagekit.io/1t4v46udu/PRODUTOS/CARROSEL%20DE%20ITENS/10.webp',
];

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

const CopreLogo = ({ className = "text-3xl" }: { className?: string }) => (
  <span className={`tracking-tighter text-gray-950 flex items-center ${className} font-sans`}>
    <span className="font-extrabold tracking-[-0.05em]">CO</span>
    <span className="font-light italic ml-[2px] tracking-normal">PÊ.</span>
  </span>
);

const PremiumProductCard = ({ product }: { product: any }) => (
  <div className="group flex flex-col min-w-[75vw] md:min-w-[380px] lg:min-w-[420px] snap-start flex-shrink-0">
    <Link href={`/produto/${product.slug}`} className="relative bg-[#F3F3F3] aspect-[2/3] overflow-hidden mb-6 flex items-center justify-center cursor-pointer">
      {product.isNew && (
        <div className="absolute top-5 left-5 z-30 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm">
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
        className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0 flex items-center justify-between p-5 z-30 border-t border-gray-100"
        onClick={(e) => e.preventDefault()} 
      >
        <span className="text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em]">Ver Detalhes</span>
      </div>
    </Link>
    <div className="flex flex-col px-1">
      <div className="flex justify-between items-start mb-2">
        <Link href={`/produto/${product.slug}`} className="text-base font-semibold text-gray-950 tracking-tight hover:text-gray-500 transition-colors uppercase pr-4 cursor-pointer">
          {product.name}
        </Link>
        <p className="text-sm text-gray-950 font-medium whitespace-nowrap">R$ {Number(product.price).toFixed(2).replace('.', ',')}</p>
      </div>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        {product.gender} // {product.category}
      </span>
    </div>
  </div>
);

const ControlledCarousel = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 450 : window.innerWidth * 0.80;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group/carousel w-full h-full">
      <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white shadow-lg border border-gray-200 p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all hidden md:flex hover:bg-black hover:text-white hover:border-black">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white shadow-lg border border-gray-200 p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all hidden md:flex hover:bg-black hover:text-white hover:border-black">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pl-4 sm:pl-8 lg:pl-16 pr-16 scroll-smooth scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {children}
      </div>
    </div>
  );
};

const InteractiveEditorialCarousel = ({ title, subtitle, lifestyleImage, products }: { title: string, subtitle: string, lifestyleImage: string, products: any[] }) => {
  const [activeGender, setActiveGender] = useState<'MENS' | 'WOMENS'>('MENS');
  const filteredProducts = products.filter(p => p.gender === activeGender);

  return (
    <section className="py-24 md:py-32 overflow-hidden border-b border-gray-100 bg-white">
      <div className="px-4 sm:px-8 lg:px-16 mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 block">{subtitle}</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.9] text-gray-950">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? "font-light italic text-gray-500 block" : "block"}>{word}</span>
            ))}
          </h2>
        </div>
        
        <div className="flex items-center space-x-8 border-b border-gray-200 pb-2">
          <button onClick={() => setActiveGender('MENS')} className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${activeGender === 'MENS' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
            Masculino
            {activeGender === 'MENS' && <motion.div layoutId={`line-${title}`} className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-black" />}
          </button>
          <button onClick={() => setActiveGender('WOMENS')} className={`text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 relative ${activeGender === 'WOMENS' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}>
            Feminino
            {activeGender === 'WOMENS' && <motion.div layoutId={`line-${title}`} className="absolute -bottom-[9px] left-0 right-0 h-[2px] bg-black" />}
          </button>
        </div>
      </div>

      <ControlledCarousel>
        <div className="min-w-[85vw] md:min-w-[450px] lg:min-w-[500px] aspect-[2/3] snap-start relative group overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={lifestyleImage} alt="Lifestyle Mood" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-700 group-hover:bg-black/30" />
          <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
            <h3 className="text-3xl md:text-5xl font-light text-white uppercase tracking-widest mb-4">
              Explore <br/><span className="font-bold">{activeGender === 'MENS' ? 'MASCULINO' : 'FEMININO'}</span>
            </h3>
            <Link href={`/${activeGender.toLowerCase()}`} className="inline-block border-b border-white text-white text-[10px] font-bold uppercase tracking-[0.2em] pb-1 w-max hover:text-gray-300 hover:border-gray-300 transition-colors">
              Ver Coleção
            </Link>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredProducts.map((product, i) => (
            <motion.div key={`${product.id}-${activeGender}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="flex-shrink-0">
              <PremiumProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </ControlledCarousel>
    </section>
  );
};

// ==========================================
// 3. HOME PRINCIPAL
// ==========================================

export default function Home() {
  const [productsDatabase, setProductsDatabase] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select(`id, nome, slug, preco, genero, is_new, categorias ( nome ), produto_variacoes ( imagens_principais )`)
          .eq('ativo', true);

        if (error) throw error;

        if (data) {
          const formattedProducts = data.map((p: any) => {
            const mainImagesArray = p.produto_variacoes?.[0]?.imagens_principais || [];
            return {
              id: p.id, name: p.nome, slug: p.slug, price: p.preco, gender: p.genero, isNew: p.is_new,
              images: mainImagesArray, category: p.categorias?.nome || 'PRODUTO'
            };
          });
          setProductsDatabase(formattedProducts);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos do Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-950 font-sans selection:bg-black selection:text-white">
      <Header />

      {/* LIGHTBOX MODAL (ZOOM DA ANATOMIA DA PEÇA) */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
            onClick={() => setZoomedImage(null)}
          >
            <button className="absolute top-8 right-8 p-3 text-gray-950 hover:bg-gray-100 rounded-full transition-colors z-[210]" onClick={() => setZoomedImage(null)}>
              <X className="w-8 h-8" strokeWidth={1} />
            </button>
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              src={zoomedImage} alt="Anatomia Ampliada" className="w-[90vw] h-[90vh] object-contain mix-blend-multiply cursor-default pointer-events-none" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black text-white py-3 border-b border-gray-800 flex justify-center items-center overflow-hidden relative z-40 mt-20">
        <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.3em] flex gap-12">
          <span>A NOVA CULTURA DO CICLISMO</span><span>FRETE GRÁTIS ACIMA DE R$ 500</span><span>PERFORMANCE SEM LIMITES</span>
          <span>A NOVA CULTURA DO CICLISMO</span><span>FRETE GRÁTIS ACIMA DE R$ 500</span>
        </motion.div>
      </div>

      {/* 1. HERO DIVIDIDO */}
      <section className="relative h-[90dvh] w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-900">
        <div className="relative h-full w-full overflow-hidden group">
          <img src="https://ik.imagekit.io/1t4v46udu/BANNER/davinci_ultra_realistic_editorial_photograph_of_a_cyclist_.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-90" />
        </div>
        <div className="relative h-full w-full overflow-hidden group hidden lg:block border-l border-white/10">
          <img src="https://ik.imagekit.io/1t4v46udu/BANNER/davinci_editorial_photograph_of_a_cyclist_resting_casually.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105 opacity-90" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6 mt-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <CopreLogo className="text-white text-5xl md:text-7xl mb-8 drop-shadow-2xl" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }} className="text-white text-5xl md:text-8xl lg:text-[110px] font-bold uppercase tracking-tighter text-center leading-[0.85]">
            The Urban <br/> <span className="font-light italic opacity-90">Syndicate</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="mt-12 pointer-events-auto">
            <Link href="/colecao" className="inline-flex items-center justify-center bg-white text-black px-12 py-5 text-[10px] font-bold tracking-[0.2em] hover:bg-gray-200 transition-colors uppercase">
              Explorar Coleção
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. CARROSSEL INTERATIVO */}
      {isLoading ? (
        <div className="py-32 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
      ) : (
        <InteractiveEditorialCarousel 
          title="Urban Drop 01" 
          subtitle="Lançamentos da Temporada"
          lifestyleImage="https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2022%20de%20mar.%20de%202026,%2014_42_00.png"
          products={productsDatabase}
        />
      )}

      {/* 3. VÍDEO LIFESTYLE */}
      <section className="relative h-[100dvh] w-full overflow-hidden bg-black group cursor-pointer">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000 group-hover:opacity-40">
          <source src="https://ik.imagekit.io/1t4v46udu/BANNER/MAAP%20Road%20Apparel%20Feel%20The%20High%20-%20MAAP%20(480p,%20h264,%20youtube).mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
          <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center mb-8 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
          <h2 className="text-white text-5xl md:text-8xl font-light uppercase tracking-tighter leading-none mix-blend-overlay">
            Quebre as <span className="font-bold italic">Regras</span>
          </h2>
          <p className="text-gray-300 mt-8 text-sm md:text-base tracking-widest uppercase max-w-md font-medium">
            A atitude das ruas, projetada para a velocidade.
          </p>
        </div>
      </section>

      {/* 4. THE ESSENTIALS (FIXED CROP AND SPACING) */}
      {!isLoading && (
        <section className="py-24 md:py-32 bg-[#F9F9F9] overflow-hidden border-b border-gray-100">
          <div className="px-4 sm:px-8 lg:px-16 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9] text-gray-950">The <span className="font-light italic text-gray-500">Essentials</span></h2>
            <Link href="/essentials" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500">Ver Todos</Link>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch">
            <div className="w-full lg:w-[68%] xl:w-[72%] order-2 lg:order-1 pt-8 lg:pt-0">
              <ControlledCarousel>
                {productsDatabase.slice(0, 6).map((product, i) => (
                  <PremiumProductCard key={i} product={product} />
                ))}
              </ControlledCarousel>
            </div>
            <div className="w-full lg:w-[32%] xl:w-[28%] order-1 lg:order-2 px-4 lg:pl-4">
              <div className="relative w-full aspect-[4/5] lg:h-full overflow-hidden group bg-gray-100">
                <img src="https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2022%20de%20mar.%20de%202026,%2014_40_51.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col p-8 justify-end bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-4xl font-bold text-white uppercase tracking-tighter leading-none">Feito para o <br/><span className="font-light italic">Dia a Dia</span></h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. SEÇÃO ESTÚDIO / ANATOMIA DA PEÇA */}
      <section className="py-24 md:py-32 bg-white overflow-hidden border-y border-gray-100">
        <div className="px-4 sm:px-8 lg:px-16 mb-16 text-center flex flex-col items-center">
          <CopreLogo className="text-2xl text-gray-400 mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-6 text-gray-900">Anatomia da Peça</h2>
          <p className="text-gray-500 font-medium text-xs md:text-sm max-w-2xl mx-auto tracking-wide">
            Cores sólidas, engenharia avançada e um caimento de segunda pele. A beleza na sua forma crua.
          </p>
        </div>
        
        <ControlledCarousel>
          {anatomyImages.map((img, i) => (
            <div 
              key={`anatomy-${i}`} 
              onClick={() => setZoomedImage(img)}
              className="w-[120px] md:w-[160px] lg:w-[200px] h-[160px] md:h-[220px] lg:h-[280px] flex items-center justify-center snap-center flex-shrink-0 hover:-translate-y-2 transition-transform duration-500 cursor-zoom-in group"
            >
              <img src={img} alt={`Anatomia ${i + 1}`} className="w-full h-full object-contain mix-blend-multiply p-2 md:p-4 transition-transform duration-700 group-hover:scale-105" draggable={false} />
            </div>
          ))}
        </ControlledCarousel>
      </section>

      {/* 6. MANIFESTO */}
      <section className="py-32 md:py-48 px-6 text-center max-w-6xl mx-auto bg-[#F9F9F9] flex flex-col items-center justify-center border-b border-gray-200">
        <h2 className="text-4xl md:text-6xl lg:text-[90px] font-bold uppercase tracking-tighter leading-[0.85] text-gray-950">
          NÓS NÃO PEDALAMOS PARA FUGIR. <br/>
          <span className="font-light italic text-gray-400">PEDALAMOS PARA CHEGAR.</span>
        </h2>
        <p className="mt-16 text-lg md:text-2xl text-gray-800 font-light max-w-3xl mx-auto leading-relaxed tracking-wide">
          A COPÊ. nasce da obsessão por unir a estética das ruas com a brutalidade do asfalto. 
          Desenhamos armaduras para aqueles que encontram na exaustão a sua forma mais pura de expressão. 
          Não somos uma marca de esportes. Somos uma cultura.
        </p>
        <Link href="/about" className="mt-16 border-b-2 border-black text-black text-[10px] font-bold uppercase tracking-[0.3em] pb-1.5 hover:text-gray-500 hover:border-gray-500 transition-all">
          Descubra a Copê
        </Link>
      </section>

      {/* 7. COMMUNITY */}
      <section className="py-24 md:py-32 px-4 sm:px-12 bg-white">
        <div className="max-w-[1500px] mx-auto relative group">
          <div className="w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden relative shadow-2xl">
            <img 
              src="https://images.openai.com/static-rsc-4/_cN2mqBb2bQKYgNUGrNHqs-roMKSn4SRh2NcMavctSb3vWMvKFSKmN_cJZJ3kjosdgbGzBUJgZHi4rzW8ll8ClkW1_zQyJ7QfSEOJZqA8h74CJLcJKBTGSRm-F7U_hQbZqNGr1CmCrvJuqP4O5S0MRdnNV8hsWpra4koIWRURqNaxbdTFxGpn_0dFLL9rgob?purpose=fullsize" 
              alt="Lifestyle Ride" 
              className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-[3s] group-hover:scale-105"
            />
          </div>
          <div className="absolute -bottom-12 right-4 md:right-24 bg-[#F9F9F9] p-10 md:p-16 shadow-xl max-w-lg border border-gray-100 transition-transform duration-500 group-hover:-translate-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] block mb-4">Comunidade</span>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6 leading-none">O Clube <br/><span className="font-light italic text-gray-500">Local</span></h3>
            <p className="text-sm md:text-base text-gray-600 font-light mb-8 leading-relaxed">
              Junte-se aos pedais matinais do nosso Syndicato. Compartilhe rotas, quebre limites e viva a cultura.
            </p>
            <Link href="/journal" className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500">
              Junte-se ao Strava
            </Link>
          </div>
        </div>
      </section>

      {/* 8. MENS & WOMENS BLOCK */}
      <section className="grid grid-cols-1 md:grid-cols-2 mt-24">
        <Link href="/masculino" className="relative h-[80dvh] group overflow-hidden cursor-pointer">
          <img src="https://ik.imagekit.io/1t4v46udu/BANNER/Gemini_Generated_Image_sntunjsntunjsntu.png" alt="Men" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
            <h3 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter leading-none text-center">Homens <br/><span className="font-light italic">Coleção</span></h3>
          </div>
        </Link>
        <Link href="/feminino" className="relative h-[80dvh] group overflow-hidden cursor-pointer">
          <img src="https://ik.imagekit.io/1t4v46udu/BANNER/Gemini_Generated_Image_c4tdmhc4tdmhc4td.png" alt="Women" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
            <h3 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter leading-none text-center">Mulheres <br/><span className="font-light italic">Coleção</span></h3>
          </div>
        </Link>
      </section>

      {/* 9. TECH CARDS */}
      <section className="py-32 bg-gray-950 text-white border-t border-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4 block">Copê. Tech</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">
                Projetado <br/><span className="font-light italic text-gray-400">Para Elementos</span>
              </h2>
            </div>
            <p className="text-gray-400 font-light max-w-md text-sm md:text-base leading-relaxed">
              Desenvolvemos nossos próprios tecidos para combater todas as variáveis climáticas que você enfrentar no asfalto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Respirabilidade', icon: Wind, desc: 'Micro-perfurações a laser garantem evaporação instantânea.', img: 'https://ik.imagekit.io/1t4v46udu/fd7251f5-e53a-4e79-8d15-a471eb905157.png' },
              { title: 'Waterproof', icon: Droplets, desc: 'Membrana DWR premium. A água simplesmente desliza.', img: 'https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2022%20de%20mar.%20de%202026,%2019_35_13.png' },
              { title: 'Térmico', icon: Thermometer, desc: 'Fios escovados que retêm o calor do corpo em climas gélidos.', img: 'https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2022%20de%20mar.%20de%202026,%2019_37_20.png' },
              { title: 'Corta-Vento', icon: Zap, desc: 'Escudo frontal denso para cortar as rajadas de vento nas descidas.', img: 'https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2022%20de%20mar.%20de%202026,%2019_39_11.png' },
            ].map((tech, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden group border border-gray-800">
                <img src={tech.img} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-all duration-[2s] group-hover:scale-105 grayscale" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <tech.icon className="w-8 h-8 text-white mb-6 opacity-80" strokeWidth={1} />
                  <h3 className="text-2xl font-bold uppercase tracking-tighter mb-3">{tech.title}</h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed tracking-wide">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FOOTER COPÊ */}
      <footer className="bg-[#F9F9F9] pt-32 pb-16 px-6 lg:px-16 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-1 md:col-span-4 pr-0 md:pr-12">
            <CopreLogo className="text-5xl md:text-6xl mb-8" />
            <p className="text-sm text-gray-600 font-medium max-w-sm leading-relaxed mb-10 tracking-wide">
              A nova cultura do ciclismo de alta performance. Desenvolvido para atletas que exigem estética e não aceitam limites.
            </p>
            <div className="flex border-b border-gray-300 pb-3 max-w-sm focus-within:border-black transition-colors">
              <input type="email" placeholder="Assine a Newsletter" className="w-full text-[10px] font-bold uppercase tracking-[0.2em] outline-none placeholder-gray-400 bg-transparent" />
              <button><ArrowRight className="w-4 h-4 text-gray-950" /></button>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-950 mb-8 border-b border-gray-200 pb-4">Loja</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.1em] text-gray-500">
              <li><Link href="#" className="hover:text-black transition-colors">Novidades</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Masculino</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Feminino</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Acessórios</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-950 mb-8 border-b border-gray-200 pb-4">Suporte</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.1em] text-gray-500">
              <li><Link href="#" className="hover:text-black transition-colors">Minha Conta</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Envios e Devoluções</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Guia de Tamanhos</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Contato</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-950 mb-8 border-b border-gray-200 pb-4">Redes</h4>
            <ul className="space-y-5 text-xs font-bold uppercase tracking-[0.1em] text-gray-500">
              <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Strava</a></li>
              <li><a href="#" className="hover:text-black transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Spotify</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] pt-8 border-t border-gray-200">
          <p>&copy; {new Date().getFullYear()} COPÊ. TODOS OS DIREITOS RESERVADOS.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="#" className="hover:text-gray-950 transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-gray-950 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}