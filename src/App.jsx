import { useState } from 'react'
import ChessGame from './components/ChessGame'
import LearningMode from './components/LearningMode'
import './App.css'

function App() {
  const [mode, setMode] = useState(null)
  const [difficulty, setDifficulty] = useState(1)
  const [useClassicPieces, setUseClassicPieces] = useState(false)

  const playSound = (type) => {
    const sounds = {
      click: new Audio('data:audio/wav;base64,UklGRl9vT19teleHICAgICAg'),
      start: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
    }
    try {
      const audio = new Audio(sounds[type] || sounds.click)
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}
  }

  if (!mode) {
    return (
      <div className="menu-container">
        <div className="floating-elements">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`floating-item item-${i % 5}`} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}>
              {['🦄', '⭐', '🌈', '✨', '💫'][i % 5]}
            </div>
          ))}
        </div>
        
        <div className="menu-card">
          <h1 className="title">
            <span className="rainbow-text">🦄 Unicorn Chess 🦄</span>
          </h1>
          <p className="subtitle">Learn & Play Chess with Magic! ✨</p>
          
          <div className="menu-buttons">
            <button 
              className="menu-btn learn-btn"
              onClick={() => { playSound('start'); setMode('learn') }}
            >
              <span className="btn-icon">📚</span>
              <span className="btn-text">Learn to Play</span>
              <span className="btn-desc">Discover how pieces move!</span>
            </button>
            
            <button 
              className="menu-btn play-btn"
              onClick={() => { playSound('start'); setMode('play') }}
            >
              <span className="btn-icon">🎮</span>
              <span className="btn-text">Play Game</span>
              <span className="btn-desc">Challenge the unicorn AI!</span>
            </button>
          </div>

          {mode === null && (
            <div className="settings-preview">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={useClassicPieces}
                  onChange={(e) => setUseClassicPieces(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span>Use classic pieces</span>
              </label>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (mode === 'learn') {
    return <LearningMode onBack={() => setMode(null)} useClassicPieces={useClassicPieces} />
  }

  if (mode === 'play') {
    return (
      <div className="game-container">
        {difficulty === null ? (
          <div className="difficulty-select">
            <h2>🌟 Choose Your Challenge 🌟</h2>
            <div className="difficulty-buttons">
              <button onClick={() => setDifficulty(1)} className="diff-btn easy">
                <span>🌸</span> Easy
                <small>Perfect for beginners!</small>
              </button>
              <button onClick={() => setDifficulty(2)} className="diff-btn medium">
                <span>🌺</span> Medium
                <small>A fun challenge!</small>
              </button>
              <button onClick={() => setDifficulty(3)} className="diff-btn hard">
                <span>🌹</span> Hard
                <small>For chess wizards!</small>
              </button>
            </div>
            <button className="back-btn" onClick={() => setMode(null)}>
              ← Back to Menu
            </button>
          </div>
        ) : (
          <ChessGame 
            difficulty={difficulty} 
            onBack={() => { setDifficulty(null); setMode(null) }}
            onChangeDifficulty={() => setDifficulty(null)}
            useClassicPieces={useClassicPieces}
          />
        )}
      </div>
    )
  }
}

export default App
