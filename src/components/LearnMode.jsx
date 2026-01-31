import { useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { playSound } from '../utils/sounds'
import { unicornPieces, classicPieces } from '../utils/pieces'

const PIECES_INFO = [
  {
    name: 'King',
    symbol: '♔',
    emoji: '👑',
    description: 'The King is the most important piece! If your King is captured, you lose the game.',
    movement: 'The King can move ONE square in any direction - forward, backward, left, right, or diagonally.',
    tips: '• Always keep your King safe!\n• Castle early to protect your King\n• In the endgame, the King becomes more active',
    fen: '8/8/8/4K3/8/8/8/8 w - - 0 1',
    demoSquare: 'e5',
    color: 'w'
  },
  {
    name: 'Queen',
    symbol: '♕',
    emoji: '👸',
    description: 'The Queen is the most powerful piece! She can move like a Rook AND a Bishop combined.',
    movement: 'The Queen can move any number of squares horizontally, vertically, or diagonally.',
    tips: '• Don\'t bring out your Queen too early\n• Use her to attack multiple pieces at once\n• She\'s worth about 9 pawns!',
    fen: '8/8/8/4Q3/8/8/8/8 w - - 0 1',
    demoSquare: 'e5',
    color: 'w'
  },
  {
    name: 'Rook',
    symbol: '♖',
    emoji: '🏰',
    description: 'The Rook is a powerful piece that controls files and ranks.',
    movement: 'The Rook can move any number of squares horizontally or vertically (not diagonally).',
    tips: '• Rooks love open files (columns with no pawns)\n• Connect your Rooks to double their power\n• A Rook is worth about 5 pawns',
    fen: '8/8/8/4R3/8/8/8/8 w - - 0 1',
    demoSquare: 'e5',
    color: 'w'
  },
  {
    name: 'Bishop',
    symbol: '♗',
    emoji: '⛪',
    description: 'Bishops are sneaky pieces that attack diagonally!',
    movement: 'The Bishop can move any number of squares diagonally. It always stays on the same color.',
    tips: '• A Bishop on white squares can NEVER reach black squares\n• Two Bishops together are very powerful\n• A Bishop is worth about 3 pawns',
    fen: '8/8/8/4B3/8/8/8/8 w - - 0 1',
    demoSquare: 'e5',
    color: 'w'
  },
  {
    name: 'Knight',
    symbol: '♘',
    emoji: '🐴',
    description: 'The Knight is the trickiest piece! It moves in an "L" shape and can jump over other pieces.',
    movement: 'The Knight moves in an "L" pattern: 2 squares in one direction, then 1 square perpendicular. It can jump over pieces!',
    tips: '• Knights are great in closed positions\n• A Knight on the edge is sad (less squares to go to)\n• Knights are worth about 3 pawns',
    fen: '8/8/8/4N3/8/8/8/8 w - - 0 1',
    demoSquare: 'e5',
    color: 'w'
  },
  {
    name: 'Pawn',
    symbol: '♙',
    emoji: '⚔️',
    description: 'Pawns are the soul of chess! They may be small but they dream of becoming Queens.',
    movement: 'Pawns move forward 1 square (or 2 from starting position). They capture diagonally. When they reach the other side, they promote to any piece!',
    tips: '• Pawns can\'t move backwards!\n• Two pawns side by side protect each other\n• Getting a pawn to the end is called "promotion"',
    fen: '8/8/8/4P3/8/8/8/8 w - - 0 1',
    demoSquare: 'e5',
    color: 'w'
  }
]

function LearnMode({ theme, onBack }) {
  const [selectedPiece, setSelectedPiece] = useState(0)
  const [showMoves, setShowMoves] = useState(false)
  const [validMoves, setValidMoves] = useState({})

  const pieces = theme === 'unicorn' ? unicornPieces : classicPieces
  const piece = PIECES_INFO[selectedPiece]

  const handleShowMoves = () => {
    playSound('click')
    setShowMoves(!showMoves)
    
    if (!showMoves) {
      const game = new Chess(piece.fen)
      const moves = game.moves({ square: piece.demoSquare, verbose: true })
      const highlights = {}
      moves.forEach(move => {
        highlights[move.to] = {
          background: theme === 'unicorn' 
            ? 'radial-gradient(circle, rgba(255,107,157,0.7) 40%, transparent 40%)'
            : 'radial-gradient(circle, rgba(100,200,100,0.7) 40%, transparent 40%)'
        }
      })
      highlights[piece.demoSquare] = {
        background: 'rgba(255, 215, 0, 0.6)'
      }
      setValidMoves(highlights)
    } else {
      setValidMoves({})
    }
  }

  const selectPiece = (index) => {
    playSound('click')
    setSelectedPiece(index)
    setShowMoves(false)
    setValidMoves({})
  }

  const boardColors = theme === 'unicorn' 
    ? { light: '#ffe4f3', dark: '#c9a0dc' }
    : { light: '#f0d9b5', dark: '#b58863' }

  return (
    <div className="learn-mode">
      <div className="learn-header">
        <button className="back-btn" onClick={onBack}>← Menu</button>
        <h1>📚 Learn the Pieces</h1>
      </div>

      <div className="piece-selector">
        {PIECES_INFO.map((p, i) => (
          <button 
            key={p.name}
            className={`piece-tab ${selectedPiece === i ? 'active' : ''}`}
            onClick={() => selectPiece(i)}
          >
            {p.emoji}
          </button>
        ))}
      </div>

      <div className="learn-content">
        <div className="piece-info">
          <h2>{piece.emoji} The {piece.name}</h2>
          <p className="piece-description">{piece.description}</p>
          
          <div className="info-section">
            <h3>🚶 How it Moves:</h3>
            <p>{piece.movement}</p>
          </div>

          <div className="info-section">
            <h3>💡 Tips:</h3>
            <pre className="tips">{piece.tips}</pre>
          </div>
        </div>

        <div className="demo-board">
          <Chessboard
            position={piece.fen}
            customBoardStyle={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(196, 76, 255, 0.3)'
            }}
            customDarkSquareStyle={{ backgroundColor: boardColors.dark }}
            customLightSquareStyle={{ backgroundColor: boardColors.light }}
            customSquareStyles={validMoves}
            customPieces={pieces}
            boardWidth={Math.min(350, window.innerWidth - 40)}
            arePiecesDraggable={false}
          />
          <button className="show-moves-btn" onClick={handleShowMoves}>
            {showMoves ? '🙈 Hide Moves' : '👀 Show Valid Moves'}
          </button>
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          className="nav-btn"
          disabled={selectedPiece === 0}
          onClick={() => selectPiece(selectedPiece - 1)}
        >
          ← Previous
        </button>
        <span className="page-indicator">
          {selectedPiece + 1} / {PIECES_INFO.length}
        </span>
        <button 
          className="nav-btn"
          disabled={selectedPiece === PIECES_INFO.length - 1}
          onClick={() => selectPiece(selectedPiece + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default LearnMode
