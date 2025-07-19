import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, VolumeX, Play, Power } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Background music and sound effects
  useEffect(() => {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Store audio context globally for sound effects
    (window as any).audioContext = audioContext;
    
    return () => {
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, []);

  const playClickSound = () => {
    if (isMuted || !window.audioContext) return;
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, window.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, window.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, window.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(window.audioContext.currentTime + 0.1);
  };

  const playHoverSound = () => {
    if (isMuted || !window.audioContext) return;
    
    const oscillator = window.audioContext.createOscillator();
    const gainNode = window.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, window.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(window.audioContext.currentTime + 0.05);
  };

  const startGame = () => {
    playClickSound();
    setTimeout(() => setLocation('/game'), 200);
  };

  const quitGame = () => {
    playClickSound();
    // In a real app, this might close the window or show a confirmation
    alert('Thanks for playing! 👋');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    playClickSound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden font-inter">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-indigo-400 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-400 rounded-full opacity-25 animate-bounce"></div>
        
        {/* Floating game symbols */}
        <div className="absolute top-32 left-1/4 text-6xl opacity-20 animate-float-slow">🪨</div>
        <div className="absolute top-1/2 right-1/4 text-5xl opacity-30 animate-float-medium">📄</div>
        <div className="absolute bottom-40 left-1/3 text-7xl opacity-15 animate-float-fast">✂️</div>
        
        {/* Particle effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Sound control */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Game title with glow effect */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse-slow drop-shadow-2xl">
              🎮
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-glow">
              ROCK PAPER SCISSORS
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 font-medium animate-fade-in">
              Challenge the AI in the ultimate battle of wits!
            </p>
          </div>

          {/* Menu card */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl animate-slide-up">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Start Game Button */}
                <Button
                  onClick={startGame}
                  onMouseEnter={playHoverSound}
                  className="w-full h-16 text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-border"
                >
                  <Play className="w-8 h-8 mr-3" />
                  START GAME
                </Button>

                {/* Game stats preview */}
                <div className="grid grid-cols-3 gap-4 py-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">∞</div>
                    <div className="text-sm text-blue-200">Rounds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">AI</div>
                    <div className="text-sm text-blue-200">Opponent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">⚡</div>
                    <div className="text-sm text-blue-200">Fast Play</div>
                  </div>
                </div>

                {/* Quit Game Button */}
                <Button
                  onClick={quitGame}
                  onMouseEnter={playHoverSound}
                  variant="outline"
                  className="w-full h-14 text-xl font-semibold bg-white/5 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Power className="w-6 h-6 mr-3" />
                  QUIT GAME
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game preview */}
          <div className="mt-8 flex justify-center space-x-8 opacity-60">
            <div className="text-center animate-bounce" style={{ animationDelay: '0s' }}>
              <div className="text-4xl mb-2">🪨</div>
              <div className="text-sm text-blue-200">Rock</div>
            </div>
            <div className="text-center animate-bounce" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-2">📄</div>
              <div className="text-sm text-blue-200">Paper</div>
            </div>
            <div className="text-center animate-bounce" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-2">✂️</div>
              <div className="text-sm text-blue-200">Scissors</div>
            </div>
          </div>

          {/* Footer text */}
          <div className="mt-8 text-blue-300 opacity-75 animate-fade-in-slow">
            <p className="text-lg">Press START to begin your epic battle!</p>
          </div>
        </div>
      </div>

      {/* Version info */}
      <div className="absolute bottom-4 left-4 text-white/50 text-sm">
        v1.0.0
      </div>
    </div>
  );
}