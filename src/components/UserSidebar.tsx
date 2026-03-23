'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, User, MapPin, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertTriangle, CheckCircle, Package, Settings, LogOut } from 'lucide-react';
import { useUI } from '@/context/UIContext'; 
import { supabase } from '@/lib/supabase';

// ==========================================
// LOGO COPRÊ
// ==========================================
const CopreLogo = ({ className = "text-2xl" }: { className?: string }) => (
  <span className={`tracking-tighter text-gray-950 flex items-center ${className} font-sans`}>
    <span className="font-extrabold tracking-[-0.05em]">CO</span>
    <span className="font-light italic ml-[2px] tracking-normal">PRÊ.</span>
  </span>
);

// --- Tipagens Rigorosas ---
interface FormData {
  nome: string; sobrenome: string;
  cep: string; rua: string; numero: string; bairro: string; complemento: string; cidade: string; estado: string;
  email: string; password: ''; confirmPassword: '';
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
}

// --- Definição das Etapas do Cadastro ---
const steps = [
  { id: 1, name: 'Pessoal', icon: User },
  { id: 2, name: 'Endereço', icon: MapPin },
  { id: 3, name: 'Acesso', icon: Lock },
];

// --- Sub-componente de Input ---
const InputField = ({ label, icon: Icon, className = '', ...props }: InputFieldProps) => (
  <div className="w-full">
    <label className="block text-[10px] font-bold text-gray-950 uppercase tracking-widest mb-1 flex items-center">
      {Icon && <Icon className="w-3.5 h-3.5 mr-1.5 text-gray-600" strokeWidth={1.5} />}
      {label}
    </label>
    <input
      className={`block w-full border-gray-300 border p-3 text-sm text-gray-950 placeholder-gray-400 focus:ring-black focus:border-black transition-colors ${className}`}
      {...props}
    />
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function UserSidebar() {
  const { isUserSidebarOpen, closeUserSidebar } = useUI(); 

  // Estados de Autenticação Real
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Estados do Formulário
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true); 

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nome: '', sobrenome: '',
    cep: '', rua: '', numero: '', bairro: '', complemento: '', cidade: '', estado: '',
    email: '', password: '', confirmPassword: '',
  });

  // --- Efeito: Monitora o Status de Login do Supabase ---
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsAuthLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserName('');
        setIsAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('nome')
        .eq('id', userId)
        .single();
      
      if (data) setUserName(data.nome);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    await supabase.auth.signOut();
    setCurrentStep(1);
    setIsLogin(true);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebarAndReset();
    };
    if (isUserSidebarOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isUserSidebarOpen]);

  const closeSidebarAndReset = () => {
    closeUserSidebar();
    setTimeout(() => {
      setCurrentStep(1);
      setIsLogin(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setFormData({
        nome: '', sobrenome: '', cep: '', rua: '', numero: '', bairro: '', complemento: '', cidade: '', estado: '', email: '', password: '', confirmPassword: '',
      });
    }, 300); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) setErrorMsg(null); 
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepValue = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cep: cepValue });

    if (cepValue.length === 8) {
      if (errorMsg) setErrorMsg(null);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev, rua: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf
          }));
        } else {
            setErrorMsg("CEP não encontrado.");
        }
      } catch (error) { 
          setErrorMsg("Erro ao buscar CEP. Tente preencher manualmente.");
      }
    }
  };

  const getPortugueseErrorMessage = (error: any): string => {
    if (!error || !error.message) return "Ocorreu um erro inesperado. Tente novamente.";
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
    if (msg.includes("email not confirmed")) return "E-mail não confirmado. Verifique sua caixa de entrada ou spam.";
    if (msg.includes("password should be at least 6 characters")) return "A senha deve ter pelo menos 6 caracteres.";
    if (msg.includes("user already registered")) return "Este e-mail já está cadastrado em nossa loja.";
    if (msg.includes("invalid email")) return "Por favor, insira um endereço de e-mail válido.";
    if (msg.includes("fetch") || msg.includes("network")) return "Erro de conexão. Verifique sua internet.";
    return "Não foi possível concluir a ação no momento. Tente novamente.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isLogin && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMsg("As senhas digitadas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error; 
        
        setSuccessMsg("Carregando sua conta...");

      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError; 
        if (!authData.user) throw new Error("Falha ao criar usuário.");

        const { error: dbError } = await supabase
          .from('usuarios') 
          .insert({
            id: authData.user.id, 
            nome: formData.nome,
            sobrenome: formData.sobrenome,
            email: formData.email, 
            cep: formData.cep,
            rua: formData.rua,
            numero: formData.numero,
            bairro: formData.bairro,
            complemento: formData.complemento || null,
            cidade: formData.cidade,
            estado: formData.estado
          });

        if (dbError) throw new Error("Erro ao salvar endereço no banco de dados.");

        setSuccessMsg("Conta criada! Verifique seu e-mail para confirmar.");
      }

    } catch (error: any) {
      const translatedMessage = getPortugueseErrorMessage(error);
      setErrorMsg(translatedMessage);
      console.error("Erro original (Supabase):", error); 
    } finally {
      setIsLoading(false);
    }
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const sidebarVariants: Variants = {
    hidden: { x: '100%' },
    visible: { x: '0%', transition: { type: 'spring', stiffness: 300, damping: 30 } }, 
    exit: { x: '100%', transition: { ease: 'easeInOut', duration: 0.3 } },
  };

  const stepVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <AnimatePresence>
      {isUserSidebarOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeSidebarAndReset} 
          />

          <motion.div
            key="sidebar"
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-lg bg-white shadow-2xl z-[101] flex flex-col p-6 sm:px-10 sm:py-8 border-l border-gray-100 overflow-hidden"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header Comum */}
            <div className="flex items-center justify-between mb-6">
              {/* LOGO ATUALIZADA AQUI */}
              <CopreLogo className="text-2xl" />
              
              <button 
                onClick={closeSidebarAndReset}
                className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {isAuthLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
              </div>
            ) : currentUser ? (
              
              // ==========================================
              // TELA DE USUÁRIO LOGADO
              // ==========================================
              <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                <div className="mb-10 pt-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Syndicate Member</p>
                  <h2 className="text-3xl font-light text-gray-950 uppercase tracking-tighter">
                    {userName || 'Ciclista'}
                  </h2>
                </div>

                <nav className="flex-1 flex flex-col space-y-2">
                  <Link 
                    href="/minha-conta" 
                    onClick={closeSidebarAndReset}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 mr-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Minha Conta</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link 
                    href="/minhas-compras" 
                    onClick={closeSidebarAndReset}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center">
                      <Package className="w-4 h-4 mr-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Histórico de Pedidos</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link 
                    href="/meu-endereco" 
                    onClick={closeSidebarAndReset}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-4 text-gray-400 group-hover:text-black transition-colors" strokeWidth={1.5} />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Endereço de Entrega</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
                  </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center p-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
                    Sair da Conta
                  </button>
                </div>
              </div>

            ) : (

              // ==========================================
              // TELA DE LOGIN / CADASTRO
              // ==========================================
              <div className="flex-1 flex flex-col">
                <h2 className="text-3xl font-light tracking-tighter text-gray-950 uppercase mb-8">
                  {isLogin ? 'Acessar Conta' : 'Criar Conta'}
                </h2>

                <AnimatePresence mode="wait">
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="bg-red-50 border border-red-200 text-red-800 p-3 mb-4 flex items-center text-xs font-medium">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500 shrink-0" strokeWidth={1.5} />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                  {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 mb-4 flex items-center text-xs font-medium">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 shrink-0" strokeWidth={1.5} />
                      <span>{successMsg}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form className="flex-1 flex flex-col min-h-0" onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-8 relative">
                        {steps.map((step) => (
                          <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${currentStep >= step.id ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                              <step.icon className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                            <span className={`mt-2 text-[9px] font-bold uppercase tracking-wider ${currentStep >= step.id ? 'text-gray-950' : 'text-gray-400'}`}>{step.name}</span>
                          </div>
                        ))}
                        <div className="absolute top-4 left-0 h-[1px] bg-gray-100 w-full z-0">
                          <div className="absolute top-0 left-0 h-full bg-black transition-all duration-300" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
                        </div>
                      </div>

                      <div className="flex-1 relative">
                        <AnimatePresence mode="wait">
                          {currentStep === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-4 absolute w-full">
                              <div className="grid grid-cols-2 gap-4">
                                <InputField label="Nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="João" />
                                <InputField label="Sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} required placeholder="Silva" />
                              </div>
                            </motion.div>
                          )}

                          {currentStep === 2 && (
                            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-3 absolute w-full">
                              <div className="grid grid-cols-4 gap-3">
                                <div className="col-span-2">
                                  <InputField label="CEP" name="cep" maxLength={8} value={formData.cep} onChange={handleCepChange} required placeholder="00000000" />
                                </div>
                                <div className="col-span-2">
                                  <InputField label="Número" name="numero" value={formData.numero} onChange={handleChange} required placeholder="123" />
                                </div>
                              </div>
                              <InputField label="Rua" name="rua" value={formData.rua} onChange={handleChange} required placeholder="Rua das Flores" className="bg-gray-50" readOnly />
                              <InputField label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Opcional" />
                              <div className="grid grid-cols-2 gap-3">
                                <InputField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} required className="bg-gray-50" readOnly />
                                <InputField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} required className="bg-gray-50" readOnly />
                              </div>
                            </motion.div>
                          )}

                          {currentStep === 3 && (
                            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2 }} className="space-y-4 absolute w-full">
                              <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seu@email.com" icon={Mail} />
                              <div className="grid grid-cols-1 gap-4">
                                <div className="relative">
                                  <InputField label="Senha" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required icon={Lock} />
                                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3 right-3 text-gray-400 hover:text-black">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                                <div className="relative">
                                  <InputField label="Confirmar Senha" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required icon={Lock} />
                                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute bottom-3 right-3 text-gray-400 hover:text-black">
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="mt-auto flex items-center gap-3 pt-6 border-t border-gray-100">
                        {currentStep > 1 && (
                          <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} disabled={isLoading} className="px-5 py-4 border border-gray-200 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600 hover:border-black hover:text-black transition-all disabled:opacity-50">
                            Voltar
                          </button>
                        )}
                        <button type="submit" disabled={isLoading} className="flex-1 flex justify-center items-center py-4 px-6 border border-transparent text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black hover:bg-gray-800 transition-colors group disabled:opacity-70">
                          {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                              <>
                                  {currentStep === steps.length ? 'Finalizar' : 'Próximo Passo'}
                                  <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                              </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                       <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seu@email.com" icon={Mail} />
                       <div className="relative">
                         <InputField label="Senha" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required icon={Lock} />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3 right-3 text-gray-400 hover:text-black">
                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                         </button>
                       </div>
                       <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-black hover:bg-gray-800 transition-colors mt-6 disabled:opacity-70">
                         {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
                       </button>
                    </div>
                  )}
                </form>

                <div className="mt-6 text-center pt-5 border-t border-gray-100">
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setCurrentStep(1); setErrorMsg(null); }} 
                    disabled={isLoading}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors underline-offset-4 disabled:opacity-50"
                  >
                    {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}