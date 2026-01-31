import { useState, useCallback, useMemo } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import confetti from 'canvas-confetti'
import { playSound } from '../utils/sounds'
import { getBestMove, getEncouragingMessage, getMoveHint } from '../utils/ai'
import { unicornPieces } from '../utils/pieces.jsx'

function ChessGame({ difficulty, onBack, onChangeDifficulty, useClassicPieces }) {
  const [game, setGame] = useState(new Chess())
  const [moveHistory, setMoveHistory] = useState([])
  const [gameStatus, setGameStatus] = useState('playing')
  const [message, setMessage] = useState("תורך! הזז כלי לבן! 🌟")
  const [showHint, setShowHint] = useState(false)
  const [hintSquares, setHintSquares] = useState({})
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [validMoves, setValidMoves] = useState({})
  const [isThinking, setIsThinking] = useState(false)

  const updateStatus = useCallback((currentGame) => {
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'w' ? 'מחשב' : 'אתה'
      if (winner === 'אתה') {
        setGameStatus('won')
        setMessage("🎉 ניצחת! כל הכבוד, אלוף השחמט! 🏆")
        playSound('win')
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#ff6b9d', '#c44cff', '#6eb5ff', '#ffeb3b', '#4caf50']
        })
      } else {
        setGameStatus('lost')
        setMessage("אוי! אבל שיחקת יופי! נסה שוב? 💪")
        playSound('lose')
      }
    } else if (currentGame.isDraw()) {
      setGameStatus('draw')
      setMessage("תיקו! שיחקת מעולה! 🤝")
      playSound('draw')
    } else if (currentGame.isCheck()) {
      setMessage(currentGame.turn() === 'w' ? "⚠️ שח! תגן על המלך!" : "שמת את המחשב בשח! יופי! 👑")
      playSound('check')
    }
  }, [])

  const makeComputerMove = useCallback((currentGame) => {
    if (currentGame.isGameOver()) return

    setIsThinking(true)
    setMessage("🤔 המחשב חושב...")

    setTimeout(() => {
      const move = getBestMove(currentGame, difficulty)
      if (move) {
        const newGame = new Chess(currentGame.fen())
        const result = newGame.move(move)
        if (result) {
          playSound('move')
          setGame(newGame)
          setMoveHistory(prev => [...prev, result.san])
          updateStatus(newGame)
          
          if (!newGame.isGameOver()) {
            setMessage(getEncouragingMessage())
          }
        }
      }
      setIsThinking(false)
    }, difficulty === 1 ? 500 : difficulty === 2 ? 1000 : 1500)
  }, [difficulty, updateStatus])

  const onDrop = useCallback((sourceSquare, targetSquare) => {
    if (gameStatus !== 'playing' || game.turn() !== 'w' || isThinking) return false

    try {
      const newGame = new Chess(game.fen())
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      })

      if (move) {
        playSound('move')
        setGame(newGame)
        setMoveHistory(prev => [...prev, move.san])
        setSelectedSquare(null)
        setValidMoves({})
        setShowHint(false)
        setHintSquares({})
        
        updateStatus(newGame)
        
        if (!newGame.isGameOver()) {
          setTimeout(() => makeComputerMove(newGame), 300)
        }
        return true
      }
    } catch (e) {
      playSound('invalid')
      setMessage("אופס! מהלך לא חוקי. נסה שוב! 🤔")
    }
    return false
  }, [game, gameStatus, isThinking, makeComputerMove, updateStatus])

  const onSquareClick = useCallback((square) => {
    if (gameStatus !== 'playing' || game.turn() !== 'w' || isThinking) return

    const piece = game.get(square)
    
    if (selectedSquare) {
      const success = onDrop(selectedSquare, square)
      if (!success && piece && piece.color === 'w') {
        setSelectedSquare(square)
        const moves = game.moves({ square, verbose: true })
        const highlights = {}
        moves.forEach(move => {
          highlights[move.to] = {
            background: 'radial-gradient(circle, rgba(255,107,157,0.6) 25%, transparent 25%)',
            borderRadius: '50%'
          }
        })
        setValidMoves(highlights)
      } else if (!success) {
        setSelectedSquare(null)
        setValidMoves({})
      }
    } else if (piece && piece.color === 'w') {
      setSelectedSquare(square)
      const moves = game.moves({ square, verbose: true })
      const highlights = {}
      moves.forEach(move => {
        highlights[move.to] = {
          background: 'radial-gradient(circle, rgba(255,107,157,0.6) 25%, transparent 25%)',
          borderRadius: '50%'
        }
      })
      setValidMoves(highlights)
      playSound('click')
    }
  }, [game, gameStatus, isThinking, selectedSquare, onDrop])

  const getHint = () => {
    playSound('hint')
    const hint = getMoveHint(game)
    if (hint) {
      setShowHint(true)
      setHintSquares({
        [hint.from]: { background: 'rgba(255, 215, 0, 0.6)' },
        [hint.to]: { background: 'rgba(255, 215, 0, 0.6)' }
      })
      setMessage(`💡 נסה להזיז מ-${hint.from} ל-${hint.to}!`)
    }
  }

  const resetGame = () => {
    playSound('start')
    setGame(new Chess())
    setMoveHistory([])
    setGameStatus('playing')
    setMessage("תורך! הזז כלי לבן! 🌟")
    setShowHint(false)
    setHintSquares({})
    setSelectedSquare(null)
    setValidMoves({})
  }

  const customSquareStyles = useMemo(() => ({
    ...validMoves,
    ...hintSquares,
    ...(selectedSquare ? { [selectedSquare]: { background: 'rgba(255,107,157,0.4)' } } : {})
  }), [validMoves, hintSquares, selectedSquare])

  const difficultyText = difficulty === 1 ? '🌱 קל' : difficulty === 2 ? '🌿 בינוני' : '🌳 קשה'

  return (
    <div className="chess-game" dir="rtl">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>→ תפריט</button>
        <div className="difficulty-badge">{difficultyText}</div>
      </div>

      <div className="message-box">
        <p>{message}</p>
      </div>

      <div className="board-container">
        {isThinking && (
          <div className="thinking-overlay">
            <div className="thinking-spinner">🦄</div>
          </div>
        )}
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          customBoardStyle={{
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(196, 76, 255, 0.3)'
          }}
          customDarkSquareStyle={{ backgroundColor: '#c9a0dc' }}
          customLightSquareStyle={{ backgroundColor: '#ffe4f3' }}
          customSquareStyles={customSquareStyles}
          customPieces={useClassicPieces ? undefined : unicornPieces}
          boardWidth={Math.min(400, window.innerWidth - 40)}
          arePiecesDraggable={gameStatus === 'playing' && game.turn() === 'w' && !isThinking}
        />
      </div>

      <div className="game-controls">
        {gameStatus === 'playing' && (
          <button className="hint-btn" onClick={getHint} disabled={isThinking}>
            💡 רמז
          </button>
        )}
        <button className="reset-btn" onClick={resetGame}>
          🔄 משחק חדש
        </button>
      </div>

      <div className="move-history">
        <h3>📜 מהלכים</h3>
        <div className="moves-list">
          {moveHistory.length === 0 ? (
            <span className="no-moves">עדיין אין מהלכים!</span>
          ) : (
            moveHistory.map((move, i) => (
              <span key={i} className={`move ${i % 2 === 0 ? 'white-move' : 'black-move'}`}>
                {i % 2 === 0 ? `${Math.floor(i/2) + 1}. ` : ''}{move}
              </span>
            ))
          )}
        </div>
      </div>

      {gameStatus !== 'playing' && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>{gameStatus === 'won' ? '🎉 ניצחון! 🎉' : gameStatus === 'lost' ? '😢 סוף המשחק' : '🤝 תיקו!'}</h2>
            <p>{message}</p>
            <div className="game-over-buttons">
              <button className="play-again-btn" onClick={resetGame}>
                🎮 שחק שוב
              </button>
              <button className="menu-btn-small" onClick={onBack}>
                🏠 תפריט
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChessGame
