import { useState } from 'react'
import ChessGame from './components/ChessGame'
import LearningMode from './components/LearningMode'
import './App.css'

function App() {
  const [mode, setMode] = useState(null)
  const [difficulty, setDifficulty] = useState(null)
  const [useClassicPieces, setUseClassicPieces] = useState(false)

  const playSound = (type) => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    } catch (e) {}
  }

  if (!mode) {
    return (
      <div className="menu-container" dir="rtl">
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
            <span className="rainbow-text">🦄 שחמט קסום 🦄</span>
          </h1>
          <p className="subtitle">למד ושחק שחמט עם קסם! ✨</p>
          
          <div className="menu-buttons">
            <button 
              className="menu-btn learn-btn"
              onClick={() => { playSound('start'); setMode('learn') }}
            >
              <span className="btn-icon">📚</span>
              <span className="btn-text">למד לשחק</span>
              <span className="btn-desc">גלה איך הכלים זזים!</span>
            </button>
            
            <button 
              className="menu-btn play-btn"
              onClick={() => { playSound('start'); setMode('play') }}
            >
              <span className="btn-icon">🎮</span>
              <span className="btn-text">התחל משחק</span>
              <span className="btn-desc">התמודד מול חד הקרן!</span>
            </button>
          </div>

          <div className="settings-preview">
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={useClassicPieces}
                onChange={(e) => setUseClassicPieces(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span>כלים קלאסיים</span>
            </label>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'learn') {
    return <LearningMode onBack={() => setMode(null)} useClassicPieces={useClassicPieces} />
  }

  if (mode === 'play') {
    return (
      <div className="game-container" dir="rtl">
        {difficulty === null ? (
          <div className="difficulty-select">
            <h2>🌟 בחר רמת קושי 🌟</h2>
            <div className="difficulty-buttons">
              <button onClick={() => setDifficulty(1)} className="diff-btn easy">
                <span>🌸</span> קל
                <small>מושלם למתחילים!</small>
              </button>
              <button onClick={() => setDifficulty(2)} className="diff-btn medium">
                <span>🌺</span> בינוני
                <small>אתגר כיפי!</small>
              </button>
              <button onClick={() => setDifficulty(3)} className="diff-btn hard">
                <span>🌹</span> קשה
                <small>לאלופי השחמט!</small>
              </button>
            </div>
            <button className="back-btn" onClick={() => setMode(null)}>
              → חזרה לתפריט
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
