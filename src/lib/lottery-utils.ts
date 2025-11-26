// Utilitários para geração de jogos e cálculo de probabilidades

import { LotteryType, LotteryConfig } from './types';

// Configurações das loterias brasileiras
export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  'mega-sena': {
    name: 'Mega-Sena',
    description: 'Escolha 6 números de 1 a 60',
    minNumber: 1,
    maxNumber: 60,
    numbersToSelect: 6,
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600'
  },
  'quina': {
    name: 'Quina',
    description: 'Escolha 5 números de 1 a 80',
    minNumber: 1,
    maxNumber: 80,
    numbersToSelect: 5,
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
  },
  'lotomania': {
    name: 'Lotomania',
    description: 'Escolha 50 números de 0 a 99',
    minNumber: 0,
    maxNumber: 99,
    numbersToSelect: 50,
    color: 'from-orange-500 to-red-600',
    gradient: 'bg-gradient-to-br from-orange-500 to-red-600'
  },
  'lotofacil': {
    name: 'Lotofácil',
    description: 'Escolha 15 números de 1 a 25',
    minNumber: 1,
    maxNumber: 25,
    numbersToSelect: 15,
    color: 'from-blue-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600'
  },
  'mega-virada': {
    name: 'Mega da Virada',
    description: 'Escolha 6 números de 1 a 60',
    minNumber: 1,
    maxNumber: 60,
    numbersToSelect: 6,
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600'
  },
  'mais-milionaria': {
    name: '+Milionária',
    description: 'Escolha 6 números de 1 a 50',
    minNumber: 1,
    maxNumber: 50,
    numbersToSelect: 6,
    color: 'from-indigo-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  },
  'timemania': {
    name: 'Timemania',
    description: 'Escolha 10 números de 1 a 80',
    minNumber: 1,
    maxNumber: 80,
    numbersToSelect: 10,
    color: 'from-red-500 to-rose-600',
    gradient: 'bg-gradient-to-br from-red-500 to-rose-600'
  },
  'dupla-sena': {
    name: 'Dupla Sena',
    description: 'Escolha 6 números de 1 a 50',
    minNumber: 1,
    maxNumber: 50,
    numbersToSelect: 6,
    color: 'from-teal-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600'
  },
  'loteca': {
    name: 'Loteca',
    description: 'Palpites em 14 jogos',
    minNumber: 1,
    maxNumber: 3,
    numbersToSelect: 14,
    color: 'from-lime-500 to-green-600',
    gradient: 'bg-gradient-to-br from-lime-500 to-green-600'
  },
  'dia-de-sorte': {
    name: 'Dia de Sorte',
    description: 'Escolha 7 números de 1 a 31',
    minNumber: 1,
    maxNumber: 31,
    numbersToSelect: 7,
    color: 'from-pink-500 to-fuchsia-600',
    gradient: 'bg-gradient-to-br from-pink-500 to-fuchsia-600'
  },
  'super-sete': {
    name: 'Super Sete',
    description: 'Escolha 7 números de 0 a 9',
    minNumber: 0,
    maxNumber: 9,
    numbersToSelect: 7,
    color: 'from-violet-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-600'
  }
};

// Gera números aleatórios únicos para um jogo
export function generateRandomNumbers(
  min: number,
  max: number,
  count: number
): number[] {
  const numbers = new Set<number>();
  
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

// Calcula a probabilidade de ganhar (combinação simples)
export function calculateProbability(type: LotteryType): string {
  const config = LOTTERY_CONFIGS[type];
  const n = config.maxNumber - config.minNumber + 1;
  const k = config.numbersToSelect;
  
  // Cálculo de combinação: C(n,k) = n! / (k! * (n-k)!)
  const combination = calculateCombination(n, k);
  
  // Formata a probabilidade
  if (combination > 1000000) {
    return `1 em ${(combination / 1000000).toFixed(2)} milhões`;
  } else if (combination > 1000) {
    return `1 em ${(combination / 1000).toFixed(2)} mil`;
  }
  return `1 em ${combination.toLocaleString('pt-BR')}`;
}

// Calcula combinação C(n,k)
function calculateCombination(n: number, k: number): number {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - k + i) / i;
  }
  
  return Math.round(result);
}

// Dicas e estratégias para cada loteria
export const LOTTERY_TIPS: Record<LotteryType, string[]> = {
  'mega-sena': [
    'Evite sequências óbvias como 1, 2, 3, 4, 5, 6',
    'Misture números pares e ímpares',
    'Distribua os números por toda a faixa disponível',
    'Considere jogar em bolões para aumentar as chances',
    'Números mais sorteados: 10, 05, 23, 04, 37, 33'
  ],
  'quina': [
    'A Quina tem sorteios diários, aumentando suas chances',
    'Combine números baixos (1-40) e altos (41-80)',
    'Evite apostar apenas em números de datas',
    'Números frequentes: 04, 49, 53, 32, 38',
    'Considere jogar com 6 ou 7 números para mais combinações'
  ],
  'lotomania': [
    'São 50 números! Estratégia é diferente das outras',
    'Acertar 0 números também ganha prêmio',
    'Distribua bem os números de 0 a 99',
    'Evite padrões visuais no volante',
    'Considere usar geradores aleatórios'
  ],
  'lotofacil': [
    'É a loteria com melhor probabilidade de ganhar',
    'Misture números de todas as colunas do volante',
    'Combine números pares e ímpares equilibradamente',
    'Números mais sorteados: 11, 20, 04, 13, 23',
    'Jogar com 16 ou 17 números aumenta muito as chances'
  ],
  'mega-virada': [
    'Prêmio especial de fim de ano que não acumula',
    'Use as mesmas estratégias da Mega-Sena',
    'Considere fazer bolões para este sorteio especial',
    'Aposte com antecedência para garantir sua participação',
    'Prêmio histórico pode ultrapassar R$ 500 milhões'
  ],
  'mais-milionaria': [
    'Loteria mais nova com prêmio mínimo de R$ 10 milhões',
    'Além dos 6 números, há 2 trevos da sorte',
    'Combine números de toda a faixa (1 a 50)',
    'Probabilidade menor, mas prêmios maiores',
    'Considere jogar com mais números para aumentar chances'
  ],
  'timemania': [
    'Escolha seu time do coração para concorrer',
    'São 10 números de 1 a 80',
    'Acertar o time já garante prêmio',
    'Distribua os números por toda a faixa',
    'Sorteios às terças, quintas e sábados'
  ],
  'dupla-sena': [
    'Dois sorteios no mesmo concurso!',
    'Dobra suas chances de ganhar',
    'Escolha 6 números de 1 a 50',
    'Estratégia similar à Mega-Sena',
    'Sorteios às terças, quintas e sábados'
  ],
  'loteca': [
    'Palpite esportivo em 14 jogos de futebol',
    'Opções: Coluna 1 (vitória mandante), Meio (empate), Coluna 2 (vitória visitante)',
    'Acompanhe o desempenho dos times',
    'Considere estatísticas e histórico',
    'Prêmio para quem acertar 14 resultados'
  ],
  'dia-de-sorte': [
    'Escolha 7 números de 1 a 31 (dias do mês)',
    'Selecione também o mês da sorte',
    'Acertar o mês já garante prêmio',
    'Combine datas especiais com números aleatórios',
    'Sorteios às terças, quintas e sábados'
  ],
  'super-sete': [
    'São 7 colunas com números de 0 a 9',
    'Cada coluna tem um número independente',
    'Acertar 3 colunas já ganha prêmio',
    'Estratégia diferente das outras loterias',
    'Sorteios às segundas, quartas e sextas'
  ]
};

// Salva jogos no Local Storage
export function saveGameToLocalStorage(game: any): void {
  const saved = localStorage.getItem('lotecabrasil-games');
  const games = saved ? JSON.parse(saved) : [];
  games.push(game);
  localStorage.setItem('lotecabrasil-games', JSON.stringify(games));
}

// Carrega jogos do Local Storage
export function loadGamesFromLocalStorage(): any[] {
  const saved = localStorage.getItem('lotecabrasil-games');
  return saved ? JSON.parse(saved) : [];
}

// Remove jogo do Local Storage
export function removeGameFromLocalStorage(gameId: string): void {
  const saved = localStorage.getItem('lotecabrasil-games');
  if (saved) {
    const games = JSON.parse(saved);
    const filtered = games.filter((g: any) => g.id !== gameId);
    localStorage.setItem('lotecabrasil-games', JSON.stringify(filtered));
  }
}

// Limpa todos os jogos salvos
export function clearAllGames(): void {
  localStorage.removeItem('lotecabrasil-games');
}

// Gerenciamento de limite de gerações
export function getGenerationLimit(): number {
  const saved = localStorage.getItem('lotecabrasil-generation-count');
  if (!saved) return 0;
  
  const data = JSON.parse(saved);
  const today = new Date().toDateString();
  
  // Reset diário
  if (data.lastReset !== today) {
    localStorage.setItem('lotecabrasil-generation-count', JSON.stringify({
      count: 0,
      lastReset: today
    }));
    return 0;
  }
  
  return data.count;
}

export function incrementGenerationCount(): void {
  const current = getGenerationLimit();
  const today = new Date().toDateString();
  
  localStorage.setItem('lotecabrasil-generation-count', JSON.stringify({
    count: current + 1,
    lastReset: today
  }));
}

// Gerenciamento de assinatura
export function checkSubscription(): boolean {
  const saved = localStorage.getItem('lotecabrasil-subscription');
  if (!saved) return false;
  
  const subscription = JSON.parse(saved);
  const now = new Date();
  const expiry = new Date(subscription.expiryDate);
  
  return now < expiry;
}

export function activateSubscription(): void {
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias
  
  localStorage.setItem('lotecabrasil-subscription', JSON.stringify({
    isSubscribed: true,
    subscriptionDate: now.toISOString(),
    expiryDate: expiry.toISOString()
  }));
}
