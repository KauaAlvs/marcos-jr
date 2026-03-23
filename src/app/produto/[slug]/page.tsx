'use client';

import { useEffect, useState, use, useRef } from 'react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Ruler, Check, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useUI } from '@/context/UIContext';

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
        <p className="text-sm text-gray-950 font-medium whitespace-nowrap">R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}</p>
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
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/carousel">
      <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur border border-gray-200 p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex hover:bg-black hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur border border-gray-200 p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex hover:bg-black hover:text-white"><ChevronRight className="w-5 h-5" /></button>
      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 pl-4 sm:pl-8 lg:pl-16 pr-16 scroll-smooth scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// PÁGINA DO PRODUTO (PDP)
// ==========================================
export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { openCartSidebar } = useUI();
  const { slug } = use(params);
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const galleryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: prodData, error: prodErr } = await supabase
          .from('produtos')
          .select(`
            *, categorias (nome), subcategorias (nome),
            produto_variacoes ( id, cor_nome, cor_hex, imagens_galeria, estoque ( tamanho, quantidade ) )
          `)
          .eq('slug', slug)
          .single();

        if (prodErr || !prodData) throw new Error('Produto não encontrado');
        setProduct(prodData);
        
        if (prodData.produto_variacoes && prodData.produto_variacoes.length > 0) {
          setSelectedVariation(prodData.produto_variacoes[0]);
        }

        const { data: relatedData } = await supabase
          .from('produtos')
          .select(`
            id, nome, slug, preco, genero, is_new, categorias (nome),
            produto_variacoes ( imagens_principais )
          `)
          .eq('ativo', true)
          .neq('id', prodData.id) 
          .limit(6);

        if (relatedData && relatedData.length > 0) {
          const formattedRelated = relatedData.map((p: any) => ({
            id: p.id, name: p.nome, slug: p.slug, price: p.preco, gender: p.genero, isNew: p.is_new,
            images: p.produto_variacoes?.[0]?.imagens_principais || [], 
            category: p.categorias?.nome || 'Coleção'
          }));
          setRelatedProducts(formattedRelated);
        }

      } catch (err) {
        console.error("Erro:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handleColorSelect = (vari: any) => {
    setSelectedVariation(vari);
    setSelectedSize(null);
    if (galleryScrollRef.current) galleryScrollRef.current.scrollLeft = 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecione um tamanho antes de adicionar à mochila.");
      return;
    }
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      openCartSidebar();
    }, 600);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (galleryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
      const scrollAmount = clientWidth;

      if (direction === 'right') {
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          galleryScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 10) {
          galleryScrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          galleryScrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  if (isLoading) {
    return <main className="min-h-screen bg-white flex items-center justify-center"><Header /><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></main>;
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <Header />
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-gray-950 mb-4">Produto não encontrado</h1>
        <Link href="/" className="text-xs font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500">Voltar para a Coleção</Link>
      </main>
    );
  }

  const galeria = selectedVariation?.imagens_galeria || [];
  const estoqueOrdenado = [...(selectedVariation?.estoque || [])].sort((a, b) => 
    ['PP', 'P', 'M', 'G', 'GG', 'Único'].indexOf(a.tamanho) - ['PP', 'P', 'M', 'G', 'GG', 'Único'].indexOf(b.tamanho)
  );
  
  const infiniteAnatomyImages = [...anatomyImages, ...anatomyImages, ...anatomyImages];

  return (
    <main className="min-h-screen bg-white text-gray-950 font-sans selection:bg-black selection:text-white">
      <Header />

      {/* ========================================================
          1. SEÇÃO SPLIT SCREEN
          ======================================================== */}
      <section className="flex flex-col lg:flex-row min-h-screen lg:min-h-[calc(100vh)] pt-20 lg:pt-0 relative border-b border-gray-100">
        
        {/* ESQUERDA: GALERIA COM SETAS */}
        <div className="w-full lg:w-[60%] xl:w-[65%] relative bg-[#F9F9F9] flex items-center group">
          {galeria.length > 1 && (
            <>
              <button onClick={() => scrollGallery('left')} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-white/50 backdrop-blur-md rounded-full border border-gray-200 text-gray-500 hover:text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
                <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <button onClick={() => scrollGallery('right')} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 p-4 bg-white/50 backdrop-blur-md rounded-full border border-gray-200 text-gray-500 hover:text-black hover:bg-white transition-all opacity-0 group-hover:opacity-100 hidden md:flex">
                <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </>
          )}

          <div ref={galleryScrollRef} className="w-full h-[60vh] lg:h-screen overflow-x-auto flex snap-x snap-mandatory scroll-smooth hide-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {galeria.length > 0 ? (
              galeria.map((img: string, idx: number) => (
                <div key={idx} className="min-w-full h-full flex items-center justify-center snap-start flex-shrink-0 relative">
                  <img src={img} alt={`${product.nome} - Foto ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply p-4 lg:p-8" />
                </div>
              ))
            ) : (
              <div className="min-w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                Sem Imagem para esta cor
              </div>
            )}
          </div>
        </div>

        {/* DIREITA: PAINEL DE INFORMAÇÕES */}
        <div className="w-full lg:w-[40%] xl:w-[35%] bg-white lg:bg-[#EBEBEB] p-6 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center border-l border-gray-200 lg:min-h-screen">
          <div className="w-full max-w-md mx-auto">
            
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">
              <Link href="/" className="hover:text-black">Home</Link>
              <span className="mx-2">/</span>
              <span className="hover:text-black">{product.genero}</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.categorias?.nome || 'Coleção'}</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tighter text-gray-950 leading-[0.9] mb-4">
              {product.nome}
            </h1>
            
            <div className="flex items-center space-x-4 mb-8">
              {/* O bug estava aqui: product.price ao invés de product.preco! */}
              <span className="text-xl font-medium tracking-tight">R$ {Number(product.preco || 0).toFixed(2).replace('.', ',')}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Ou 3x de R$ {(Number(product.preco || 0) / 3).toFixed(2).replace('.', ',')} sem juros</span>
            </div>

            <p className="text-xs text-gray-600 font-medium leading-relaxed tracking-wide mb-10">
              {product.descricao || 'Produto de alta performance com a estética inconfundível do Syndicate.'}
            </p>

            {product.produto_variacoes && product.produto_variacoes.length > 0 && (
              <div className="mb-8">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 mb-3">
                  Cor: <span className="text-gray-500 font-medium ml-1">{selectedVariation?.cor_nome}</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {product.produto_variacoes.map((vari: any) => (
                    <button
                      key={vari.id}
                      onClick={() => handleColorSelect(vari)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedVariation?.id === vari.id ? 'ring-2 ring-offset-2 ring-black' : 'ring-1 ring-gray-300 hover:ring-gray-400'}`}
                      style={{ backgroundColor: vari.cor_hex }}
                      title={vari.cor_nome}
                    >
                      {selectedVariation?.id === vari.id && <Check className={`w-3.5 h-3.5 ${vari.cor_hex === '#FFFFFF' || vari.cor_hex === '#ffffff' ? 'text-black' : 'text-white'}`} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-10">
              <div className="flex justify-between items-end mb-3">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950">Tamanho</span>
              </div>
              
              {estoqueOrdenado.length > 0 ? (
                <div className={`grid gap-2 mb-4 ${estoqueOrdenado.length > 1 ? 'grid-cols-4' : 'grid-cols-1'}`}>
                  {estoqueOrdenado.map((item: any) => {
                    const outOfStock = item.quantidade <= 0;
                    return (
                      <button
                        key={item.tamanho}
                        disabled={outOfStock}
                        onClick={() => setSelectedSize(item.tamanho)}
                        className={`relative h-12 flex items-center justify-center border transition-all duration-200 text-xs font-bold uppercase tracking-widest
                          ${outOfStock 
                            ? 'border-gray-200 text-gray-300 bg-white cursor-not-allowed' 
                            : selectedSize === item.tamanho 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-300 bg-white lg:bg-[#EBEBEB] text-gray-950 hover:border-black'
                          }
                        `}
                      >
                        {item.tamanho}
                        {outOfStock && (
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <svg className="absolute w-full h-full text-gray-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                              <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-red-600 font-bold uppercase tracking-widest bg-red-50 p-3 border border-red-100 rounded-sm">
                  Produto esgotado nesta cor.
                </div>
              )}

              {estoqueOrdenado.length > 1 && (
                <div className="flex space-x-6 mt-4">
                  <button className="flex items-center text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
                    <Ruler className="w-3 h-3 mr-1.5" strokeWidth={1.5} /> Descubra seu tamanho
                  </button>
                  <button className="flex items-center text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 hover:text-black transition-colors border-b border-transparent hover:border-black pb-0.5">
                    Tabela de medidas
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 lg:mt-auto">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || estoqueOrdenado.length === 0}
                className="w-full bg-black text-white h-14 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-70 group"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Adicionar à Mochila
                    <ArrowRight className="w-4 h-4 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          5. SEÇÃO ESTÚDIO / ANATOMIA DA PEÇA
          ======================================================== */}
      <section className="py-16 md:py-24 bg-[#F9F9F9] overflow-hidden border-y border-gray-200">
        <div className="px-4 sm:px-8 lg:px-16 mb-12 text-center flex flex-col items-center">
          <CopreLogo className="text-2xl text-gray-400 mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-4 text-gray-900">Complete seu KIT</h2>
          <p className="text-gray-500 font-medium text-xs md:text-sm max-w-2xl mx-auto tracking-wide">
            Cores sólidas, engenharia avançada e um caimento de segunda pele. A beleza na sua forma crua.
          </p>
        </div>
        
        <div className="flex overflow-hidden whitespace-nowrap w-full group relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F9F9F9] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F9F9F9] to-transparent z-10 pointer-events-none"></div>

          <motion.div
            className="flex gap-12 md:gap-16 px-6 items-center"
            animate={{ x: ["0%", "-50%"] }} 
            transition={{ repeat: Infinity, ease: "linear", duration: 90 }} 
          >
            {infiniteAnatomyImages.map((img, i) => (
              <div 
                key={`anatomy-${i}`} 
                className="w-[120px] h-[150px] md:w-[150px] md:h-[200px] lg:w-[180px] lg:h-[240px] flex items-center justify-center flex-shrink-0 hover:-translate-y-2 transition-transform duration-500 cursor-pointer"
              >
                <img src={img} alt={`Anatomia ${i}`} className="w-full h-full object-contain mix-blend-multiply" draggable={false} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          2. SEÇÃO CROSS-SELL (Complete o Kit)
          ======================================================== */}
      {relatedProducts.length > 0 ? (
        <section className="py-24 md:py-32 bg-white border-t border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-8 lg:px-16 mb-16 flex justify-between items-end">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 block">Complete o Kit</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter uppercase leading-[0.9] text-gray-950">
                Você pode <span className="font-light italic text-gray-500">Gostar</span>
              </h2>
            </div>
          </div>
          <ControlledCarousel>
            {relatedProducts.map((prod, i) => (
              <PremiumProductCard key={i} product={prod} />
            ))}
          </ControlledCarousel>
        </section>
      ) : (
        <section className="py-24 bg-white flex flex-col items-center justify-center border-t border-gray-100">
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 text-center">
             Cadastre mais produtos no painel Admin para exibir a seção "Complete o Kit" aqui.
           </p>
        </section>
      )}

      {/* ========================================================
          3. FOOTER
          ======================================================== */}
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