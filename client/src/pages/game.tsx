import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useLocation } from "wouter";

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw';

interface GameStats {
  totalGames: number;
  wins: number;
  draws: number;
  currentStreak: number;
}

export default function Game() {
  const [, setLocation] = useLocation();
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [roundResult, setRoundResult] = useState<string>("Ready to play!");
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [battleAnimation, setBattleAnimation] = useState(false);
  const [gamePhase, setGamePhase] = useState<'ready' | 'selecting' | 'battle' | 'result'>('ready');
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    draws: 0,
    currentStreak: 0
  });

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  // Sound effects setup
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    (window as any).gameAudioContext = audioContext;
    
    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  const playSound = (type: 'click' | 'win' | 'lose' | 'draw' | 'hover') => {
    if (isMuted || !(window as any).gameAudioContext) return;
    
    try {
      const audioContext = (window as any).gameAudioContext;
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Always start the oscillator first
      oscillator.start();
      
      switch (type) {
        case 'click':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'win':
          // Ascending victory sound
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'lose':
          // Descending defeat sound
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'draw':
          // Neutral draw sound
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'hover':
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
      }
    } catch (error) {
      console.log('Audio playback failed:', error);
    }
  };
  
  const choiceEmojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  };
  
  const choiceNames = {
    rock: 'Rock',
    paper: 'Paper',
    scissors: 'Scissors'
  };

  const getComputerChoice = (): Choice => {
    return choices[Math.floor(Math.random() * 3)];
  };

  const determineWinner = (player: Choice, computer: Choice): GameResult => {
    if (player === computer) {
      return 'draw';
    }
    
    const winConditions = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };
    
    return winConditions[player] === computer ? 'win' : 'lose';
  };

  const playRound = (playerChoice: Choice) => {
    playSound('click');
    setGamePhase('selecting');
    setPlayerChoice(playerChoice);
    setIsThinking(true);
    setComputerChoice(null);
    setRoundResult("⚡ Battle in progress...");
    
    // Show battle animation
    setTimeout(() => {
      setBattleAnimation(true);
      setGamePhase('battle');
    }, 200);
    
    // Add thinking delay for computer
    setTimeout(() => {
      const computerChoice = getComputerChoice();
      const result = determineWinner(playerChoice, computerChoice);
      
      setComputerChoice(computerChoice);
      setIsThinking(false);
      setBattleAnimation(false);
      setGamePhase('result');
      
      // Update scores and play appropriate sound
      if (result === 'win') {
        setPlayerScore(prev => prev + 1);
        setRoundResult("🎉 Victory! You Win!");
        playSound('win');
        setStats(prev => ({
          ...prev,
          totalGames: prev.totalGames + 1,
          wins: prev.wins + 1,
          currentStreak: prev.currentStreak + 1
        }));
      } else if (result === 'lose') {
        setComputerScore(prev => prev + 1);
        setRoundResult("💔 Defeat! You Lose!");
        playSound('lose');
        setStats(prev => ({
          ...prev,
          totalGames: prev.totalGames + 1,
          currentStreak: 0
        }));
      } else {
        setRoundResult("🤝 It's a Draw!");
        playSound('draw');
        setStats(prev => ({
          ...prev,
          totalGames: prev.totalGames + 1,
          draws: prev.draws + 1,
          currentStreak: 0
        }));
      }
      
      // Reset to ready state after showing result
      setTimeout(() => {
        setGamePhase('ready');
      }, 2000);
    }, 1200);
  };

  const resetGame = () => {
    playSound('click');
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setRoundResult("Ready to play!");
    setIsThinking(false);
    setBattleAnimation(false);
    setGamePhase('ready');
    setStats({
      totalGames: 0,
      wins: 0,
      draws: 0,
      currentStreak: 0
    });
  };

  const goHome = () => {
    playSound('click');
    setLocation('/');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    playSound('click');
  };

  const getResultClass = () => {
    if (roundResult.includes("Win")) return "text-green-600 animate-bounce";
    if (roundResult.includes("Lose")) return "text-red-600";
    if (roundResult.includes("Draw")) return "text-yellow-600 animate-pulse";
    return "";
  };

  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;
  const drawRate = stats.totalGames > 0 ? Math.round((stats.draws / stats.totalGames) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen font-inter relative">
      {/* Navigation and Controls */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          onClick={goHome}
          onMouseEnter={() => playSound('hover')}
          variant="outline"
          className="bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>
      
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={toggleMute}
          onMouseEnter={() => playSound('hover')}
          variant="outline"
          className="bg-white/80 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8 mt-16">
          <h1 className="text-5xl font-bold text-slate-800 mb-2 tracking-tight">
            🎮 Rock Paper Scissors
          </h1>
          <p className="text-lg text-slate-600 font-medium mb-4">
            Choose your weapon and challenge the computer!
          </p>
          
          {/* Game Phase Indicator */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              gamePhase === 'ready' ? 'bg-blue-100 text-blue-800' :
              gamePhase === 'selecting' ? 'bg-yellow-100 text-yellow-800' :
              gamePhase === 'battle' ? 'bg-orange-100 text-orange-800 animate-pulse' :
              gamePhase === 'result' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                gamePhase === 'ready' ? 'bg-blue-500' :
                gamePhase === 'selecting' ? 'bg-yellow-500' :
                gamePhase === 'battle' ? 'bg-orange-500 animate-ping' :
                gamePhase === 'result' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              {gamePhase === 'ready' && 'Ready to Play'}
              {gamePhase === 'selecting' && 'Selection Made'}
              {gamePhase === 'battle' && 'Battle in Progress'}
              {gamePhase === 'result' && 'Round Complete'}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Player Section */}
          <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
                👤 You
              </h2>
              
              {/* Player Choice Display */}
              <div className="mb-6">
                <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center border-2 transition-all duration-300 ${
                  gamePhase === 'battle' ? 'border-blue-500 animate-pulse' : 'border-blue-200'
                } ${gamePhase === 'result' && roundResult.includes('Win') ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-100' : ''}`}>
                  <div className={`text-6xl transition-all duration-500 ${
                    battleAnimation ? 'animate-bounce scale-125' : ''
                  } ${gamePhase === 'result' && roundResult.includes('Win') ? 'animate-celebrate' : ''}`}>
                    {playerChoice ? choiceEmojis[playerChoice] : '❓'}
                  </div>
                </div>
                <p className="text-center text-slate-600 mt-2 font-medium">
                  {playerChoice ? choiceNames[playerChoice] : 'Make your choice'}
                </p>
                {gamePhase === 'battle' && (
                  <div className="text-center mt-2">
                    <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                      Battle Ready!
                    </span>
                  </div>
                )}
              </div>

              {/* Choice Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => playRound('rock')}
                  onMouseEnter={() => playSound('hover')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 h-auto"
                  disabled={isThinking}
                >
                  <span className="text-2xl">🪨</span>
                  <span className="text-lg">Rock</span>
                </Button>
                
                <Button
                  onClick={() => playRound('paper')}
                  onMouseEnter={() => playSound('hover')}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 h-auto"
                  disabled={isThinking}
                >
                  <span className="text-2xl">📄</span>
                  <span className="text-lg">Paper</span>
                </Button>
                
                <Button
                  onClick={() => playRound('scissors')}
                  onMouseEnter={() => playSound('hover')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 h-auto"
                  disabled={isThinking}
                >
                  <span className="text-2xl">✂️</span>
                  <span className="text-lg">Scissors</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
                🎯 Battle Arena
              </h2>
              
              {/* Round Result Display */}
              <div className="mb-6">
                <div className={`rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center transition-all duration-500 ${
                  gamePhase === 'battle' ? 'bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 animate-pulse' :
                  gamePhase === 'result' && roundResult.includes('Win') ? 'bg-gradient-to-r from-green-100 to-emerald-100' :
                  gamePhase === 'result' && roundResult.includes('Lose') ? 'bg-gradient-to-r from-red-100 to-pink-100' :
                  gamePhase === 'result' && roundResult.includes('Draw') ? 'bg-gradient-to-r from-yellow-100 to-amber-100' :
                  'bg-gradient-to-r from-purple-100 to-pink-100'
                }`}>
                  <div className={`font-bold transition-all duration-500 ${getResultClass()} ${
                    gamePhase === 'battle' ? 'text-2xl animate-pulse' : 'text-4xl'
                  }`}>
                    {battleAnimation && gamePhase === 'battle' ? '⚔️ CLASH! ⚔️' : roundResult}
                  </div>
                </div>
                {gamePhase === 'battle' && (
                  <div className="text-center mt-4">
                    <div className="flex justify-center space-x-8">
                      <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💥</div>
                      <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>⚡</div>
                      <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>💥</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Score Board */}
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">Score</h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{playerScore}</div>
                    <div className="text-sm text-slate-600 font-medium">You</div>
                  </div>
                  <div className="text-2xl font-bold text-slate-400">VS</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{computerScore}</div>
                    <div className="text-sm text-slate-600 font-medium">Computer</div>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <Button
                onClick={resetGame}
                onMouseEnter={() => playSound('hover')}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                🔄 Reset Game
              </Button>
            </CardContent>
          </Card>

          {/* Computer Section */}
          <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
                🤖 Computer
              </h2>
              
              {/* Computer Choice Display */}
              <div className="mb-6">
                <div className={`bg-gradient-to-br from-red-50 to-orange-100 rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center border-2 transition-all duration-300 ${
                  gamePhase === 'battle' ? 'border-red-500 animate-pulse' : 'border-red-200'
                } ${gamePhase === 'result' && roundResult.includes('Lose') ? 'border-red-500 bg-gradient-to-br from-red-50 to-rose-100' : ''}`}>
                  <div className={`text-6xl transition-all duration-500 ${
                    battleAnimation ? 'animate-bounce scale-125' : ''
                  } ${gamePhase === 'result' && roundResult.includes('Lose') ? 'animate-celebrate' : ''} ${
                    isThinking ? 'animate-spin' : ''
                  }`}>
                    {isThinking ? '🤔' : (computerChoice ? choiceEmojis[computerChoice] : '🤔')}
                  </div>
                </div>
                <p className="text-center text-slate-600 mt-2 font-medium">
                  {isThinking ? 'AI Computing...' : (computerChoice ? choiceNames[computerChoice] : 'Ready to Battle')}
                </p>
                {gamePhase === 'battle' && (
                  <div className="text-center mt-2">
                    <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                      AI Engaged!
                    </span>
                  </div>
                )}
              </div>

              {/* Computer Stats */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">AI Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Difficulty:</span>
                    <span className="text-sm font-semibold text-green-600">Random</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Response Time:</span>
                    <span className="text-sm font-semibold text-blue-600">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Strategy:</span>
                    <span className="text-sm font-semibold text-purple-600">Unpredictable</span>
                  </div>
                </div>
              </div>

              {/* Computer Choice Indicator */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>{isThinking ? 'Thinking...' : 'Ready to play'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Rules Section */}
        <Card className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
              📜 Game Rules
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-4xl mb-2">🪨</div>
                <h3 className="font-semibold text-slate-800 mb-1">Rock</h3>
                <p className="text-sm text-slate-600">Crushes Scissors</p>
              </div>
              <div className="text-center p-4 bg-cyan-50 rounded-xl">
                <div className="text-4xl mb-2">📄</div>
                <h3 className="font-semibold text-slate-800 mb-1">Paper</h3>
                <p className="text-sm text-slate-600">Covers Rock</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-4xl mb-2">✂️</div>
                <h3 className="font-semibold text-slate-800 mb-1">Scissors</h3>
                <p className="text-sm text-slate-600">Cuts Paper</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Statistics */}
        <Card className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
              📊 Game Statistics
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">{stats.totalGames}</div>
                <p className="text-sm text-slate-600 font-medium">Total Games</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">{winRate}%</div>
                <p className="text-sm text-slate-600 font-medium">Win Rate</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">{drawRate}%</div>
                <p className="text-sm text-slate-600 font-medium">Draw Rate</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">{stats.currentStreak}</div>
                <p className="text-sm text-slate-600 font-medium">Current Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
