'use client';

import { useState, useEffect } from 'react';
import { Heart, Info, Star, Circle, Crown, CreditCard, Smartphone, Building2, X, Lock, Sparkles } from 'lucide-react';
import { 
  LOTTERY_CONFIGS, 
  generateRandomNumbers, 
  calculateProbability,
  LOTTERY_TIPS,
  saveGameToLocalStorage,
  loadGamesFromLocalStorage,
  removeGameFromLocalStorage,
  getGenerationLimit,
  incrementGenerationCount,
  checkSubscription,
  activateSubscription
} from '@/lib/lottery-utils';
import { LotteryType, GeneratedGame, SavedGame, PaymentMethod } from '@/lib/types';

export default function LotteryGenerator() {
  const [selectedLottery, setSelectedLottery] = useState<LotteryType>('mega-sena');
  const [currentGame, setCurrentGame] = useState<GeneratedGame | null>(null);
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('pix');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [lotteryResults, setLotteryResults] = useState<any>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  // Carrega jogos salvos e verifica assinatura ao montar o componente
  useEffect(() => {
    const games = loadGamesFromLocalStorage();
    setSavedGames(games);
    
    const count = getGenerationLimit();
    setGenerationCount(count);
    
    const subscribed = checkSubscription();
    setIsSubscribed(subscribed);
  }, []);

  // Gera um novo jogo
  const handleGenerateGame = () => {
    // Verifica se tem assinatura ou gerações disponíveis
    if (!isSubscribed && generationCount >= 3) {
      setShowLimitModal(true);
      return;
    }

    const config = LOTTERY_CONFIGS[selectedLottery];
    const numbers = generateRandomNumbers(
      config.minNumber,
      config.maxNumber,
      config.numbersToSelect
    );
    
    const game: GeneratedGame = {
      id: Date.now().toString(),
      type: selectedLottery,
      numbers,
      date: new Date().toLocaleDateString('pt-BR'),
      probability: calculateProbability(selectedLottery)
    };
    
    setCurrentGame(game);
    
    // Incrementa contador apenas se não for assinante
    if (!isSubscribed) {
      incrementGenerationCount();
      setGenerationCount(generationCount + 1);
    }
  };

  // Salva jogo como favorito
  const handleSaveGame = () => {
    if (currentGame) {
      const savedGame: SavedGame = {
        ...currentGame,
        isFavorite: true
      };
      saveGameToLocalStorage(savedGame);
      setSavedGames([...savedGames, savedGame]);
    }
  };

  // Remove jogo dos favoritos
  const handleRemoveGame = (gameId: string) => {
    removeGameFromLocalStorage(gameId);
    setSavedGames(savedGames.filter(g => g.id !== gameId));
  };

  // Simula ativação de assinatura
  const handleSubscribe = () => {
    activateSubscription();
    setIsSubscribed(true);
    setShowSubscriptionModal(false);
    setShowLimitModal(false);
    alert('🎉 Assinatura ativada com sucesso! Agora você tem gerações ilimitadas por 30 dias!');
  };

  // Busca resultados oficiais da Caixa
  const handleFetchResults = async () => {
    setLoadingResults(true);
    setShowResultsModal(true);
    
    try {
      // Simula busca de resultados (em produção, usar API real da Caixa)
      // API exemplo: https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/
      
      // Simulação de dados para demonstração
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults = {
        'mega-sena': {
          concurso: '2650',
          data: new Date().toLocaleDateString('pt-BR'),
          numeros: [5, 12, 23, 34, 45, 58],
          premios: {
            sena: 'R$ 35.000.000,00',
            quina: 'R$ 45.000,00',
            quadra: 'R$ 850,00'
          }
        },
        'quina': {
          concurso: '6320',
          data: new Date().toLocaleDateString('pt-BR'),
          numeros: [8, 15, 27, 42, 68],
          premios: {
            quina: 'R$ 8.500.000,00',
            quadra: 'R$ 5.200,00',
            terno: 'R$ 95,00'
          }
        },
        'lotofacil': {
          concurso: '2950',
          data: new Date().toLocaleDateString('pt-BR'),
          numeros: [2, 4, 5, 7, 9, 11, 13, 15, 17, 18, 20, 21, 23, 24, 25],
          premios: {
            '15 acertos': 'R$ 1.500.000,00',
            '14 acertos': 'R$ 1.200,00',
            '13 acertos': 'R$ 25,00'
          }
        }
      };
      
      setLotteryResults(mockResults);
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
      alert('Não foi possível buscar os resultados. Tente novamente mais tarde.');
    } finally {
      setLoadingResults(false);
    }
  };

  const config = LOTTERY_CONFIGS[selectedLottery];
  const remainingGenerations = isSubscribed ? '∞' : Math.max(0, 3 - generationCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Circle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 fill-yellow-400" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              LotecaBrasil
            </h1>
            <Circle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="text-lg sm:text-xl text-gray-300">
            Gere seus jogos e descubra suas chances de ganhar!
          </p>
          
          {/* Status de Gerações */}
          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <div className={`px-6 py-3 rounded-full font-bold text-sm sm:text-base ${
              isSubscribed 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                : 'bg-white/10 backdrop-blur-sm'
            }`}>
              {isSubscribed ? (
                <span className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  ASSINANTE PREMIUM
                </span>
              ) : (
                <span>Gerações restantes: {remainingGenerations}/3</span>
              )}
            </div>
            
            {!isSubscribed && (
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-transform flex items-center gap-2 animate-pulse"
              >
                <Sparkles className="w-5 h-5" />
                Assinar Premium
              </button>
            )}
          </div>
        </header>

        {/* Seleção de Loteria */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {(Object.keys(LOTTERY_CONFIGS) as LotteryType[]).map((type) => {
            const lotteryConfig = LOTTERY_CONFIGS[type];
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedLottery(type);
                  setCurrentGame(null);
                }}
                className={`p-4 sm:p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  selectedLottery === type
                    ? `${lotteryConfig.gradient} shadow-2xl scale-105`
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <h3 className="font-bold text-base sm:text-lg mb-2">
                  {lotteryConfig.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-200">
                  {lotteryConfig.numbersToSelect} números
                </p>
              </button>
            );
          })}
        </div>

        {/* Card Principal - Gerador */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{config.name}</h2>
            <p className="text-gray-300">{config.description}</p>
          </div>

          {/* Botões Gerar e Conferir Resultados */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleGenerateGame}
              className={`flex-1 ${config.gradient} text-white font-bold py-4 sm:py-6 px-8 rounded-2xl text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 ${
                !isSubscribed && generationCount >= 3 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!isSubscribed && generationCount >= 3 ? (
                <>
                  <Lock className="w-6 h-6" />
                  Limite Atingido - Assine Premium
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Gerador Premium
                </>
              )}
            </button>

            <button
              onClick={handleFetchResults}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 sm:py-6 px-8 rounded-2xl text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
            >
              <Info className="w-6 h-6" />
              Conferir Resultados do Dia
            </button>
          </div>

          {/* Números Gerados */}
          {currentGame && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-3">
                {currentGame.numbers.map((num, idx) => (
                  <div
                    key={idx}
                    className={`${config.gradient} rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center font-bold text-lg sm:text-xl shadow-lg transform hover:scale-110 transition-all duration-300`}
                  >
                    {num.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* Probabilidade */}
              <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-lg">Probabilidade de Ganhar</h3>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  {currentGame.probability}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Gerado em: {currentGame.date}
                </p>
              </div>

              {/* Botão Salvar */}
              <button
                onClick={handleSaveGame}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
              >
                <Heart className="w-5 h-5" />
                Salvar nos Favoritos
              </button>
            </div>
          )}
        </div>

        {/* Dicas e Estratégias */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-white/20">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl sm:text-2xl font-bold">Dicas e Estratégias</h3>
            </div>
            <span className="text-2xl">{showTips ? '−' : '+'}</span>
          </button>
          
          {showTips && (
            <ul className="space-y-3 mt-4">
              {LOTTERY_TIPS[selectedLottery].map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-200">
                  <span className="text-yellow-400 font-bold mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Jogos Salvos */}
        {savedGames.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
              <h3 className="text-xl sm:text-2xl font-bold">Jogos Favoritos</h3>
              <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {savedGames.length}
              </span>
            </div>

            <div className="grid gap-4">
              {savedGames.map((game) => {
                const gameConfig = LOTTERY_CONFIGS[game.type];
                return (
                  <div
                    key={game.id}
                    className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{gameConfig.name}</h4>
                        <p className="text-sm text-gray-400">{game.date}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveGame(game.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
                      {game.numbers.map((num, idx) => (
                        <div
                          key={idx}
                          className={`${gameConfig.gradient} rounded-lg p-2 text-center font-bold text-sm shadow-md`}
                        >
                          {num.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-400 mt-3">
                      Probabilidade: {game.probability}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>🍀 Boa sorte! Jogue com responsabilidade.</p>
          <p className="mt-2">LotecaBrasil - Seu gerador de jogos de loteria</p>
        </footer>
      </div>

      {/* Modal de Limite Atingido */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Limite de Gerações Atingido</h3>
              <p className="text-gray-300">
                Você já usou suas 3 gerações gratuitas de hoje. Assine o plano Premium para gerações ilimitadas!
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  setShowSubscriptionModal(true);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <Crown className="w-5 h-5" />
                Ver Planos Premium
              </button>
              
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full bg-white/10 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:bg-white/20"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Assinatura */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-white/20 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                Plano Premium
              </h3>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Benefícios */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-6 mb-6">
              <div className="text-center mb-4">
                <p className="text-4xl sm:text-5xl font-bold mb-2">R$ 29,90</p>
                <p className="text-lg">por mês</p>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Gerações ilimitadas de jogos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Acesso a todas as loterias</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Salve jogos favoritos ilimitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Dicas e estratégias exclusivas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Suporte prioritário</span>
                </li>
              </ul>
            </div>

            {/* Formas de Pagamento */}
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-4">Escolha a forma de pagamento:</h4>
              
              <div className="grid gap-3">
                <button
                  onClick={() => setSelectedPayment('pix')}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    selectedPayment === 'pix'
                      ? 'border-green-500 bg-green-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <p className="font-bold">PIX</p>
                    <p className="text-sm text-gray-400">Aprovação instantânea</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPayment('credit')}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    selectedPayment === 'credit'
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <p className="font-bold">Cartão de Crédito</p>
                    <p className="text-sm text-gray-400">Parcelamento disponível</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPayment('debit')}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    selectedPayment === 'debit'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <Building2 className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <p className="font-bold">Débito em Conta</p>
                    <p className="text-sm text-gray-400">Desconto direto na conta</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Botão de Confirmação */}
            <button
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold py-4 sm:py-5 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
            >
              <Crown className="w-6 h-6" />
              Assinar Agora - R$ 29,90/mês
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Cancele quando quiser. Sem taxas adicionais.
            </p>
          </div>
        </div>
      )}

      {/* Modal de Resultados */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 max-w-4xl w-full border border-white/20 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <Info className="w-8 h-8 text-blue-400" />
                Resultados do Dia
              </h3>
              <button
                onClick={() => setShowResultsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {loadingResults ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Buscando resultados oficiais da Caixa...</p>
              </div>
            ) : lotteryResults ? (
              <div className="space-y-6">
                {/* Mega-Sena */}
                {lotteryResults['mega-sena'] && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-green-400">Mega-Sena</h4>
                      <span className="text-sm text-gray-400">
                        Concurso {lotteryResults['mega-sena'].concurso} - {lotteryResults['mega-sena'].data}
                      </span>
                    </div>
                    <div className="grid grid-cols-6 gap-3 mb-4">
                      {lotteryResults['mega-sena'].numeros.map((num: number, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center font-bold text-xl"
                        >
                          {num.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Sena</p>
                        <p className="font-bold">{lotteryResults['mega-sena'].premios.sena}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Quina</p>
                        <p className="font-bold">{lotteryResults['mega-sena'].premios.quina}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Quadra</p>
                        <p className="font-bold">{lotteryResults['mega-sena'].premios.quadra}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quina */}
                {lotteryResults['quina'] && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-purple-400">Quina</h4>
                      <span className="text-sm text-gray-400">
                        Concurso {lotteryResults['quina'].concurso} - {lotteryResults['quina'].data}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {lotteryResults['quina'].numeros.map((num: number, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-center font-bold text-xl"
                        >
                          {num.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Quina</p>
                        <p className="font-bold">{lotteryResults['quina'].premios.quina}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Quadra</p>
                        <p className="font-bold">{lotteryResults['quina'].premios.quadra}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">Terno</p>
                        <p className="font-bold">{lotteryResults['quina'].premios.terno}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lotofácil */}
                {lotteryResults['lotofacil'] && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-blue-400">Lotofácil</h4>
                      <span className="text-sm text-gray-400">
                        Concurso {lotteryResults['lotofacil'].concurso} - {lotteryResults['lotofacil'].data}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
                      {lotteryResults['lotofacil'].numeros.map((num: number, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-3 text-center font-bold text-lg"
                        >
                          {num.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">15 acertos</p>
                        <p className="font-bold">{lotteryResults['lotofacil'].premios['15 acertos']}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">14 acertos</p>
                        <p className="font-bold">{lotteryResults['lotofacil'].premios['14 acertos']}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-gray-400">13 acertos</p>
                        <p className="font-bold">{lotteryResults['lotofacil'].premios['13 acertos']}</p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-center text-sm text-gray-400 mt-6">
                  * Resultados simulados para demonstração. Em produção, conectar à API oficial da Caixa.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
