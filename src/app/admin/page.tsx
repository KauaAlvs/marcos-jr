'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Lock, 
  User, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  CreditCard,
  Eye,
  Filter
} from 'lucide-react';

export default function AdminPage() {
  // Estado de Login Mockado
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Estado de Navegação do Painel
  const [activeTab, setActiveTab] = useState('dashboard');

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

  // --- TELA DE LOGIN DO ADMIN ---
  if (!isLogged) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 shadow-2xl w-full max-w-md border border-gray-100"
        >
          <div className="text-center mb-10">
            <span className="text-3xl font-bold tracking-tighter text-gray-950 block">
              MARCOS<span className="font-light">.JR</span>
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Painel de Controle</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5 flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Usuário
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Senha
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 text-sm focus:border-black focus:ring-0 outline-none transition-colors"
                placeholder="***"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-medium">Credenciais inválidas. Tente admin / 123.</p>
            )}

            <button type="submit" className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mt-4">
              Acessar Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- COMPONENTES DAS ABAS DO PAINEL ---

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div>
        <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Visão Geral</h2>
        <p className="text-sm text-gray-500 mt-1">Acompanhe o desempenho da sua loja.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Vendas do Mês</p>
            <h3 className="text-3xl font-light text-gray-950">R$ 24.500,00</h3>
            <p className="text-xs text-emerald-600 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12% vs mês anterior</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full"><DollarSign className="w-6 h-6 text-gray-700" strokeWidth={1.5} /></div>
        </div>
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Pedidos Realizados</p>
            <h3 className="text-3xl font-light text-gray-950">128</h3>
            <p className="text-xs text-emerald-600 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +5% vs mês anterior</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full"><ShoppingBag className="w-6 h-6 text-gray-700" strokeWidth={1.5} /></div>
        </div>
        <div className="bg-white p-6 border border-gray-100 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Ticket Médio</p>
            <h3 className="text-3xl font-light text-gray-950">R$ 191,40</h3>
            <p className="text-xs text-gray-500 mt-2">Estável</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full"><CreditCard className="w-6 h-6 text-gray-700" strokeWidth={1.5} /></div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-950">Últimos Pedidos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="p-4">Pedido ID</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Data</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: '#1005', cliente: 'Marcos Jr', data: '18 Mar 2026', status: 'Aprovado', total: 'R$ 1.130,00' },
                { id: '#1004', cliente: 'Carlos Silva', data: '17 Mar 2026', status: 'Preparando', total: 'R$ 450,00' },
                { id: '#1003', cliente: 'Mariana Costa', data: '16 Mar 2026', status: 'Enviado', total: 'R$ 680,00' },
              ].map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-950">{pedido.id}</td>
                  <td className="p-4">{pedido.cliente}</td>
                  <td className="p-4">{pedido.data}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                      pedido.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800' :
                      pedido.status === 'Preparando' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {pedido.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-gray-950">{pedido.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProdutos = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Cadastro de Produtos</h2>
          <p className="text-sm text-gray-500 mt-1">Adicione novos itens ao catálogo da loja.</p>
        </div>
        <button className="flex items-center bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Salvar Produto
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Nome do Produto</label>
            <input type="text" placeholder="Ex: Camisa Pro Air Neo" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Preço (R$)</label>
              <input type="number" placeholder="0.00" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Categoria</label>
              <select className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none bg-white">
                <option>Selecione...</option>
                <option>Roupas</option>
                <option>Acessórios</option>
                <option>Equipamentos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Descrição</label>
            <textarea rows={4} placeholder="Detalhes do produto..." className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none resize-none"></textarea>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-950 mb-4">Imagens</h3>
             <div className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-black hover:bg-gray-50 transition-colors">
               <Package className="w-8 h-8 mx-auto text-gray-400 mb-2" />
               <p className="text-xs font-medium text-gray-500">Clique para fazer upload (Frente e Costas)</p>
             </div>
          </div>

          <div className="bg-white p-8 border border-gray-100 shadow-sm">
             <h3 className="text-sm font-bold uppercase tracking-widest text-gray-950 mb-4">Tamanhos / Estoque</h3>
             <div className="space-y-3">
                {['PP', 'P', 'M', 'G', 'GG'].map(size => (
                  <div key={size} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{size}</span>
                    <input type="number" placeholder="Qtd" className="w-20 border border-gray-300 p-2 text-sm text-center focus:border-black outline-none" />
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategorias = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Categorias</h2>
          <p className="text-sm text-gray-500 mt-1">Gerencie a estrutura do catálogo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-950 border-b border-gray-100 pb-4">Criar Categoria Principal</h3>
          <div>
            <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Nome da Categoria</label>
            <input type="text" placeholder="Ex: Roupas" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
          </div>
          <button className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Adicionar Categoria
          </button>
        </div>

        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-950 border-b border-gray-100 pb-4">Criar Subcategoria</h3>
          <div>
            <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Categoria Pai</label>
            <select className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none bg-white">
              <option>Selecione a categoria principal...</option>
              <option>Roupas</option>
              <option>Acessórios</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1.5">Nome da Subcategoria</label>
            <input type="text" placeholder="Ex: Camisas" className="w-full border border-gray-300 p-3 text-sm focus:border-black outline-none" />
          </div>
          <button className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
            Adicionar Subcategoria
          </button>
        </div>
      </div>
    </div>
  );

  // --- NOVA ABA: PEDIDOS ---
  const renderPedidos = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-gray-950 uppercase tracking-widest">Gerenciar Pedidos</h2>
          <p className="text-sm text-gray-500 mt-1">Visualize e atualize o status dos envios.</p>
        </div>
        <button className="flex items-center border border-gray-300 bg-white text-gray-950 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 mr-2" /> Filtrar
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-5">Pedido</th>
                <th className="p-5">Data</th>
                <th className="p-5">Cliente</th>
                <th className="p-5">Pagamento</th>
                <th className="p-5">Status de Envio</th>
                <th className="p-5 text-right">Total</th>
                <th className="p-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: '#1006', data: '18 Mar 2026, 15:20', cliente: 'Marcos Jr', pag: 'Aprovado', envio: 'Preparando', total: 'R$ 1.130,00' },
                { id: '#1005', data: '18 Mar 2026, 11:05', cliente: 'Kauã Alves', pag: 'Pendente', envio: 'Aguardando', total: 'R$ 450,00' },
                { id: '#1004', data: '17 Mar 2026, 09:15', cliente: 'Pedro Gomes', pag: 'Aprovado', envio: 'Enviado', total: 'R$ 680,00' },
                { id: '#1003', data: '16 Mar 2026, 18:45', cliente: 'Carol', pag: 'Aprovado', envio: 'Entregue', total: 'R$ 550,00' },
              ].map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors items-center">
                  <td className="p-5 font-bold text-gray-950">{pedido.id}</td>
                  <td className="p-5">{pedido.data}</td>
                  <td className="p-5 font-medium">{pedido.cliente}</td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm border ${
                      pedido.pag === 'Aprovado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {pedido.pag}
                    </span>
                  </td>
                  <td className="p-5">
                    <select 
                      className="border border-gray-300 bg-white text-xs font-medium text-gray-700 p-2 focus:border-black focus:ring-0 outline-none w-full max-w-[140px]"
                      defaultValue={pedido.envio}
                    >
                      <option value="Aguardando">Aguardando</option>
                      <option value="Preparando">Preparando</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </td>
                  <td className="p-5 text-right font-medium text-gray-950">{pedido.total}</td>
                  <td className="p-5 text-center">
                    <button className="text-gray-400 hover:text-black transition-colors" title="Ver Detalhes">
                      <Eye className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --- ESTRUTURA PRINCIPAL DO PAINEL (Logado) ---
  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex overflow-hidden">
      
      {/* SIDEBAR ESQUERDA */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <span className="text-2xl font-bold tracking-tighter text-gray-950 block">
            MARCOS<span className="font-light">.JR</span>
          </span>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Menu Principal</p>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" strokeWidth={1.5} /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('produtos')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'produtos' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
          >
            <Package className="w-4 h-4 mr-3" strokeWidth={1.5} /> Produtos
          </button>
          
          <button 
            onClick={() => setActiveTab('categorias')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'categorias' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
          >
            <Tags className="w-4 h-4 mr-3" strokeWidth={1.5} /> Categorias
          </button>

          <button 
            onClick={() => setActiveTab('pedidos')}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'pedidos' ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
          >
            <ShoppingBag className="w-4 h-4 mr-3" strokeWidth={1.5} /> Pedidos
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" strokeWidth={1.5} /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO DIREITA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar leve */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">A</div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </header>

        {/* Área de rolagem do conteúdo */}
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