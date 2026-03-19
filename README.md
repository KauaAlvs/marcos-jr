# MARCOS.JR CYCLING | E-commerce Premium

Um protótipo de e-commerce de alta performance para vestuário e equipamentos de ciclismo, fortemente inspirado no design minimalista e focado em experiência do usuário da [MAAP](https://maap.cc/).

## 🚀 Visão Geral do Projeto

Este projeto foi desenvolvido com foco absoluto em **impacto visual e fluidez (UX/UI)**. O objetivo é entregar uma experiência premium de navegação, com transições suaves, uso inteligente de tipografia e espaço em branco, além de um sistema de gavetas (Drawers) laterais que mantém o usuário imerso na página principal durante ações como login, cadastro e visualização do carrinho.

### ✨ Funcionalidades Principais (Front-end & UX)
- **Design Clean & Responsivo:** Interface minimalista, destacando o produto através do efeito `mix-blend-multiply` para mesclar imagens de fundo branco com o cenário.
- **Image Swap no Hover:** Vitrine de produtos com troca interativa de imagens ao passar o mouse.
- **Autenticação Multi-step Interativa:** Formulário de cadastro em etapas (Dados, Endereço, Acesso) com barra de progresso, animado com Framer Motion.
- **Integração ViaCEP:** Preenchimento automático de rua, bairro, cidade e estado a partir da digitação do CEP na etapa de endereço.
- **Sidebars (Drawers) Inteligentes:** Autenticação e Carrinho de Compras abrem fluidamente na lateral da tela (`100dvh`), sem redirecionar a página.
- **Painel Admin Oculto:** Rota `/admin` protegida para gerenciamento de Dashboard, Produtos, Categorias e Pedidos.

## 🛠 Tecnologias Utilizadas

A stack foi escolhida para garantir velocidade de desenvolvimento, segurança (tipagem) e deploy de alta performance na Vercel:
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** TypeScript
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **BaaS (Backend/DB/Auth):** [Supabase](https://supabase.com/)
- **Integração Externa:** API ViaCEP

## ⚙️ Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SEU_USUARIO/marcos-jr.git](https://github.com/SEU_USUARIO/marcos-jr.git)