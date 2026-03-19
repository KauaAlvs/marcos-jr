import { createClient } from '@supabase/supabase-js';

// Pegando as chaves do nosso .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Se as chaves não existirem (esqueceu de colocar no env), ele avisa no console
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Atenção: Variáveis de ambiente do Supabase não encontradas.");
}

// Exportando o cliente para usarmos em qualquer lugar do site
export const supabase = createClient(supabaseUrl, supabaseAnonKey);