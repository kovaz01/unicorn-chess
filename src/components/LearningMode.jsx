import { useState, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

const pieces = [
  {
    name: 'Pawn',
    emoji: '♟️',
    unicorn: '💜',
    fen: '8/8/8/8/3P4/8/8/8 w - - 0 1',
    description: 'The little soldier! Pawns move forward one square, but capture diagonally. On their first move, they can jump two squares!',
    tips: ['Pawns can only move forward, never backward', 'They capture diagonally', 'If a pawn reaches the other side, it becomes a Queen! 👑']
  },
  {
    name: 'Knight',
    emoji: '♞',
    unicorn: '🦄',
    fen: '8/8/8/8/3N4/8/8/8 w - - 0 1',
    description: 'The magical jumper! Knights move in an L-shape: two squares in one direction and one square perpendicular. They can jump over other pieces!',
    tips: ['Knights are the only pieces that can jump over others', 'They always land on a different color square', 'Great for surprise attacks!']
  },
  {
    name: 'Bishop',
    emoji: '♝',
    unicorn: '⭐',
    fen: '8/8/8/8/3B4/8/8/8 w - - 0 1',
    description: 'The diagonal dancer! Bishops slide diagonally as many squares as they want. Each bishop stays on its starting color forever.',
    tips: ['Bishops can only move diagonally', 'One bishop stays on light squares, one on dark', 'They\'re great for long-range attacks']
  },
  {
    name: 'Rook',
    emoji: '♜',
    unicorn: '🏰',
    fen: '8/8/8/8/3R4/8/8/8 w - - 0 1',
    description: 'The tower of power! Rooks move in straight lines - up, down, left, or right - as many squares as they want.',
    tips: ['Rooks are very powerful in open positions', 'They work great together (doubled rooks)', 'Important for a special move called "castling"']
  },
  {
    name: 'Queen',
    emoji: '♛',
    unicorn: '👑',
    fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1',
    description: 'The superstar! The Queen combines the powers of the Rook and Bishop. She can move in any direction - straight or diagonal!',
    tips: ['The most powerful piece on the board', 'Can move like a Rook OR a Bishop', 'Protect your Queen - losing her is a big deal!']
  },
  {
    name: 'King',
    emoji: '♚',
    unicorn: '🤴',
    fen: '8/8/8/8/3K4/8/8/8 w - - 0 1',
    description: 'The most important piece! The King moves one square in any direction. If your King is trapped (checkmate), you lose!',
    tips: ['Protect your King at all costs', 'The King can capture pieces too', 'When in danger, the King is "in check"']
  }
]

const unicornPieces = {
  wP: '🤍', wN: '🦄', wB: '⭐', wR: '🏰', wQ: '👸', wK: '🤴',
  bP: '💜', bN: '🦄', bB: '🌟', bR: '🗼', bQ: '👑', bK: '🎭'
}

export default function LearningMode({ onBack, useClassicPieces }) {
  const [selectedPiece, setSelectedPiece] = useState(0)
  const [showMoves, setShowMoves] = useState(true)
  
  const currentPiece = pieces[selectedPiece]
  
  const validMoveSquares = useMemo(() => {
    if (!showMoves) return {}
    const game = new Chess(currentPiece.fen)
    const moves = game.moves({ verbose: true })
    const styles = {}
    
    moves.forEach(move => {
      styles[move.to] = {
        background: 'radial-gradient(circle, rgba(100,255,100,0.7) 40%, transparent 40%)',
        borderRadius: '50%'
      }
    })
    
    // Highlight the piece square
    const pieceSquare = currentPiece.fen.includes('P') || currentPiece.fen.includes('N') || 
                        currentPiece.fen.includes('B') || currentPiece.fen.includes('R') || 
                        currentPiece.fen.includes('Q') || currentPiece.fen.includes('K') ? 'd4' : 'd4'
    styles[pieceSquare] = { backgroundColor: 'rgba(255, 215, 0, 0.6)' }
    
    return styles
  }, [currentPiece, showMoves])

  const customPieces = useMemo(() => {
    if (useClassicPieces) return undefined
    
    const piecesObj = {}
    const pieceMap = ['wP', 'wN', 'wB', 'wR', 'wQ', 'wK', 'bP', 'bN', 'bB', 'bR', 'bQ', 'bK']
    
    pieceMap.forEach(piece => {
      piecesObj[piece] = ({ squareWidth }) => (
        <div style={{
          width: squareWidth,
          height: squareWidth,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: squareWidth * 0.7,
          filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))'
        }}>
          {unicornPieces[piece]}
        </div>
      )
    })
    return piecesObj
  }, [useClassicPieces])

  return (
    <div className="learning-mode">
      <div className="learning-header">
        <button className="back-btn" onClick={onBack}>← Menu</button>
        <h2>📚 Learn Chess Pieces</h2>
      </div>

      <div className="piece-selector">
        {pieces.map((piece, index) => (
          <button
            key={piece.name}
            className={`piece-btn ${selectedPiece === index ? 'active' : ''}`}
            onClick={() => setSelectedPiece(index)}
          >
            <span className="piece-icon">{useClassicPieces ? piece.emoji : piece.unicorn}</span>
            <span className="piece-name">{piece.name}</span>
          </button>
        ))}
      </div>

      <div className="learning-content">
        <div className="board-section">
          <Chessboard 
            position={currentPiece.fen}
            customSquareStyles={validMoveSquares}
            customPieces={customPieces}
            boardWidth={Math.min(window.innerWidth - 40, 350)}
            arePiecesDraggable={false}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(138, 43, 226, 0.3)'
            }}
            customLightSquareStyle={{ backgroundColor: '#ffe4f3' }}
            customDarkSquareStyle={{ backgroundColor: '#c9a0dc' }}
          />
          
          <label className="show-moves-toggle">
            <input 
              type="checkbox" 
              checked={showMoves}
              onChange={(e) => setShowMoves(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span>Show valid moves</span>
          </label>
        </div>

        <div className="info-section">
          <div className="piece-title">
            <span className="big-emoji">{useClassicPieces ? currentPiece.emoji : currentPiece.unicorn}</span>
            <h3>The {currentPiece.name}</h3>
          </div>
          
          <p className="piece-description">{currentPiece.description}</p>
          
          <div className="tips-box">
            <h4>💡 Tips:</h4>
            <ul>
              {currentPiece.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <button 
          className="nav-btn"
          disabled={selectedPiece === 0}
          onClick={() => setSelectedPiece(prev => prev - 1)}
        >
          ← Previous
        </button>
        <span className="piece-counter">{selectedPiece + 1} / {pieces.length}</span>
        <button 
          className="nav-btn"
          disabled={selectedPiece === pieces.length - 1}
          onClick={() => setSelectedPiece(prev => prev + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
