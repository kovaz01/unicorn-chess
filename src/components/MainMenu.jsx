import { useState } from 'react'
import { playSound } from '../utils/sounds'

function MainMenu({ onStartGame, onLearn, onTutorial, theme, setTheme }) {
  const [showDifficulty, setShowDifficulty] = useState(false)

  const handlePlay = () => {
    playSound('click')
    setShowDifficulty(true)
  }

  const handleDifficulty = (diff) => {
    playSound('start')
    onStartGame(diff)
  }

  const handleLearn = () => {
    playSound('click')
    onLearn()
  }

  const handleTutorial = () => {
    playSound('click')
    onTutorial()
  }

  const toggleTheme = () => {
    playSound('click')
    setTheme(theme === 'unicorn' ? 'classic' : 'unicorn')
  }

  return (
    <div className="main-menu">
      <div className="title-container">
        <h1 className="game-title">
          {theme === 'unicorn' ? '🦄 ' : '♔ '}
          Unicorn Chess
          {theme === 'unicorn' ? ' 🦄' : ' ♔'}
        </h1>
        <p className="subtitle">Learn & Play Chess the Fun Way!</p>
      </div>

      {!showDifficulty ? (
        <div className="menu-buttons">
          <button className="menu-btn play-btn" onClick={handlePlay}>
            🎮 Play Game
          </button>
          <button className="menu-btn learn-btn" onClick={handleLearn}>
            📚 Learn Pieces
          </button>
          <button className="menu-btn tutorial-btn" onClick={handleTutorial}>
            🎓 Tutorial
          </button>
          <button className="menu-btn theme-btn" onClick={toggleTheme}>
            {theme === 'unicorn' ? '🏛️ Classic Theme' : '🦄 Unicorn Theme'}
          </button>
        </div>
      ) : (
        <div className="difficulty-select">
          <h2>Choose Your Level! 🌟</h2>
          <button className="diff-btn easy" onClick={() => handleDifficulty('easy')}>
            🌱 Easy
            <span className="diff-desc">Perfect for beginners!</span>
          </button>
          <button className="diff-btn medium" onClick={() => handleDifficulty('medium')}>
            🌿 Medium
            <span className="diff-desc">A bit more challenging!</span>
          </button>
          <button className="diff-btn hard" onClick={() => handleDifficulty('hard')}>
            🌳 Hard
            <span className="diff-desc">For chess champions!</span>
          </button>
          <button className="back-btn" onClick={() => setShowDifficulty(false)}>
            ← Back
          </button>
        </div>
      )}

      <div className="unicorn-decoration">
        {theme === 'unicorn' && (
          <>
            <span className="floating-emoji" style={{ left: '10%', animationDelay: '0s' }}>🌈</span>
            <span className="floating-emoji" style={{ left: '30%', animationDelay: '0.5s' }}>⭐</span>
            <span className="floating-emoji" style={{ left: '50%', animationDelay: '1s' }}>✨</span>
            <span className="floating-emoji" style={{ left: '70%', animationDelay: '1.5s' }}>💫</span>
            <span className="floating-emoji" style={{ left: '90%', animationDelay: '2s' }}>🌟</span>
          </>
        )}
      </div>
    </div>
  )
}

export default MainMenu
