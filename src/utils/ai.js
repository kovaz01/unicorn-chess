// Simple AI for chess game

const encouragingMessages = [
  "תור שלך! אתה יכול! 🌟",
  "מהלך מעולה! המשך ככה! 💪",
  "יופי! עכשיו תורך! ✨",
  "חשיבה טובה! מה המהלך הבא? 🤔",
  "אתה משחק נהדר! 🎯",
  "וואו! מהלך חכם! 🧠",
  "יפה מאוד! תמשיך! 🌈",
  "אתה אלוף! 🏆"
]

export const getEncouragingMessage = () => {
  return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
}

export const getBestMove = (game, difficulty) => {
  const moves = game.moves()
  if (moves.length === 0) return null
  
  // Difficulty affects how "smart" the AI is
  // Easy: mostly random
  // Medium: sometimes picks good moves
  // Hard: tries to pick best moves
  
  const diffLevel = difficulty === 1 ? 0.2 : difficulty === 2 ? 0.5 : 0.8
  
  // Score moves based on simple heuristics
  const scoredMoves = moves.map(move => {
    let score = Math.random() * 10
    
    // Prefer captures
    if (move.includes('x')) score += 20 * diffLevel
    
    // Prefer checks
    if (move.includes('+')) score += 30 * diffLevel
    
    // Prefer center control early
    if (move.includes('e4') || move.includes('d4') || move.includes('e5') || move.includes('d5')) {
      score += 15 * diffLevel
    }
    
    // Prefer piece development
    if (move.match(/^[NBRQK]/)) score += 10 * diffLevel
    
    // Checkmate is always best
    if (move.includes('#')) score += 1000
    
    return { move, score }
  })
  
  // Sort by score
  scoredMoves.sort((a, b) => b.score - a.score)
  
  // Pick from top moves based on difficulty
  const topN = difficulty === 1 ? moves.length : difficulty === 2 ? Math.ceil(moves.length / 2) : 3
  const candidates = scoredMoves.slice(0, Math.max(1, topN))
  
  return candidates[Math.floor(Math.random() * candidates.length)].move
}

export const getMoveHint = (game) => {
  const moves = game.moves({ verbose: true })
  if (moves.length === 0) return null
  
  // Try to find a good move to suggest
  let bestMove = moves[0]
  let bestScore = 0
  
  for (const move of moves) {
    let score = Math.random() * 5
    
    // Prefer captures
    if (move.captured) score += 20
    
    // Prefer checks
    if (move.san.includes('+')) score += 25
    
    // Prefer castling
    if (move.san === 'O-O' || move.san === 'O-O-O') score += 15
    
    // Prefer center moves
    if (['d4', 'd5', 'e4', 'e5'].includes(move.to)) score += 10
    
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }
  
  return { from: bestMove.from, to: bestMove.to }
}
