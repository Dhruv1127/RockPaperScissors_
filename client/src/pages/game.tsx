import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw';

interface GameStats {
  totalGames: number;
  wins: number;
  draws: number;
  currentStreak: number;
}

export default function Game() {
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [roundResult, setRoundResult] = useState<string>("Ready to play!");
  const [isThinking, setIsThinking] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    wins: 0,
    draws: 0,
    currentStreak: 0
  });

  const choices: Choice[] = ['rock', 'paper', 'scissors'];
  
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
    setPlayerChoice(playerChoice);
    setIsThinking(true);
    setComputerChoice(null);
    
    // Add thinking delay for computer
    setTimeout(() => {
      const computerChoice = getComputerChoice();
      const result = determineWinner(playerChoice, computerChoice);
      
      setComputerChoice(computerChoice);
      setIsThinking(false);
      
      // Update scores
      if (result === 'win') {
        setPlayerScore(prev => prev + 1);
        setRoundResult("🎉 You Win!");
        setStats(prev => ({
          ...prev,
          totalGames: prev.totalGames + 1,
          wins: prev.wins + 1,
          currentStreak: prev.currentStreak + 1
        }));
      } else if (result === 'lose') {
        setComputerScore(prev => prev + 1);
        setRoundResult("💔 You Lose!");
        setStats(prev => ({
          ...prev,
          totalGames: prev.totalGames + 1,
          currentStreak: 0
        }));
      } else {
        setRoundResult("🤝 It's a Draw!");
        setStats(prev => ({
          ...prev,
          totalGames: prev.totalGames + 1,
          draws: prev.draws + 1,
          currentStreak: 0
        }));
      }
    }, 800);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setComputerScore(0);
    setPlayerChoice(null);
    setComputerChoice(null);
    setRoundResult("Ready to play!");
    setIsThinking(false);
    setStats({
      totalGames: 0,
      wins: 0,
      draws: 0,
      currentStreak: 0
    });
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
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen font-inter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-800 mb-2 tracking-tight">
            🎮 Rock Paper Scissors
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Choose your weapon and challenge the computer!
          </p>
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
                <div className="bg-slate-100 rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center">
                  <div className="text-6xl">
                    {playerChoice ? choiceEmojis[playerChoice] : '❓'}
                  </div>
                </div>
                <p className="text-center text-slate-600 mt-2 font-medium">
                  {playerChoice ? choiceNames[playerChoice] : 'Make your choice'}
                </p>
              </div>

              {/* Choice Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => playRound('rock')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 h-auto"
                  disabled={isThinking}
                >
                  <span className="text-2xl">🪨</span>
                  <span className="text-lg">Rock</span>
                </Button>
                
                <Button
                  onClick={() => playRound('paper')}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 h-auto"
                  disabled={isThinking}
                >
                  <span className="text-2xl">📄</span>
                  <span className="text-lg">Paper</span>
                </Button>
                
                <Button
                  onClick={() => playRound('scissors')}
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
                🎯 Result
              </h2>
              
              {/* Round Result Display */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center">
                  <div className={`text-4xl font-bold ${getResultClass()}`}>
                    {roundResult}
                  </div>
                </div>
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
                <div className="bg-slate-100 rounded-xl p-8 text-center min-h-[120px] flex items-center justify-center">
                  <div className="text-6xl">
                    {isThinking ? '🤔' : (computerChoice ? choiceEmojis[computerChoice] : '🤔')}
                  </div>
                </div>
                <p className="text-center text-slate-600 mt-2 font-medium">
                  {isThinking ? 'Thinking...' : (computerChoice ? choiceNames[computerChoice] : 'Thinking...')}
                </p>
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
