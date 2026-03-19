'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

// Tipagem rigorosa para os dados do formulário
interface FormData {
  nome: string; sobrenome: string;
  cep: string; rua: string; numero: string; bairro: string; complemento: string; cidade: string; estado: string;
  email: string; password: ''; confirmPassword: '';
}

// Tipagem rigorosa para o nosso Input customizado
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
}

// Definição das Etapas
const steps = [
  { id: 1, name: 'Dados Pessoais', icon: User },
  { id: 2, name: 'Endereço de Entrega', icon: MapPin },
  { id: 3, name: 'Acesso', icon: Lock },
];

// ------------------------------------------------------------------
// CORREÇÃO: O InputField agora vive FORA da função principal.
// Assim o React não destrói e recria o campo a cada letra digitada!
// ------------------------------------------------------------------
const InputField = ({ label, icon: Icon, className = '', ...props }: InputFieldProps) => (
  <div>
    <label className="block text-xs font-semibold text-gray-900 uppercase tracking-widest mb-1.5 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" strokeWidth={1.5} />}
      {label}
    </label>
    <input
      className={`block w-full border-gray-300 border p-3.5 text-base text-gray-900 placeholder-gray-400 focus:ring-black focus:border-black transition-colors ${className}`}
      {...props}
    />
  </div>
);

// Variantes de Animação (Framer Motion)
const variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

// COMPONENTE PRINCIPAL
export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nome: '', sobrenome: '',
    cep: '', rua: '', numero: '', bairro: '', complemento: '', cidade: '', estado: '',
    email: '', password: '', confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cepValue = e.target.value.replace(/\D/g, ''); 
    setFormData({ ...formData, cep: cepValue });

    if (cepValue.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP", error);
      }
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.nome || !formData.sobrenome)) return;
    if (currentStep === 2 && (!formData.cep || !formData.rua || !formData.numero || !formData.bairro || !formData.cidade || !formData.estado)) return;
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      nextStep();
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Dados finais para o Supabase:", formData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-10">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10">
        <Link href="/" className="text-4xl font-bold tracking-tighter text-gray-900">
          MARCOS<span className="font-light">.JR</span>
        </Link>
        <h2 className="mt-8 text-2xl font-light text-gray-950 uppercase tracking-widest">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-10 px-6 sm:px-12 border border-gray-100 shadow-sm sm:rounded-none">
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <>
                <div className="flex items-center justify-between mb-12 relative">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${currentStep >= step.id ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-400'}`}>
                        <step.icon className="w-6 h-6" strokeWidth={1} />
                      </div>
                      <span className={`mt-3 text-[11px] font-bold uppercase tracking-wider ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>{step.name}</span>
                    </div>
                  ))}
                  <div className="absolute top-6 left-0 h-0.5 bg-gray-100 w-full z-0">
                    <div className="absolute top-0 left-0 h-full bg-black transition-all duration-300" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div key="step1" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <InputField label="Nome" name="nome" value={formData.nome} onChange={handleChange} required placeholder="João" />
                        <InputField label="Sobrenome" name="sobrenome" value={formData.sobrenome} onChange={handleChange} required placeholder="Silva" />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-1">
                          <InputField label="CEP" name="cep" maxLength={8} value={formData.cep} onChange={handleCepChange} required placeholder="00000000" />
                        </div>
                        <div className="col-span-2">
                          <InputField label="Rua" name="rua" value={formData.rua} onChange={handleChange} required placeholder="Rua das Flores" className="bg-gray-50" readOnly />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <InputField label="Número" name="numero" value={formData.numero} onChange={handleChange} required placeholder="123" />
                        <div className="col-span-2">
                          <InputField label="Complemento" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Apto 101, Bloco B (Opcional)" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <InputField label="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} required placeholder="Centro" className="bg-gray-50" readOnly />
                        <InputField label="Cidade" name="cidade" value={formData.cidade} onChange={handleChange} required placeholder="São Paulo" className="bg-gray-50" readOnly />
                        <InputField label="Estado" name="estado" value={formData.estado} onChange={handleChange} required placeholder="SP" className="bg-gray-50" readOnly />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                      <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="joao.silva@email.com" icon={Mail} />
                      <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                          <InputField label="Senha" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required icon={Lock} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3.5 right-4 text-gray-500 hover:text-gray-900 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="relative">
                          <InputField label="Confirmar Senha" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required icon={Lock} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute bottom-3.5 right-4 text-gray-500 hover:text-gray-900 transition-colors">
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-4 pt-10 border-t border-gray-100 mt-12">
                  {currentStep > 1 && (
                    <button type="button" onClick={prevStep} className="px-8 py-4 border border-gray-200 text-sm font-bold uppercase tracking-widest text-gray-600 hover:border-black hover:text-black transition-all">
                      Voltar
                    </button>
                  )}
                  <button type="submit" className="flex-1 flex justify-center items-center py-4 px-8 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors group">
                    {currentStep === steps.length ? 'Finalizar Cadastro' : 'Próximo Passo'}
                    <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </>
            )}

            {isLogin && (
              <motion.div key="login" variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                 <InputField label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="seu@email.com" icon={Mail} />
                 <div className="relative">
                   <InputField label="Senha" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required icon={Lock} />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute bottom-3.5 right-4 text-gray-500 hover:text-gray-900 transition-colors">
                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                 </div>
                 <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors">
                   Entrar
                 </button>
              </motion.div>
            )}
          </form>

          <div className="mt-10 text-center pt-8 border-t border-gray-100">
            <button 
              onClick={() => { setIsLogin(!isLogin); setCurrentStep(1); }} 
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors underline underline-offset-4"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}