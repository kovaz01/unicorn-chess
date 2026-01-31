import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { playSound } from '../utils/sounds'
import { unicornPieces, classicPieces } from '../utils/pieces'

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Chess! 🎉",
    content: "Chess is a game of strategy played between two players. You'll control the WHITE pieces, and the computer controls the BLACK pieces. Let's learn the basics!",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    highlights: {}
  },
  {
    title: "The Goal of Chess 🎯",
    content: "The goal is to CHECKMATE the opponent's King. Checkmate means the King is under attack and has NO way to escape. Protect YOUR King while attacking theirs!",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    highlights: {
      e1: { background: 'rgba(0, 255, 0, 0.5)' },
      e8: { background: 'rgba(255, 0, 0, 0.5)' }
    }
  },
  {
    title: "Your Pieces Start Here 📍",
    content: "White pieces always start at the bottom. You have: 8 Pawns (front row), 2 Rooks (corners), 2 Knights (next to rooks), 2 Bishops (next to knights), 1 Queen, and 1 King!",
    fen: "8/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    highlights: {
      a1: { background: 'rgba(255, 215, 0, 0.5)' },
      h1: { background: 'rgba(255, 215, 0, 0.5)' },
      b1: { background: 'rgba(100, 200, 255, 0.5)' },
      g1: { background: 'rgba(100, 200, 255, 0.5)' },
      c1: { background: 'rgba(200, 100, 255, 0.5)' },
      f1: { background: 'rgba(200, 100, 255, 0.5)' },
      d1: { background: 'rgba(255, 100, 150, 0.5)' },
      e1: { background: 'rgba(100, 255, 100, 0.5)' }
    }
  },
  {
    title: "Making Your First Move 🚀",
    content: "Click on a piece to select it, then click where you want to move. Or drag and drop! Yellow dots show where you can move. Let's try moving a Pawn forward!",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    highlights: {
      e2: { background: 'rgba(255, 215, 0, 0.6)' },
      e3: { background: 'radial-gradient(circle, rgba(255,107,157,0.6) 25%, transparent 25%)' },
      e4: { background: 'radial-gradient(circle, rgba(255,107,157,0.6) 25%, transparent 25%)' }
    }
  },
  {
    title: "Capturing Pieces ⚔️",
    content: "To capture an enemy piece, move your piece to its square! Most pieces capture the same way they move. But Pawns are special - they capture DIAGONALLY!",
    fen: "8/8/8/3p4/4P3/8/8/8 w - - 0 1",
    highlights: {
      e4: { background: 'rgba(255, 215, 0, 0.6)' },
      d5: { background: 'rgba(255, 100, 100, 0.6)' },
      e5: { background: 'radial-gradient(circle, rgba(255,107,157,0.6) 25%, transparent 25%)' }
    }
  },
  {
    title: "Check! ⚠️",
    content: "When a King is under attack, it's called CHECK. You MUST escape check immediately! You can: move the King, block with another piece, or capture the attacking piece.",
    fen: "4k3/8/8/8/8/8/4R3/4K3 w - - 0 1",
    highlights: {
      e2: { background: 'rgba(255, 215, 0, 0.6)' },
      e8: { background: 'rgba(255, 0, 0, 0.6)' }
    }
  },
  {
    title: "Checkmate = Victory! 🏆",
    content: "Checkmate ends the game! The King is in check AND cannot escape. Here, the black King is checkmated - no safe squares!",
    fen: "6k1/5ppp/8/8/8/8/4R3/4R1K1 w - - 0 1",
    highlights: {
      e1: { background: 'rgba(255, 215, 0, 0.6)' },
      e2: { background: 'rgba(255, 215, 0, 0.6)' },
      g8: { background: 'rgba(255, 0, 0, 0.6)' }
    }
  },
  {
    title: "Pro Tips! 💡",
    content: "1. Control the CENTER of the board\n2. Develop your pieces (move them out early)\n3. Castle to protect your King\n4. Think before you move!\n5. Have FUN! 🎉",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
    highlights: {
      d4: { background: 'rgba(255, 215, 0, 0.3)' },
      d5: { background: 'rgba(255, 215, 0, 0.3)' },
      e4: { background: 'rgba(255, 215, 0, 0.3)' },
      e5: { background: 'rgba(255, 215, 0, 0.3)' }
    }
  },
  {
    title: "You're Ready! 🦄",
    content: "You now know the basics of chess! Start with EASY mode and use the HINT button if you get stuck. Learn more about each piece in the 'Learn Pieces' section. Good luck, champion! 🌟",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    highlights: {}
  }
]

function Tutorial({ theme, onBack }) {
  const [step, setStep] = useState(0)
  
  const pieces = theme === 'unicorn' ? unicornPieces : classicPieces
  const currentStep = TUTORIAL_STEPS[step]

  const nextStep = () => {
    playSound('click')
    if (step < TUTORIAL_STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    playSound('click')
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const boardColors = theme === 'unicorn' 
    ? { light: '#ffe4f3', dark: '#c9a0dc' }
    : { light: '#f0d9b5', dark: '#b58863' }

  return (
    <div className="tutorial">
      <div className="tutorial-header">
        <button className="back-btn" onClick={onBack}>← Menu</button>
        <h1>🎓 Chess Tutorial</h1>
      </div>

      <div className="tutorial-progress">
        {TUTORIAL_STEPS.map((_, i) => (
          <div 
            key={i} 
            className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
          />
        ))}
      </div>

      <div className="tutorial-content">
        <div className="step-info">
          <h2>{currentStep.title}</h2>
          <p className="step-content">{currentStep.content}</p>
        </div>

        <div className="tutorial-board">
          <Chessboard
            position={currentStep.fen}
            customBoardStyle={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(196, 76, 255, 0.3)'
            }}
            customDarkSquareStyle={{ backgroundColor: boardColors.dark }}
            customLightSquareStyle={{ backgroundColor: boardColors.light }}
            customSquareStyles={currentStep.highlights}
            customPieces={pieces}
            boardWidth={Math.min(350, window.innerWidth - 40)}
            arePiecesDraggable={false}
          />
        </div>
      </div>

      <div className="tutorial-navigation">
        <button 
          className="nav-btn"
          disabled={step === 0}
          onClick={prevStep}
        >
          ← Previous
        </button>
        <span className="step-counter">
          {step + 1} / {TUTORIAL_STEPS.length}
        </span>
        {step === TUTORIAL_STEPS.length - 1 ? (
          <button className="nav-btn finish-btn" onClick={onBack}>
            🎮 Play Now!
          </button>
        ) : (
          <button className="nav-btn" onClick={nextStep}>
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

export default Tutorial
