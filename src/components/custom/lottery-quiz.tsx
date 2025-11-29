'use client';

import { useState } from 'react';
import { Circle, Crown, Sparkles, TrendingUp, Target, Zap, CheckCircle2, ArrowRight, Star, Trophy, Clock, Shield, AlertTriangle, Flame, DollarSign } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    icon: any;
  }[];
}

interface QuizResult {
  profile: string;
  title: string;
  description: string;
  benefits: string[];
  urgency: string;
  cta: string;
  warning: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Você está PERDENDO dinheiro jogando na loteria?",
    options: [
      { text: "Sim, jogo sem estratégia e nunca ganho nada", value: "losing", icon: AlertTriangle },
      { text: "Às vezes ganho, mas poderia ser muito melhor", value: "occasional", icon: Target },
      { text: "Ganho pouco, mas sei que posso ganhar MUITO mais", value: "small", icon: TrendingUp },
      { text: "Ainda não jogo, mas quero começar GANHANDO", value: "never", icon: Sparkles }
    ]
  },
  {
    id: 2,
    question: "Quanto DINHEIRO você já deixou de ganhar por não ter as ferramentas certas?",
    options: [
      { text: "Milhares! Escolho números aleatórios e nunca acerto", value: "thousands", icon: DollarSign },
      { text: "Centenas, mas sei que posso reverter isso AGORA", value: "hundreds", icon: Flame },
      { text: "Não sei, mas NÃO quero perder mais nenhum centavo", value: "unknown", icon: Shield },
      { text: "Ainda não perdi, mas quero GARANTIR que não vou perder", value: "none", icon: Crown }
    ]
  },
  {
    id: 3,
    question: "O que te impede de MULTIPLICAR seus ganhos HOJE?",
    options: [
      { text: "Falta de estratégia profissional e análise de dados", value: "strategy", icon: Target },
      { text: "Não tenho tempo para estudar padrões e probabilidades", value: "time", icon: Clock },
      { text: "Não confio nos meus números e sempre erro", value: "confidence", icon: AlertTriangle },
      { text: "Não sei quais loterias têm MAIS chances de ganhar", value: "knowledge", icon: TrendingUp }
    ]
  },
  {
    id: 4,
    question: "Se você tivesse acesso a um sistema PROFISSIONAL de geração de números, quanto valeria para você?",
    options: [
      { text: "MUITO! Pagaria até R$ 100/mês para ganhar mais", value: "100", icon: Crown },
      { text: "Pagaria R$ 50/mês se realmente funcionasse", value: "50", icon: Star },
      { text: "Investiria R$ 30/mês para ter vantagem competitiva", value: "30", icon: Zap },
      { text: "Preciso ver resultados REAIS antes de investir", value: "proof", icon: Shield }
    ]
  },
  {
    id: 5,
    question: "ÚLTIMA PERGUNTA: Você está pronto para PARAR DE PERDER e COMEÇAR A GANHAR?",
    options: [
      { text: "SIM! Quero acesso IMEDIATO às ferramentas Premium", value: "yes_now", icon: Flame },
      { text: "SIM! Mas preciso de garantia de satisfação", value: "yes_guarantee", icon: Shield },
      { text: "Talvez... depende do preço e dos benefícios", value: "maybe", icon: Target },
      { text: "Ainda tenho dúvidas, mas estou interessado", value: "doubts", icon: Sparkles }
    ]
  }
];

const getQuizResult = (answers: Record<number, string>): QuizResult => {
  const profiles: Record<string, QuizResult> = {
    aggressive: {
      profile: "aggressive",
      title: "🚨 VOCÊ ESTÁ PERDENDO DINHEIRO AGORA MESMO!",
      description: "Cada segundo sem o Premium é dinheiro que você JOGA FORA. Enquanto você hesita, outros apostadores estão GANHANDO com nossas ferramentas profissionais!",
      benefits: [
        "🔥 Gerações ILIMITADAS - Teste TODAS as estratégias até encontrar a VENCEDORA",
        "💰 Análise de probabilidades em TEMPO REAL - Saiba EXATAMENTE onde investir",
        "🎯 Histórico COMPLETO dos seus jogos - NUNCA mais repita números perdedores",
        "👑 Estratégias EXCLUSIVAS que aumentam suas chances em até 300%",
        "⚡ Suporte PRIORITÁRIO 24/7 - Tire dúvidas e GANHE mais rápido"
      ],
      urgency: "⏰ ÚLTIMA CHANCE: Apenas 23 vagas restantes com 70% OFF! Depois volta para R$ 99,90/mês!",
      cta: "🔥 SIM! QUERO PARAR DE PERDER E COMEÇAR A GANHAR AGORA!",
      warning: "⚠️ ATENÇÃO: Se você FECHAR esta página, perderá esta oferta PARA SEMPRE!"
    },
    strategic: {
      profile: "strategic",
      title: "💎 VOCÊ TEM POTENCIAL DE GANHAR MILHARES!",
      description: "Mas está DESPERDIÇANDO suas chances sem as ferramentas certas. Investidores inteligentes usam DADOS e ESTRATÉGIA - não sorte!",
      benefits: [
        "📊 Análise AVANÇADA de padrões - Descubra os números mais sorteados",
        "🎲 Gerações ILIMITADAS - Crie dezenas de jogos estratégicos por dia",
        "🏆 Comparativo de probabilidades - Escolha a loteria com MAIS chances",
        "💡 Dicas EXCLUSIVAS baseadas em IA e estatística avançada",
        "🔒 Acesso VITALÍCIO a todas as atualizações e novos recursos"
      ],
      urgency: "🔥 OFERTA RELÂMPAGO: R$ 29,90/mês (70% OFF) - Apenas nas próximas 2 HORAS!",
      cta: "💰 QUERO INVESTIR NO MEU SUCESSO AGORA!",
      warning: "⚠️ Mais de 500 pessoas estão vendo esta oferta AGORA. Vagas limitadas!"
    },
    cautious: {
      profile: "cautious",
      title: "⚡ PARE DE JOGAR DINHEIRO FORA!",
      description: "Você está jogando às cegas enquanto outros usam CIÊNCIA e DADOS para ganhar. Quanto tempo mais você vai esperar para ter resultados REAIS?",
      benefits: [
        "✅ Teste GRÁTIS por 7 dias - Veja os resultados antes de pagar",
        "🎯 Gerador INTELIGENTE que escolhe os melhores números para VOCÊ",
        "📱 Praticidade TOTAL - Jogue de qualquer lugar, a qualquer hora",
        "🔔 Lembretes automáticos - NUNCA mais perca um sorteio milionário",
        "💳 Cancele QUANDO QUISER - Sem taxas, sem burocracia"
      ],
      urgency: "🎁 BÔNUS ESPECIAL: 7 dias GRÁTIS + Guia completo de estratégias (valor R$ 97) DE GRAÇA!",
      cta: "🚀 QUERO TESTAR GRÁTIS E COMEÇAR A GANHAR!",
      warning: "⚠️ Esta oferta expira em 15 minutos! Não perca esta oportunidade única!"
    },
    beginner: {
      profile: "beginner",
      title: "🎯 VOCÊ ESTÁ A UM CLIQUE DE MUDAR SUA VIDA!",
      description: "Milhares de pessoas estão GANHANDO enquanto você PENSA. Cada dia que passa é uma oportunidade PERDIDA de ganhar milhões!",
      benefits: [
        "🚀 Sistema COMPLETO para iniciantes - Do zero ao primeiro prêmio",
        "🎓 Guias EXCLUSIVOS sobre cada loteria - Aprenda com os VENCEDORES",
        "🤖 IA que escolhe números com ALTA probabilidade de ganhar",
        "💬 Suporte PREMIUM - Tire TODAS as dúvidas e comece HOJE",
        "🏆 Acesso a comunidade VIP de apostadores que GANHAM"
      ],
      urgency: "🔥 ÚLTIMA CHANCE: Apenas 15 vagas com 70% OFF + 7 dias grátis! Depois R$ 99,90/mês!",
      cta: "⚡ QUERO COMEÇAR A GANHAR HOJE MESMO!",
      warning: "⚠️ URGENTE: Esta oferta é válida APENAS para os próximos 50 cadastros!"
    }
  };

  const q1 = answers[1];
  const q4 = answers[4];
  const q5 = answers[5];

  if (q5 === 'yes_now' || q4 === '100') {
    return profiles.aggressive;
  } else if (q1 === 'losing' || q4 === '50') {
    return profiles.strategic;
  } else if (q5 === 'yes_guarantee' || q5 === 'maybe') {
    return profiles.cautious;
  } else {
    return profiles.beginner;
  }
};

export default function LotteryQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleAnswer = (value: string) => {
    setSelectedOption(value);
    
    setTimeout(() => {
      const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        const quizResult = getQuizResult(newAnswers);
        setResult(quizResult);
        setShowResult(true);
      }
    }, 300);
  };

  const handleSubscribe = () => {
    window.open('https://buy.stripe.com/5kQ14p4Uo3Ez9T3gRn2wU02', '_blank');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header com Urgência */}
          <div className="text-center mb-6">
            <div className="bg-red-600 text-white py-3 px-6 rounded-full inline-block mb-4 animate-pulse">
              <span className="font-bold text-sm sm:text-base flex items-center gap-2">
                <Clock className="w-5 h-5" />
                ⏰ OFERTA EXPIRA EM: 14:59 MINUTOS
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                LotecaBrasil
              </h1>
              <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 animate-pulse" />
            </div>
          </div>

          {/* Resultado AGRESSIVO */}
          <div className="bg-gradient-to-br from-red-900/40 via-slate-900/40 to-orange-900/40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-4 border-red-500 animate-fadeIn">
            {/* Alerta de Urgência */}
            <div className="bg-red-600 rounded-2xl p-4 mb-6 border-2 border-red-400 animate-pulse">
              <p className="text-center font-bold text-lg sm:text-xl flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                {result.warning}
              </p>
            </div>

            {/* Título IMPACTANTE */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 leading-tight text-red-400 drop-shadow-lg">
                {result.title}
              </h2>
              <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto font-bold leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Benefícios EXPLOSIVOS */}
            <div className="bg-gradient-to-br from-orange-600/30 to-red-600/30 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-orange-500">
              <h3 className="text-2xl sm:text-3xl font-black mb-6 flex items-center gap-3 text-orange-400">
                <Crown className="w-8 h-8" />
                O QUE VOCÊ GANHA HOJE:
              </h3>
              <div className="grid gap-4">
                {result.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-black/30 rounded-xl p-5 border-2 border-green-500/50 hover:border-green-400 transition-all duration-300 transform hover:scale-105"
                  >
                    <CheckCircle2 className="w-7 h-7 text-green-400 flex-shrink-0 mt-1" />
                    <span className="text-base sm:text-lg font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgência MÁXIMA */}
            <div className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-2xl p-6 sm:p-8 mb-8 text-center border-4 border-yellow-400 animate-pulse">
              <p className="text-2xl sm:text-3xl font-black mb-2">
                {result.urgency}
              </p>
              <p className="text-lg sm:text-xl font-bold text-yellow-300">
                🔥 Mais de 1.247 pessoas compraram nas últimas 24h!
              </p>
            </div>

            {/* Preço AGRESSIVO */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-black/50 rounded-2xl p-6 border-4 border-red-500 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 text-xs font-bold transform rotate-12 translate-x-2 -translate-y-1">
                  70% OFF
                </div>
                <div className="text-gray-400 text-sm mb-2 line-through">De R$ 99,90/mês</div>
                <div className="text-5xl sm:text-6xl font-black text-green-400 mb-2">R$ 29,90</div>
                <div className="text-base text-gray-300 font-bold">MENOS DE R$ 1 POR DIA!</div>
                <div className="text-xs text-yellow-400 mt-2 font-bold">⚡ Preço volta ao normal em 15 min!</div>
              </div>
              <div className="bg-black/50 rounded-2xl p-6 border-4 border-green-500 text-center">
                <Shield className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <div className="font-black text-xl mb-2 text-green-400">GARANTIA BLINDADA</div>
                <div className="text-sm text-gray-300 font-semibold">
                  ✅ 7 dias para testar TUDO<br/>
                  ✅ Cancele quando quiser<br/>
                  ✅ Reembolso TOTAL garantido
                </div>
              </div>
            </div>

            {/* CTA MEGA AGRESSIVO */}
            <button
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 text-white font-black py-8 px-8 rounded-2xl text-xl sm:text-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 mb-4 border-4 border-yellow-400 animate-pulse"
            >
              <Flame className="w-8 h-8" />
              QUERO INVESTIR NO MEU SUCESSO AGORA!
              <ArrowRight className="w-8 h-8" />
            </button>

            <p className="text-center text-yellow-400 font-bold text-sm mb-6">
              ⚡ CLIQUE AGORA E GARANTA SEU DESCONTO DE 70% ANTES QUE ACABE!
            </p>

            {/* Prova Social AGRESSIVA */}
            <div className="bg-black/50 rounded-2xl p-6 border-2 border-yellow-500 mb-6">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-lg font-bold text-yellow-400">
                  ⭐ 10.847 apostadores JÁ ESTÃO GANHANDO com o Premium!
                </p>
              </div>
              
              {/* Depoimentos IMPACTANTES */}
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {[
                  { name: "Carlos M.", text: "Ganhei R$ 15.000 na Mega-Sena! Melhor investimento da minha vida!", value: "R$ 15k", stars: 5 },
                  { name: "Ana Paula", text: "Em 2 meses já recuperei o investimento e ganhei R$ 3.500!", value: "R$ 3,5k", stars: 5 },
                  { name: "Roberto S.", text: "Acertei a Quina 3 vezes em 1 mês! Sistema FUNCIONA!", value: "R$ 8k", stars: 5 }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border-2 border-green-500/50">
                    <div className="flex gap-1 mb-2">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm mb-2 text-gray-200 font-semibold">"{testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 font-bold">{testimonial.name}</p>
                      <p className="text-green-400 font-black text-sm">{testimonial.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Escassez FINAL */}
            <div className="bg-red-900/50 rounded-2xl p-6 border-2 border-red-500 text-center">
              <p className="text-xl sm:text-2xl font-black text-red-400 mb-2">
                ⚠️ APENAS 23 VAGAS RESTANTES COM ESTE PREÇO!
              </p>
              <p className="text-base text-gray-300 font-bold">
                Depois disso, o preço volta para R$ 99,90/mês e você vai se arrepender de não ter agido AGORA!
              </p>
            </div>

            {/* Botão Secundário (menor destaque) */}
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentQuestion(0);
                setAnswers({});
                setSelectedOption(null);
              }}
              className="w-full mt-6 bg-white/5 hover:bg-white/10 text-gray-400 font-semibold py-3 px-6 rounded-xl transition-all text-sm"
            >
              Refazer o Quiz (e perder esta oferta)
            </button>
          </div>

          {/* Contador de Pessoas Visualizando */}
          <div className="mt-6 text-center">
            <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full animate-pulse">
              <p className="text-sm font-bold">
                🔴 <span className="text-yellow-300">487 pessoas</span> estão vendo esta oferta AGORA!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header com Urgência */}
        <div className="text-center mb-8">
          <div className="bg-red-600 text-white py-2 px-6 rounded-full inline-block mb-4 animate-pulse">
            <span className="font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              OFERTA LIMITADA - RESPONDA RÁPIDO!
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              LotecaBrasil
            </h1>
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
          </div>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 font-bold">
            Descubra quanto dinheiro você está PERDENDO agora!
          </p>
          
          {/* Barra de Progresso */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-400 font-semibold">Pergunta {currentQuestion + 1} de {questions.length}</span>
              <span className="text-orange-400 font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card da Pergunta */}
        <div className="bg-gradient-to-br from-slate-900/40 via-red-900/40 to-orange-900/40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-red-500/50 animate-fadeIn">
          {/* Pergunta */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-red-600 to-orange-600 rounded-full px-6 py-2 mb-6">
              <span className="font-bold text-sm sm:text-base">PERGUNTA {currentQuestion + 1}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4 leading-tight text-orange-400">
              {question.question}
            </h2>
          </div>

          {/* Opções */}
          <div className="grid gap-4">
            {question.options.map((option, index) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.value;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.value)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-left ${
                    isSelected
                      ? 'border-orange-400 bg-gradient-to-r from-orange-500/20 to-red-500/20 scale-105'
                      : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-orange-400/60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white'
                        : 'bg-white/10 text-white group-hover:bg-orange-500/50'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold flex-1">
                      {option.text}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-6 h-6 text-orange-400 animate-scaleIn" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Indicador de Progresso Visual */}
          <div className="flex justify-center gap-2 mt-8">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index < currentQuestion
                    ? 'w-8 bg-green-400'
                    : index === currentQuestion
                    ? 'w-12 bg-orange-500'
                    : 'w-6 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Motivação AGRESSIVA */}
        <div className="mt-8 text-center">
          <div className="bg-red-900/50 rounded-2xl p-4 border-2 border-red-500 inline-block">
            <p className="text-gray-200 text-sm sm:text-base font-bold">
              🔥 <span className="text-orange-400">10.847 apostadores</span> já estão GANHANDO!<br/>
              <span className="text-red-400">Não fique para trás!</span>
            </p>
          </div>
        </div>
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
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
