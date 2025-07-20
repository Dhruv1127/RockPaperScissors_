// ===== GAME STATE AND CONSTANTS =====
const gameState = {
    currentScreen: 'home',
    isMuted: false,
    audioContext: null,
    gameAudioContext: null,
    playerScore: 0,
    computerScore: 0,
    playerChoice: null,
    computerChoice: null,
    roundResult: 'Ready to play!',
    isThinking: false,
    battleAnimation: false,
    gamePhase: 'ready', // ready, selecting, battle, result
    stats: {
        totalGames: 0,
        wins: 0,
        draws: 0,
        currentStreak: 0,
        bestStreak: 0
    }
};

const choices = ['rock', 'paper', 'scissors'];
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

// ===== AUDIO SYSTEM =====
function initializeAudio() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        gameState.audioContext = new AudioContext();
        gameState.gameAudioContext = new AudioContext();
    } catch (error) {
        console.log('Audio initialization failed:', error);
    }
}

function playSound(type, useGameContext = false) {
    if (gameState.isMuted) return;
    
    const audioContext = useGameContext ? gameState.gameAudioContext : gameState.audioContext;
    if (!audioContext) return;
    
    try {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        switch (type) {
            case 'click':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
            case 'hover':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
            case 'win':
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'lose':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                oscillator.stop(audioContext.currentTime + 0.4);
                break;
            case 'draw':
                oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
        }
    } catch (error) {
        console.log('Audio playback failed:', error);
    }
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show target screen
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenName;
    }
}

// ===== HOME SCREEN FUNCTIONS =====
function createParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create 20 particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        particlesContainer.appendChild(particle);
    }
}

function startGame() {
    playSound('click');
    setTimeout(() => {
        showScreen('game');
        resetGame();
    }, 200);
}

function quitGame() {
    playSound('click');
    alert('Thanks for playing! 👋');
}

function toggleHomeMute() {
    gameState.isMuted = !gameState.isMuted;
    updateMuteButton('home-mute-btn');
    playSound('click');
}

function toggleGameMute() {
    gameState.isMuted = !gameState.isMuted;
    updateMuteButton('game-mute-btn');
    playSound('click', true);
}

function updateMuteButton(buttonId) {
    const button = document.getElementById(buttonId);
    const volumeIcon = button.querySelector('.volume-icon');
    
    if (gameState.isMuted) {
        button.classList.add('muted');
        volumeIcon.textContent = '🔇';
    } else {
        button.classList.remove('muted');
        volumeIcon.textContent = '🔊';
    }
}

// ===== GAME LOGIC =====
function getComputerChoice() {
    return choices[Math.floor(Math.random() * 3)];
}

function determineWinner(player, computer) {
    if (player === computer) {
        return 'draw';
    }
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    return winConditions[player] === computer ? 'win' : 'lose';
}

function updatePhaseIndicator(phase) {
    const indicator = document.querySelector('.phase-indicator');
    const dot = document.getElementById('phase-dot');
    const text = document.getElementById('phase-text');
    
    // Remove all phase classes
    indicator.classList.remove('ready', 'selecting', 'battle', 'result');
    dot.classList.remove('ready', 'selecting', 'battle', 'result');
    
    // Add current phase class
    indicator.classList.add(phase);
    dot.classList.add(phase);
    
    // Update text
    switch (phase) {
        case 'ready':
            text.textContent = 'Ready to Play';
            break;
        case 'selecting':
            text.textContent = 'Selection Made';
            break;
        case 'battle':
            text.textContent = 'Battle in Progress';
            break;
        case 'result':
            text.textContent = 'Round Complete';
            break;
    }
}

function updatePlayerDisplay() {
    const playerEmoji = document.getElementById('player-emoji');
    const playerLabel = document.getElementById('player-label');
    const playerDisplay = document.querySelector('.player-section .choice-display');
    const battleStatus = document.getElementById('player-battle-status');
    
    if (gameState.playerChoice) {
        playerEmoji.textContent = choiceEmojis[gameState.playerChoice];
        playerLabel.textContent = choiceNames[gameState.playerChoice];
        
        if (gameState.gamePhase === 'battle') {
            playerDisplay.classList.add('battle');
            playerEmoji.classList.add('battle');
            battleStatus.innerHTML = `
                <div class="battle-ready">
                    <div class="status-dot"></div>
                    Battle Ready!
                </div>
            `;
        } else if (gameState.gamePhase === 'result') {
            playerDisplay.classList.remove('battle');
            playerEmoji.classList.remove('battle');
            battleStatus.innerHTML = '';
            
            if (gameState.roundResult.includes('Win')) {
                playerDisplay.classList.add('win');
                playerEmoji.classList.add('win');
            } else {
                playerDisplay.classList.remove('win');
                playerEmoji.classList.remove('win');
            }
        } else {
            playerDisplay.classList.remove('battle', 'win');
            playerEmoji.classList.remove('battle', 'win');
            battleStatus.innerHTML = '';
        }
    } else {
        playerEmoji.textContent = '❓';
        playerLabel.textContent = 'Make your choice';
        playerDisplay.classList.remove('battle', 'win');
        playerEmoji.classList.remove('battle', 'win');
        battleStatus.innerHTML = '';
    }
}

function updateComputerDisplay() {
    const computerEmoji = document.getElementById('computer-emoji');
    const computerLabel = document.getElementById('computer-label');
    const computerDisplay = document.querySelector('.computer-section .choice-display');
    const thinkingIndicator = document.getElementById('thinking-indicator');
    
    if (gameState.isThinking) {
        computerEmoji.textContent = '🤔';
        computerLabel.textContent = 'Thinking...';
        computerDisplay.classList.add('battle');
        thinkingIndicator.innerHTML = `
            <div class="thinking-dots">
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
                <div class="thinking-dot"></div>
                Computing...
            </div>
        `;
    } else if (gameState.computerChoice) {
        computerEmoji.textContent = choiceEmojis[gameState.computerChoice];
        computerLabel.textContent = choiceNames[gameState.computerChoice];
        computerDisplay.classList.remove('battle');
        thinkingIndicator.innerHTML = '';
        
        if (gameState.gamePhase === 'result') {
            if (gameState.roundResult.includes('Lose')) {
                computerDisplay.classList.add('win');
            } else {
                computerDisplay.classList.remove('win');
            }
        }
    } else {
        computerEmoji.textContent = '🤔';
        computerLabel.textContent = 'Ready to play';
        computerDisplay.classList.remove('battle', 'win');
        thinkingIndicator.innerHTML = '';
    }
}

function updateResultDisplay() {
    const resultDisplay = document.querySelector('.result-display');
    const resultText = document.getElementById('result-text');
    const battleEffects = document.getElementById('battle-effects');
    
    // Remove all result classes
    resultDisplay.classList.remove('ready', 'battle', 'win', 'lose', 'draw');
    resultText.classList.remove('ready', 'battle', 'win', 'lose', 'draw');
    
    switch (gameState.gamePhase) {
        case 'ready':
            resultDisplay.classList.add('ready');
            resultText.classList.add('ready');
            resultText.textContent = gameState.roundResult;
            battleEffects.innerHTML = '';
            break;
        case 'battle':
            resultDisplay.classList.add('battle');
            resultText.classList.add('battle');
            resultText.textContent = '⚔️ CLASH! ⚔️';
            battleEffects.innerHTML = `
                <div class="clash-effects">
                    <div class="effect-emoji" style="animation-delay: 0s">💥</div>
                    <div class="effect-emoji" style="animation-delay: 0.2s">⚡</div>
                    <div class="effect-emoji" style="animation-delay: 0.4s">💥</div>
                </div>
            `;
            break;
        case 'result':
            battleEffects.innerHTML = '';
            resultText.textContent = gameState.roundResult;
            
            if (gameState.roundResult.includes('Win')) {
                resultDisplay.classList.add('win');
                resultText.classList.add('win');
            } else if (gameState.roundResult.includes('Lose')) {
                resultDisplay.classList.add('lose');
                resultText.classList.add('lose');
            } else if (gameState.roundResult.includes('Draw')) {
                resultDisplay.classList.add('draw');
                resultText.classList.add('draw');
            }
            break;
    }
}

function updateScoreboard() {
    document.getElementById('player-score').textContent = gameState.playerScore;
    document.getElementById('computer-score').textContent = gameState.computerScore;
}

function updateStatistics() {
    const totalGames = gameState.stats.totalGames;
    const winRate = totalGames > 0 ? Math.round((gameState.stats.wins / totalGames) * 100) : 0;
    
    document.getElementById('total-games').textContent = totalGames;
    document.getElementById('win-rate').textContent = winRate + '%';
    document.getElementById('current-streak').textContent = gameState.stats.currentStreak;
    document.getElementById('best-streak').textContent = gameState.stats.bestStreak;
}

function updateChoiceButtons() {
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(button => {
        button.disabled = gameState.isThinking;
    });
}

function playRound(playerChoice) {
    playSound('click', true);
    
    gameState.gamePhase = 'selecting';
    gameState.playerChoice = playerChoice;
    gameState.isThinking = true;
    gameState.computerChoice = null;
    gameState.roundResult = '⚡ Battle in progress...';
    
    updatePhaseIndicator('selecting');
    updatePlayerDisplay();
    updateComputerDisplay();
    updateResultDisplay();
    updateChoiceButtons();
    
    // Show battle animation
    setTimeout(() => {
        gameState.battleAnimation = true;
        gameState.gamePhase = 'battle';
        updatePhaseIndicator('battle');
        updatePlayerDisplay();
        updateResultDisplay();
    }, 200);
    
    // Add thinking delay for computer
    setTimeout(() => {
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);
        
        gameState.computerChoice = computerChoice;
        gameState.isThinking = false;
        gameState.battleAnimation = false;
        gameState.gamePhase = 'result';
        
        // Update stats and play appropriate sound
        if (result === 'win') {
            gameState.playerScore++;
            gameState.roundResult = '🎉 Victory! You Win!';
            playSound('win', true);
            gameState.stats.totalGames++;
            gameState.stats.wins++;
            gameState.stats.currentStreak++;
            if (gameState.stats.currentStreak > gameState.stats.bestStreak) {
                gameState.stats.bestStreak = gameState.stats.currentStreak;
            }
        } else if (result === 'lose') {
            gameState.computerScore++;
            gameState.roundResult = '💔 Defeat! You Lose!';
            playSound('lose', true);
            gameState.stats.totalGames++;
            gameState.stats.currentStreak = 0;
        } else {
            gameState.roundResult = '🤝 It\'s a Draw!';
            playSound('draw', true);
            gameState.stats.totalGames++;
            gameState.stats.draws++;
            gameState.stats.currentStreak = 0;
        }
        
        updatePhaseIndicator('result');
        updatePlayerDisplay();
        updateComputerDisplay();
        updateResultDisplay();
        updateScoreboard();
        updateStatistics();
        updateChoiceButtons();
        
        // Reset to ready state after showing result
        setTimeout(() => {
            gameState.gamePhase = 'ready';
            updatePhaseIndicator('ready');
            updatePlayerDisplay();
            updateComputerDisplay();
            updateResultDisplay();
            updateChoiceButtons();
        }, 2000);
    }, 1200);
}

function resetGame() {
    playSound('click', true);
    
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.playerChoice = null;
    gameState.computerChoice = null;
    gameState.roundResult = 'Ready to play!';
    gameState.isThinking = false;
    gameState.battleAnimation = false;
    gameState.gamePhase = 'ready';
    gameState.stats = {
        totalGames: 0,
        wins: 0,
        draws: 0,
        currentStreak: 0,
        bestStreak: 0
    };
    
    updatePhaseIndicator('ready');
    updatePlayerDisplay();
    updateComputerDisplay();
    updateResultDisplay();
    updateScoreboard();
    updateStatistics();
    updateChoiceButtons();
}

function goHome() {
    playSound('click', true);
    showScreen('home');
}

// ===== EVENT LISTENERS =====
function addEventListeners() {
    // Home screen events
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    document.getElementById('quit-game-btn').addEventListener('click', quitGame);
    document.getElementById('home-mute-btn').addEventListener('click', toggleHomeMute);
    
    // Game screen events
    document.getElementById('home-btn').addEventListener('click', goHome);
    document.getElementById('game-mute-btn').addEventListener('click', toggleGameMute);
    document.getElementById('reset-game-btn').addEventListener('click', resetGame);
    
    // Choice buttons
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const choice = button.getAttribute('data-choice');
            playRound(choice);
        });
        
        // Add hover sound
        button.addEventListener('mouseenter', () => {
            playSound('hover', true);
        });
    });
    
    // Add hover sounds to other interactive elements
    const hoverElements = document.querySelectorAll('.start-btn, .quit-btn, .nav-btn, .reset-btn');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const useGameContext = gameState.currentScreen === 'game';
            playSound('hover', useGameContext);
        });
    });
}

// ===== INITIALIZATION =====
function initializeGame() {
    // Initialize audio
    initializeAudio();
    
    // Create particles for home screen
    createParticles();
    
    // Add event listeners
    addEventListeners();
    
    // Show home screen
    showScreen('home');
    
    // Enable audio context on user interaction
    document.addEventListener('click', () => {
        if (gameState.audioContext && gameState.audioContext.state === 'suspended') {
            gameState.audioContext.resume();
        }
        if (gameState.gameAudioContext && gameState.gameAudioContext.state === 'suspended') {
            gameState.gameAudioContext.resume();
        }
    }, { once: true });
}

// ===== START THE APPLICATION =====
document.addEventListener('DOMContentLoaded', initializeGame);