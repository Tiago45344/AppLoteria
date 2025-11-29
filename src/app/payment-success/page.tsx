'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Crown, Sparkles, ArrowRight, Trophy, Zap, Star } from 'lucide-react';

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando seu pagamento...');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Obter session_id da URL (Stripe redireciona com esse parâmetro)
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          setStatus('error');
          setMessage('Sessão de pagamento não encontrada');
          return;
        }

        // Verificar pagamento via API
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId: 'user-id-aqui', // TODO: Obter do contexto de autenticação
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Pagamento confirmado! Bem-vindo ao Premium! 🎉');
          
          // Redirecionar para o app após 3 segundos
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Erro ao verificar pagamento');
        }
      } catch (error) {
        console.error('Erro:', error);
        setStatus('error');
        setMessage('Erro ao processar pagamento. Entre em contato com o suporte.');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-green-950 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {status === 'loading' && (
          <div className="bg-gradient-to-br from-slate-900/40 via-emerald-900/40 to-green-900/40 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-emerald-500/50 text-center animate-fadeIn">
            <div className="mb-6">
              <Loader2 className="w-20 h-20 text-emerald-400 mx-auto animate-spin" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-emerald-400">
              Verificando Pagamento
            </h1>
            <p className="text-xl text-gray-300">
              {message}
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-gradient-to-br from-emerald-900/40 via-green-900/40 to-teal-900/40 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-emerald-500 text-center animate-fadeIn">
            {/* Ícone de Sucesso */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
              <CheckCircle2 className="w-24 h-24 text-emerald-400 mx-auto relative animate-scaleIn" />
            </div>

            {/* Título */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                  BEM-VINDO AO PREMIUM!
                </h1>
                <Crown className="w-10 h-10 text-yellow-400 animate-bounce" />
              </div>
              <p className="text-2xl text-emerald-400 font-bold">
                {message}
              </p>
            </div>

            {/* Benefícios Desbloqueados */}
            <div className="bg-black/30 rounded-2xl p-6 mb-8 border-2 border-emerald-500/50">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2 text-yellow-400">
                <Sparkles className="w-6 h-6" />
                Você Desbloqueou:
              </h2>
              <div className="grid gap-3 text-left">
                {[
                  { icon: Zap, text: 'Gerações ILIMITADAS de números' },
                  { icon: Trophy, text: 'Análise avançada de probabilidades' },
                  { icon: Star, text: 'Estratégias exclusivas Premium' },
                  { icon: Crown, text: 'Suporte prioritário 24/7' },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-emerald-900/30 rounded-xl p-4 border border-emerald-500/30"
                  >
                    <benefit.icon className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <span className="text-lg font-semibold text-gray-200">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Redirecionamento */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 mb-6">
              <p className="text-xl font-bold mb-2">
                Redirecionando para o app...
              </p>
              <div className="flex items-center justify-center gap-2 text-emerald-200">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Aguarde alguns segundos</span>
              </div>
            </div>

            {/* Botão Manual */}
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 border-2 border-emerald-400"
            >
              Ir para o App Agora
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-gradient-to-br from-red-900/40 via-slate-900/40 to-orange-900/40 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-red-500/50 text-center animate-fadeIn">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-5xl">⚠️</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-red-400">
              Ops! Algo deu errado
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {message}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Voltar para o Início
              </button>
              <p className="text-sm text-gray-400">
                Se o problema persistir, entre em contato com nosso suporte
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
