'use client';

import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// --- MOCK DE PRODUTOS TURBINADO (Com Image Swap) ---
// Cada produto agora tem um array 'images' [Frente, Costas/Detalhe]
const mockProducts = [
  {
    id: '1',
    name: 'Camisa Pro Air Neo - Preto',
    category: 'ROUPAS',
    gender: 'MASCULINO',
    price: 450.00,
    // Imagens de modelos reais em alta qualidade
    images: [
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_16_24-removebg-preview.png', // Frente
      'https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2018%20de%20mar.%20de%202026,%2020_17_40.png', // Costas
    ],
    sizes: ['P', 'M', 'G'],
    isNew: true,
  },
  {
    id: '2',
    name: 'Bretelle Training Cargo - Cinza',
    category: 'ROUPAS',
    gender: 'FEMININO',
    price: 680.00,
    images: [
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_20_45-removebg-preview.png',
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_21_23-removebg-preview.png',
    ],
    sizes: ['M', 'G', 'GG'],
    isNew: false,
  },
  {
    id: '3',
    name: 'Jaqueta Feminina Ultralight - Oliva',
    category: 'OUTERWEAR',
    gender: 'FEMININO',
    price: 550.00,
    images: [
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_23_14-removebg-preview.png',
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_24_23-removebg-preview.png',
    ],
    sizes: ['PP', 'P', 'M'],
    isNew: true,
  },
  {
    id: '4',
    name: 'Camisa Masculina Motion - Branco',
    category: 'ROUPAS',
    gender: 'MASCULINO',
    price: 450.00,
    images: [
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_27_24-removebg-preview.png',
      'https://ik.imagekit.io/1t4v46udu/ChatGPT_Image_18_de_mar._de_2026__20_28_34-removebg-preview.png',
    ],
    sizes: ['P', 'M'],
    isNew: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-950">
      <Header />

      {/* Faixa de Anúncio Topo */}
      <div className="bg-gray-950 text-white py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] relative z-40 mt-20">
        <p>Frete grátis nas compras acima de R$ 500 | Parcele em até 6x</p>
      </div>

      {/* 1. HERO SECTION (Mantida) */}
      <section className="relative h-[85dvh] flex items-center justify-center overflow-hidden bg-gray-100">
        <motion.div 
          initial={{ scale: 1.03 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" 
        />
        <div className="absolute inset-0 bg-black/25" /> 

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-9xl font-bold text-white tracking-tighter mb-5 uppercase leading-[0.85]"
          >
            Performance <br /> Redefinida
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base md:text-lg text-gray-100 mb-12 max-w-xl mx-auto font-light"
          >
            Coleção Outono 26: Tecnologia de ponta e design minimalista para os dias mais exigentes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link 
              href="#produtos" 
              className="inline-flex items-center bg-white text-black px-10 py-4 text-xs font-bold tracking-widest hover:bg-black hover:text-white transition-colors uppercase group"
            >
              Comprar Novidades
              <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. NOVA SEÇÃO: DIVISÃO GÊNERO (IMAGENS GRANDES E HOVER) */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[90dvh] border-b border-gray-100">
        {/* Lado Masculino */}
        <div className="relative group overflow-hidden border-r border-gray-100">
          <img 
            src="https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2018%20de%20mar.%20de%202026,%2020_33_17.png" 
            alt="Coleção Masculina" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <h3 className="text-4xl md:text-6xl font-light text-white uppercase tracking-widest mb-6">Masculino</h3>
            <Link 
              href="/masculino" 
              className="bg-white text-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
            >
              Comprar Coleção
            </Link>
          </div>
        </div>

        {/* Lado Feminino */}
        <div className="relative group overflow-hidden">
          <img 
            src="https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2018%20de%20mar.%20de%202026,%2020_39_48.png" 
            alt="Coleção Feminina" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
            <h3 className="text-4xl md:text-6xl font-light text-white uppercase tracking-widest mb-6">Feminino</h3>
            <Link 
              href="/feminino" 
              className="bg-white text-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
            >
              Comprar Coleção
            </Link>
          </div>
        </div>
      </section>

      {/* 3. VITRINE DE PRODUTOS (Com Image Swap) */}
      <section id="produtos" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-100 pb-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Novos Lançamentos</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-950 uppercase ledading-none">
              Destaques da Temporada
            </h2>
          </div>
          <Link href="/roupas" className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-950 hover:text-gray-600 transition-colors group mt-4 md:mt-0">
            Ver tudo
            <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid Dinâmico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {mockProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Box da Imagem - HOVER SWAP AQUI */}
              <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden mb-5">
                {product.isNew && (
                  <div className="absolute top-4 left-4 z-30 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5">
                    Novo
                  </div>
                )}
                
                {/* Imagem 1 (Frente) - Visível padrão */}
                <img 
                  src={product.images[0]} 
                  alt={`${product.name} - Frente`}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out opacity-100 group-hover:opacity-0 z-10"
                />

                {/* Imagem 2 (Costas/Detalhe) - Aparece no hover */}
                <img 
                  src={product.images[1]} 
                  alt={`${product.name} - Costas`}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-20 transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Overlay Hover: Mostrar Tamanhos (Ajustado para ficar sobre a img2) */}
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-4 translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 flex flex-col items-center justify-center border-t border-gray-100 z-30">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">Adicionar Rápido</p>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button key={size} className="w-9 h-9 flex items-center justify-center border border-gray-200 text-xs font-medium text-gray-950 hover:border-black hover:bg-black hover:text-white transition-colors">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Informações */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center">
                  {product.category} <span className="mx-2">•</span> {product.gender}
                </span>
                <h3 className="text-sm font-semibold text-gray-950 uppercase tracking-wide ledading-tight mb-2 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-700 font-medium">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. NOVA SEÇÃO: IMAGEM GRANDE EDITORIAL (TECNOLOGIA) */}
      <section className="relative h-[80dvh] flex items-center bg-gray-950 text-white overflow-hidden border-t border-b border-gray-800">
        <img 
          src="https://ik.imagekit.io/1t4v46udu/ChatGPT%20Image%2018%20de%20mar.%20de%202026,%2020_53_04.png" 
          alt="Detalhe técnico do tecido" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Inovação Têxtil</span>
            <h2 className="text-4xl md:text-6xl font-light uppercase tracking-widest leading-tight mb-8">
              A Ciência por trás <br /> do Conforto
            </h2>
            <p className="text-gray-300 text-sm md:text-base font-light mb-10 max-w-lg leading-relaxed">
              Nossa tecnologia ProAir utiliza microfibras hidrofóbicas que expulsam o suor instantaneamente, mantendo seu corpo na temperatura ideal, não importa o esforço.
            </p>
            <Link href="/tecnologia" className="inline-block border-b-2 border-white text-white text-xs font-bold uppercase tracking-widest pb-1.5 hover:text-gray-400 hover:border-gray-400 transition-colors">
              Descubra a Tecnologia
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 5. NOVA SEÇÃO: GRADE LIFESTYLE (INSTAGRAM FEEL) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="text-center mb-16 max-w-xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-950 mb-3">#MARCOSJRCYCLING</h2>
          <p className="text-2xl font-light text-gray-700 uppercase tracking-wider">Mostre seu pedal. Siga nossa comunidade.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            'https://ik.imagekit.io/1t4v46udu/beneficios-do-ciclismo-capa-768x586-1.png',
            'https://ik.imagekit.io/1t4v46udu/598725703_1413283640807373_7912508883551539805_n.jpg',
            'https://ik.imagekit.io/1t4v46udu/premium_photo-1663054621215-2551ea135abf.jpg',
            'https://ik.imagekit.io/1t4v46udu/selfie-de-ciclista-feminina-com-smartphone-durante-bicicleta-para-exerc%C3%ADcio-grupo-social-feminino-ego%C3%ADsta-ciclistas-e-relaxa-265603214.webp',
          ].map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
            >
              <img src={img} alt="Comunidade" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER (Mantido e ajustado) */}
      <footer className="bg-white pt-24 pb-12 px-6 lg:px-10">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 pr-12">
            <span className="text-3xl font-bold tracking-tighter text-gray-950 block mb-6">
              MARCOS<span className="font-light">.JR</span>
            </span>
            <p className="text-sm text-gray-500 font-light max-w-sm leading-relaxed">
              Equipamentos de ciclismo de alta performance, desenhados em São Paulo para atletas que não aceitam limites. Performance, estética e sustentabilidade.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-950 mb-7">Explorar</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-600">
              <li><Link href="#" className="hover:text-black transition-colors">Novidades</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Masculino</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Feminino</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Acessórios</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors text-red-600">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-950 mb-7">Conta</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-600">
              <li><Link href="#" className="hover:text-black transition-colors">Login / Cadastro</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Meus Pedidos</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Endereços</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Rastreio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-950 mb-7">Ajuda</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-600">
              <li><Link href="#" className="hover:text-black transition-colors">Contato</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Envios e Prazos</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Trocas</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Tamanhos</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1500px] mx-auto border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 font-medium">
          <p>&copy; {new Date().getFullYear()} MARCOS.JR CYCLING LTDA. CNPJ 00.000.000/0001-00.</p>
          <div className="flex space-x-6 mt-5 md:mt-0 uppercase tracking-widest">
            <Link href="#" className="hover:text-gray-950 transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-gray-950 transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}