// Custom unicorn-themed chess pieces

const createPiece = (emoji) => ({ squareWidth }) => (
  <div style={{
    width: squareWidth,
    height: squareWidth,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: squareWidth * 0.7,
    filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))',
    cursor: 'grab'
  }}>
    {emoji}
  </div>
)

// Unicorn theme pieces
export const unicornPieces = {
  wP: createPiece('🤍'),
  wN: createPiece('🦄'),
  wB: createPiece('⭐'),
  wR: createPiece('🏰'),
  wQ: createPiece('👸'),
  wK: createPiece('🤴'),
  bP: createPiece('💜'),
  bN: createPiece('🎠'),
  bB: createPiece('🌟'),
  bR: createPiece('🗼'),
  bQ: createPiece('👑'),
  bK: createPiece('🎭')
}

// Classic pieces (using standard chess unicode)
export const classicPieces = undefined // Will use react-chessboard defaults
