'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Tags, ShoppingBag, LogOut, Lock, User, 
  Plus, TrendingUp, DollarSign, CreditCard, Loader2, 
  CheckCircle, AlertTriangle, Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ==========================================
// COMPONENTES REUTILIZÁVEIS E TIPAGENS
// ==========================================
const CopreLogo = ({ className = "text-3xl" }: { className?: string }) => (
  <span className={`tracking-tighter text-gray-950 flex items-center ${className} font-sans`}>
    <span className="font-extrabold tracking-[-0.05em]">CO</span>
    <span className="font-light italic ml-[2px] tracking-normal">PÊ.</span>
  </span>
);

interface ProductVariation {
  id: string;
  cor_nome: string;
  cor_hex: string;
  mainImagesText: string;
  galleryImagesText: string;
  estoque: { PP: number; P: number; M: number; G: number; GG: number; [key: string]: number };
}

// ==========================================
// PAINEL ADMIN PRINCIPAL
// ==========================================
export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('produtos');

  // ==========================================
  // ESTADOS E LÓGICA GERAIS
  // ==========================================
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  
  // Feedback Visual Produtos
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Base do Produto
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodSubcategory, setProdSubcategory] = useState('');
  const [prodGender, setProdGender] = useState('MENS');
  const [prodIsNew, setProdIsNew] = useState(false);
  const [prodDesc, setProdDesc] = useState('');

  // Variações
  const [variations, setVariations] = useState<ProductVariation[]>([{
    id: 'var_inicial', cor_nome: 'Original', cor_hex: '#111827', mainImagesText: '', galleryImagesText: '', estoque: { PP: 0, P: 0, M: 0, G: 0, GG: 0 }
  }]);
  const [activeVarId, setActiveVarId] = useState('var_inicial');

  // ==========================================
  // ESTADOS E LÓGICA DE CATEGORIAS
  // ==========================================
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSavingCat, setIsSavingCat] = useState(false);
  
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedParentCat, setSelectedParentCat] = useState('');
  const [isSavingSubcat, setIsSavingSubcat] = useState(false);

  const [catMessage, setCatMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  // Busca inicial
  useEffect(() => {
    if (isLogged) {
      const fetchCats = async () => {
        const { data: catData } = await supabase.from('categorias').select('*');
        const { data: subData } = await supabase.from('subcategorias').select('*');
        if (catData) setCategories(catData);
        if (subData) setSubcategories(subData);
      };
      fetchCats();
    }
  }, [isLogged]);

  const parseLinksToArray = (text: string) => {
    return text.split('\n').map(link => link.trim()).filter(link => link !== '');
  };

  // --- SALVAR PRODUTO ---
  const handleSaveProduct = async () => {
    setFormError(null);

    if (!prodName || !prodPrice || !prodCategory || !prodSubcategory) {
      setFormError("Por favor, preencha todos os campos obrigatórios da 'Informação Base' (Nome, Preço e Categorias).");
      setTimeout(() => setFormError(null), 5000);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const slug = prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + prodGender.toLowerCase();

      const { data: newProd, error: prodErr } = await supabase.from('produtos').insert({
        nome: prodName,
        slug: slug,
        descricao: prodDesc,
        preco: parseFloat(prodPrice),
        categoria_id: prodCategory,
        subcategoria_id: prodSubcategory,
        genero: prodGender,
        is_new: prodIsNew,
        ativo: true
      }).select().single();

      if (prodErr) throw prodErr;

      for (const vari of variations) {
        const uploadedMain = parseLinksToArray(vari.mainImagesText);
        const uploadedGallery = parseLinksToArray(vari.galleryImagesText);

        const { data: newVar, error: varErr } = await supabase.from('produto_variacoes').insert({
          produto_id: newProd.id, 
          cor_nome: vari.cor_nome,
          cor_hex: vari.cor_hex,
          imagens_principais: uploadedMain,
          imagens_galeria: uploadedGallery
        }).select().single();

        if (varErr) throw varErr;

        const stockToInsert = Object.entries(vari.estoque)
          .filter(([_, qtd]) => Number(qtd) > 0) 
          .map(([tamanho, qtd]) => ({
            variacao_id: newVar.id, 
            tamanho: tamanho,
            quantidade: Number(qtd)
          }));

        if (stockToInsert.length > 0) {
          const { error: stockErr } = await supabase.from('estoque').insert(stockToInsert);
          if (stockErr) throw stockErr;
        }
      }

      setSaveSuccess(true);
      setProdName(''); setProdPrice(''); setProdDesc('');
      setVariations([{ id: 'var_inicial', cor_nome: 'Original', cor_hex: '#111827', mainImagesText: '', galleryImagesText: '', estoque: { PP: 0, P: 0, M: 0, G: 0, GG: 0 } }]);
      
      setTimeout(() => setSaveSuccess(false), 4000);

    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      setFormError("Erro interno ao salvar: " + error.message);
      setTimeout(() => setFormError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // --- SALVAR CATEGORIAS E SUBCATEGORIAS ---
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsSavingCat(true);
    setCatMessage(null);
    
    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { data, error } = await supabase.from('categorias').insert({ nome: newCategoryName, slug }).select().single();
      
      if (error) throw error;
      
      setCategories([...categories, data]);
      setNewCategoryName('');
      setCatMessage({ type: 'success', text: `Categoria "${data.nome}" criada com sucesso!` });
      setTimeout(() => setCatMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setCatMessage({ type: 'error', text: 'Erro ao criar: ' + err.message });
      setTimeout(() => setCatMessage(null), 5000);
    } finally {
      setIsSavingCat(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedParentCat) {
      setCatMessage({ type: 'error', text: 'Selecione uma categoria pai e digite o nome.' });
      setTimeout(() => setCatMessage(null), 4000);
      return;
    }
    setIsSavingSubcat(true);
    setCatMessage(null);
    
    try {
      const slug = newSubcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const { data, error } = await supabase.from('subcategorias').insert({ 
        nome: newSubcategoryName, 
        slug: slug,
        categoria_id: selectedParentCat 
      }).select().single();
      
      if (error) throw error;
      
      setSubcategories([...subcategories, data]);
      setNewSubcategoryName('');
      setSelectedParentCat('');
      setCatMessage({ type: 'success', text: `Subcategoria "${data.nome}" criada com sucesso!` });
      setTimeout(() => setCatMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setCatMessage({ type: 'error', text: 'Erro ao criar: ' + err.message });
      setTimeout(() => setCatMessage(null), 5000);
    } finally {
      setIsSavingSubcat(false);
    }
  };

  // Funções Auxiliares de Variação
  const addVariation = () => {
    const newId = Math.random().toString(36).substring(7);
    setVariations([...variations, { id: newId, cor_nome: 'Nova Cor', cor_hex: '#FFFFFF', mainImagesText: '', galleryImagesText: '', estoque: { PP: 0, P: 0, M: 0, G: 0, GG: 0 } }]);
    setActiveVarId(newId);
  };

  const removeVariation = (idToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (variations.length <= 1) {
      setFormError("O produto precisa ter pelo menos uma cor.");
      setTimeout(() => setFormError(null), 3000);
      return;
    }
    const newVars = variations.filter(v => v.id !== idToRemove);
    setVariations(newVars);
    if (activeVarId === idToRemove) {
      setActiveVarId(newVars[0].id);
    }
  };

  const updateActiveVariation = (field: keyof ProductVariation, value: any) => {
    setVariations(variations.map(v => v.id === activeVarId ? { ...v, [field]: value } : v));
  };

  const updateActiveStock = (size: string, qty: number) => {
    setVariations(variations.map(v => {
      if (v.id === activeVarId) {
        return { ...v, estoque: { ...v.estoque, [size]: qty } };
      }
      return v;
    }));
  };

  const activeVariation = variations.find(v => v.id === activeVarId)!;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      setIsLogged(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUsername('');
    setPassword('');
    setActiveTab('dashboard');
  };

  if (!isLogged) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 flex items-center justify-center p-4 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 shadow-2xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-10 flex flex-col items-center">
            <CopreLogo className="text-5xl mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mt-2">Syndicate Control</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5 flex items-center"><User className="w-3.5 h-3.5 mr-1.5 text-gray-950" /> Administrador</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 p-3 text-sm text-gray-950 placeholder-gray-400 focus:border-black outline-none transition-colors" placeholder="admin" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5 flex items-center"><Lock className="w-3.5 h-3.5 mr-1.5 text-gray-950" /> Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 p-3 text-sm text-gray-950 placeholder-gray-400 focus:border-black outline-none transition-colors" placeholder="***" />
            </div>
            {loginError && <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">Credenciais inválidas.</p>}
            <button type="submit" className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors mt-4">Autenticar</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-8 font-sans">
      <div>
        <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Visão Geral</h2>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o desempenho da sua loja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Vendas do Mês</p>
            <h3 className="text-3xl font-light text-gray-950">R$ 24.500,00</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12% vs mês anterior</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full"><DollarSign className="w-5 h-5 text-gray-700" strokeWidth={1.5} /></div>
        </div>
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Pedidos Realizados</p>
            <h3 className="text-3xl font-light text-gray-950">128</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +5% vs mês anterior</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full"><ShoppingBag className="w-5 h-5 text-gray-700" strokeWidth={1.5} /></div>
        </div>
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Ticket Médio</p>
            <h3 className="text-3xl font-light text-gray-950">R$ 191,40</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">Estável</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full"><CreditCard className="w-5 h-5 text-gray-700" strokeWidth={1.5} /></div>
        </div>
      </div>
    </div>
  );

  const renderProdutos = () => (
    <div className="animate-in fade-in duration-500 space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Cadastro de Produtos</h2>
          <p className="text-sm text-gray-500 mt-1">Crie o produto, configure as cores, links das imagens e o estoque.</p>
        </div>
        <button 
          onClick={handleSaveProduct}
          disabled={isSaving}
          className="flex items-center bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} 
          {isSaving ? 'Salvando...' : 'Salvar Produto Completo'}
        </button>
      </div>

      <AnimatePresence>
        {formError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-50 text-red-800 p-4 border border-red-200 flex items-center text-xs font-bold uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 mr-2" /> {formError}
          </motion.div>
        )}
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-emerald-50 text-emerald-700 p-4 border border-emerald-200 flex items-center text-xs font-bold uppercase tracking-widest">
            <CheckCircle className="w-4 h-4 mr-2" /> Produto criado com sucesso!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BLOCO 1: INFORMAÇÕES BASE */}
        <div className="lg:col-span-3 bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-950 border-b border-gray-100 pb-4">1. Informações Base</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em] mb-1.5">Nome do Produto</label>
              <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} placeholder="Ex: Race Core Jersey" className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 placeholder-gray-400 focus:bg-white focus:border-black outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em] mb-1.5">Preço (R$)</label>
              <input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="0.00" className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 placeholder-gray-400 focus:bg-white focus:border-black outline-none transition-colors" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em] mb-1.5">Categoria Principal</label>
              <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors">
                <option value="">Selecione...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em] mb-1.5">Subcategoria</label>
              <select value={prodSubcategory} onChange={e => setProdSubcategory(e.target.value)} className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors">
                <option value="">Selecione...</option>
                {subcategories.filter(s => s.categoria_id === prodCategory).map(s => (
                  <option key={s.id} value={s.id}>{s.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em] mb-1.5">Gênero</label>
              <select value={prodGender} onChange={e => setProdGender(e.target.value)} className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors">
                <option value="MENS">Masculino (MENS)</option>
                <option value="WOMENS">Feminino (WOMENS)</option>
                <option value="UNISEX">Unissex</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={prodIsNew} onChange={e => setProdIsNew(e.target.checked)} className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded-none" />
              <span className="text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em]">Selo "Novo Lançamento"</span>
            </label>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-[0.2em] mb-1.5">Descrição Editorial</label>
            <textarea value={prodDesc} onChange={e => setProdDesc(e.target.value)} rows={3} placeholder="Manifesto do produto..." className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 placeholder-gray-400 focus:bg-white focus:border-black outline-none resize-none transition-colors"></textarea>
          </div>
        </div>

        {/* BLOCO 2: GESTÃO DE CORES */}
        <div className="lg:col-span-3 bg-gray-50 border border-gray-200">
          
          <div className="flex border-b border-gray-200 bg-white overflow-x-auto hide-scrollbar">
            {variations.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVarId(v.id)}
                className={`px-6 py-4 flex items-center text-xs font-bold uppercase tracking-widest border-b-2 whitespace-nowrap transition-colors group ${activeVarId === v.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
              >
                <span className="w-3 h-3 rounded-full mr-2 border border-gray-200" style={{ backgroundColor: v.cor_hex }}></span>
                {v.cor_nome}
                {variations.length > 1 && (
                  <div 
                    onClick={(e) => removeVariation(v.id, e)}
                    className={`ml-3 transition-colors ${activeVarId === v.id ? 'text-gray-300 hover:text-red-500' : 'opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500'}`}
                    title="Excluir Cor"
                  >
                    <Trash2 className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
            <button onClick={addVariation} className="px-6 py-4 flex items-center text-xs font-bold uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 transition-colors">
              <Plus className="w-3 h-3 mr-1" /> Nova Cor
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 mb-4 border-b border-gray-100 pb-2">Identidade Visual</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Nome da Cor</label>
                    <input type="text" value={activeVariation.cor_nome} onChange={e => updateActiveVariation('cor_nome', e.target.value)} className="w-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Cor Hexadecimal</label>
                    <div className="flex space-x-2">
                      <input type="text" value={activeVariation.cor_hex} onChange={e => updateActiveVariation('cor_hex', e.target.value)} className="flex-1 border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors" />
                      <div className="w-10 h-10 border border-gray-300" style={{ backgroundColor: activeVariation.cor_hex }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 shadow-sm border border-gray-100">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-950 mb-4 border-b border-gray-100 pb-2">Estoque Físico</h4>
                <div className="space-y-2">
                  {['PP', 'P', 'M', 'G', 'GG'].map(size => (
                    <div key={size} className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-950">{size}</span>
                      <input 
                        type="number" min="0"
                        value={activeVariation.estoque[size]}
                        onChange={e => updateActiveStock(size, parseInt(e.target.value) || 0)}
                        className="w-20 border border-gray-300 bg-gray-50 p-1.5 text-sm text-gray-950 text-center focus:bg-white focus:border-black outline-none transition-colors" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8 bg-white p-8 shadow-sm border border-gray-100">
              <div>
                <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1.5">Imagens Principais (Vitrines da Home)</label>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">Cole EXATAMENTE 2 links gerados no ImageKit (Frente e Costas). Um link por linha.</p>
                <textarea 
                  value={activeVariation.mainImagesText} 
                  onChange={e => updateActiveVariation('mainImagesText', e.target.value)} 
                  rows={3} 
                  placeholder="https://ik.imagekit.io/...&#10;https://ik.imagekit.io/..." 
                  className="w-full border border-gray-300 bg-blue-50/30 p-3 text-xs text-gray-950 focus:bg-white focus:border-black outline-none resize-none transition-colors leading-relaxed"
                />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-1.5">Galeria do Produto (Carrossel Interno)</label>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">Cole quantos links quiser (Fotos da modelo, detalhes). Um link por linha.</p>
                <textarea 
                  value={activeVariation.galleryImagesText} 
                  onChange={e => updateActiveVariation('galleryImagesText', e.target.value)} 
                  rows={6} 
                  placeholder="https://ik.imagekit.io/...&#10;https://ik.imagekit.io/...&#10;https://ik.imagekit.io/..." 
                  className="w-full border border-gray-300 bg-emerald-50/30 p-3 text-xs text-gray-950 focus:bg-white focus:border-black outline-none resize-none transition-colors leading-relaxed"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  const renderCategorias = () => (
    <div className="animate-in fade-in duration-500 space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Estrutura do Catálogo</h2>
          <p className="text-sm text-gray-500 mt-1">Gerencie a taxonomia dos produtos.</p>
        </div>
      </div>
      
      <AnimatePresence>
        {catMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 border flex items-center text-xs font-bold uppercase tracking-widest ${catMessage.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
            {catMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            {catMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Criar Categoria */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-950 border-b border-gray-100 pb-4">Criar Categoria Principal</h3>
          <input 
            type="text" 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Ex: ROUPAS" 
            className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors" 
          />
          <button 
            onClick={handleAddCategory}
            disabled={isSavingCat}
            className="w-full flex items-center justify-center bg-black text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 disabled:opacity-70"
          >
            {isSavingCat ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar Categoria'}
          </button>
        </div>

        {/* Criar Subcategoria */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-950 border-b border-gray-100 pb-4">Criar Subcategoria</h3>
          <select 
            value={selectedParentCat}
            onChange={(e) => setSelectedParentCat(e.target.value)}
            className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors"
          >
            <option value="">Selecione a Categoria Pai...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <input 
            type="text" 
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            placeholder="Ex: JERSEY" 
            className="w-full border border-gray-300 bg-gray-50 p-3 text-sm text-gray-950 focus:bg-white focus:border-black outline-none transition-colors" 
          />
          <button 
            onClick={handleAddSubcategory}
            disabled={isSavingSubcat}
            className="w-full flex items-center justify-center bg-black text-white py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 disabled:opacity-70"
          >
             {isSavingSubcat ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar Subcategoria'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderPedidos = () => (
    <div className="animate-in fade-in duration-500 space-y-8 font-sans">
      <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Gerenciar Pedidos</h2>
      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 border-b border-gray-100">
            <tr>
              <th className="p-5">Pedido</th>
              <th className="p-5">Data</th>
              <th className="p-5">Cliente</th>
              <th className="p-5">Status de Envio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-5 font-bold text-gray-950">#1006</td>
              <td className="p-5 text-xs font-medium">18 Mar 2026</td>
              <td className="p-5 font-medium">Marcos Jr</td>
              <td className="p-5">Preparando</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center justify-center px-8 border-b border-gray-100">
           <CopreLogo className="text-3xl" />
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          <p className="px-4 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Painel de Controle</p>
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}><LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard</button>
          <button onClick={() => setActiveTab('produtos')} className={`w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'produtos' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}><Package className="w-4 h-4 mr-3" /> Produtos</button>
          <button onClick={() => setActiveTab('categorias')} className={`w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'categorias' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}><Tags className="w-4 h-4 mr-3" /> Categorias</button>
          <button onClick={() => setActiveTab('pedidos')} className={`w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'pedidos' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}><ShoppingBag className="w-4 h-4 mr-3" /> Pedidos</button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-600 transition-colors"><LogOut className="w-4 h-4 mr-3" /> Sair</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8">
          <div className="flex items-center space-x-4 cursor-pointer hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">M</div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Marcos Jr</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'produtos' && renderProdutos()}
          {activeTab === 'categorias' && renderCategorias()}
          {activeTab === 'pedidos' && renderPedidos()}
        </div>
      </main>
    </div>
  );
}