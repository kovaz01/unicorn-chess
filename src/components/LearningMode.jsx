import { useState, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'

const pieces = [
  {
    name: 'רגלי',
    emoji: '♟️',
    unicorn: '💜',
    fen: '8/8/8/8/3P4/8/8/8 w - - 0 1',
    description: 'החייל הקטן! רגלים זזים קדימה משבצת אחת, אבל אוכלים באלכסון. במהלך הראשון שלהם, הם יכולים לקפוץ שני משבצות!',
    tips: ['רגלים יכולים לזוז רק קדימה, אף פעם אחורה', 'הם אוכלים באלכסון', 'אם רגלי מגיע לצד השני, הוא הופך למלכה! 👑']
  },
  {
    name: 'פרש',
    emoji: '♞',
    unicorn: '🦄',
    fen: '8/8/8/8/3N4/8/8/8 w - - 0 1',
    description: 'הקופץ הקסום! פרשים זזים בצורת L: שני משבצות בכיוון אחד ומשבצת אחת הצידה. הם יכולים לקפוץ מעל כלים אחרים!',
    tips: ['פרשים הם הכלים היחידים שיכולים לקפוץ מעל אחרים', 'הם תמיד נוחתים על צבע שונה', 'מעולים להתקפות הפתעה!']
  },
  {
    name: 'רץ',
    emoji: '♝',
    unicorn: '⭐',
    fen: '8/8/8/8/3B4/8/8/8 w - - 0 1',
    description: 'רקדן האלכסונים! רצים גולשים באלכסון כמה משבצות שרוצים. כל רץ נשאר על הצבע שלו לנצח.',
    tips: ['רצים יכולים לזוז רק באלכסון', 'רץ אחד על משבצות בהירות, אחד על כהות', 'הם מעולים להתקפות מרחוק']
  },
  {
    name: 'צריח',
    emoji: '♜',
    unicorn: '🏰',
    fen: '8/8/8/8/3R4/8/8/8 w - - 0 1',
    description: 'מגדל הכוח! צריחים זזים בקווים ישרים - למעלה, למטה, שמאלה או ימינה - כמה משבצות שרוצים.',
    tips: ['צריחים חזקים מאוד במצב פתוח', 'הם עובדים מעולה ביחד (צריחים כפולים)', 'חשובים למהלך מיוחד שנקרא "הצרחה"']
  },
  {
    name: 'מלכה',
    emoji: '♛',
    unicorn: '👑',
    fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1',
    description: 'הכוכבת! המלכה משלבת את הכוחות של הצריח והרץ. היא יכולה לזוז לכל כיוון - ישר או באלכסון!',
    tips: ['הכלי החזק ביותר על הלוח', 'יכולה לזוז כמו צריח או כמו רץ', 'תגן על המלכה - לאבד אותה זה קשה!']
  },
  {
    name: 'מלך',
    emoji: '♚',
    unicorn: '🤴',
    fen: '8/8/8/8/3K4/8/8/8 w - - 0 1',
    description: 'הכלי הכי חשוב! המלך זז משבצת אחת לכל כיוון. אם המלך שלך לכוד (מט), הפסדת!',
    tips: ['תגן על המלך בכל מחיר', 'המלך יכול גם לאכול כלים', 'כשהוא בסכנה, הוא "בשח"']
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
    
    const pieceSquare = 'd4'
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
    <div className="learning-mode" dir="rtl">
      <div className="learning-header">
        <button className="back-btn" onClick={onBack}>→ תפריט</button>
        <h2>📚 למד כלי שחמט</h2>
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
            <span>הצג מהלכים אפשריים</span>
          </label>
        </div>

        <div className="info-section">
          <div className="piece-title">
            <span className="big-emoji">{useClassicPieces ? currentPiece.emoji : currentPiece.unicorn}</span>
            <h3>ה{currentPiece.name}</h3>
          </div>
          
          <p className="piece-description">{currentPiece.description}</p>
          
          <div className="tips-box">
            <h4>💡 טיפים:</h4>
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
          disabled={selectedPiece === pieces.length - 1}
          onClick={() => setSelectedPiece(prev => prev + 1)}
        >
          הבא ←
        </button>
        <span className="piece-counter">{selectedPiece + 1} / {pieces.length}</span>
        <button 
          className="nav-btn"
          disabled={selectedPiece === 0}
          onClick={() => setSelectedPiece(prev => prev - 1)}
        >
          → הקודם
        </button>
      </div>
    </div>
  )
}
