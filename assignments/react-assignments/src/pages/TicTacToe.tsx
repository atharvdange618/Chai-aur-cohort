import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Cpu, RotateCcw, Award } from "lucide-react";

type BoardState = (string | null)[];
type GameMode = "pvp" | "pve";
type Difficulty = "easy" | "hard";

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getWinner = (board: BoardState) => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
};

const getMinimaxScore = (
  tempBoard: BoardState,
  depth: number,
  isMaximizing: boolean,
): { score: number; index: number } => {
  const activeWin = getWinner(tempBoard);
  if (activeWin?.winner === "O") return { score: 10 - depth, index: -1 };
  if (activeWin?.winner === "X") return { score: depth - 10, index: -1 };
  if (tempBoard.every((cell) => cell !== null)) return { score: 0, index: -1 };

  const emptyIndices: number[] = [];
  tempBoard.forEach((cell, idx) => {
    if (cell === null) emptyIndices.push(idx);
  });

  if (isMaximizing) {
    let bestScore = -Infinity;
    let bestIndex = -1;
    for (const idx of emptyIndices) {
      tempBoard[idx] = "O";
      const result = getMinimaxScore(tempBoard, depth + 1, false);
      tempBoard[idx] = null;
      if (result.score > bestScore) {
        bestScore = result.score;
        bestIndex = idx;
      }
    }
    return { score: bestScore, index: bestIndex };
  } else {
    let bestScore = Infinity;
    let bestIndex = -1;
    for (const idx of emptyIndices) {
      tempBoard[idx] = "X";
      const result = getMinimaxScore(tempBoard, depth + 1, true);
      tempBoard[idx] = null;
      if (result.score < bestScore) {
        bestScore = result.score;
        bestIndex = idx;
      }
    }
    return { score: bestScore, index: bestIndex };
  }
};

const getAiMove = (
  currentBoard: BoardState,
  difficulty: Difficulty,
): number => {
  const emptyIndices: number[] = [];
  currentBoard.forEach((cell, idx) => {
    if (cell === null) emptyIndices.push(idx);
  });

  if (difficulty === "easy") {
    const randomIdx = Math.floor(Math.random() * emptyIndices.length);
    return emptyIndices[randomIdx];
  }

  const tempBoard = [...currentBoard];
  const bestMove = getMinimaxScore(tempBoard, 0, true);
  return bestMove.index;
};

export default function TicTacToe() {
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");

  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [scores, setScores] = useState({
    x: 0,
    o: 0,
    draws: 0,
  });

  const playMoveSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        300,
        audioCtx.currentTime + 0.08,
      );

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio synthesis not supported or blocked", e);
    }
  };

  const playWinSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const playTone = (freq: number, delay: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

        gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(
          0.2,
          audioCtx.currentTime + delay + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioCtx.currentTime + delay + dur,
        );

        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + dur);
      };

      playTone(523.25, 0, 0.15);
      playTone(659.25, 0.1, 0.15);
      playTone(783.99, 0.2, 0.15);
      playTone(1046.5, 0.3, 0.4);
    } catch (e) {
      console.warn("Audio synthesis not supported or blocked", e);
    }
  };

  const playDrawSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(147, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn("Audio synthesis not supported or blocked", e);
    }
  };

  const winData = getWinner(board);
  const winner = winData?.winner || null;
  const winningLine = winData?.line || null;
  const isDraw = !winner && board.every((cell) => cell !== null);

  useEffect(() => {
    if (gameMode === "pve" && turn === "O" && !winner && !isDraw) {
      const thinkingTimeout = setTimeout(() => {
        setIsAiThinking(true);
      }, 0);

      const moveTimeout = setTimeout(() => {
        const aiMoveIdx = getAiMove(board, difficulty);
        if (aiMoveIdx !== -1) {
          const nextBoard = [...board];
          nextBoard[aiMoveIdx] = "O";
          playMoveSound();
          setBoard(nextBoard);

          const winResult = getWinner(nextBoard);
          if (winResult) {
            playWinSound();
            setScores((prev) => ({
              ...prev,
              x: winResult.winner === "X" ? prev.x + 1 : prev.x,
              o: winResult.winner === "O" ? prev.o + 1 : prev.o,
            }));
          } else if (nextBoard.every((cell) => cell !== null)) {
            playDrawSound();
            setScores((prev) => ({
              ...prev,
              draws: prev.draws + 1,
            }));
          } else {
            setTurn("X");
          }
        }
        setIsAiThinking(false);
      }, 500);

      return () => {
        clearTimeout(thinkingTimeout);
        clearTimeout(moveTimeout);
      };
    }
  }, [turn, gameMode, winner, isDraw, board, difficulty]);

  const handleSquareClick = (index: number) => {
    if (
      board[index] ||
      winner ||
      isDraw ||
      (gameMode === "pve" && turn === "O")
    ) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = turn;
    playMoveSound();
    setBoard(nextBoard);

    const winResult = getWinner(nextBoard);
    if (winResult) {
      playWinSound();
      setScores((prev) => ({
        ...prev,
        x: winResult.winner === "X" ? prev.x + 1 : prev.x,
        o: winResult.winner === "O" ? prev.o + 1 : prev.o,
      }));
    } else if (nextBoard.every((cell) => cell !== null)) {
      playDrawSound();
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  const startNewGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setIsAiThinking(false);
  };

  const resetScores = () => {
    setScores({ x: 0, o: 0, draws: 0 });
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <nav className="w-full max-w-2xl mb-8 flex justify-start">
        <Link
          to="/"
          className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all duration-200"
        >
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-6 text-center">
        <h1 className="text-4xl font-semibold text-[#2d2d2d] flex items-center justify-center gap-2">
          Tic Tac Toe
        </h1>
        <p className="text-[#6b6b6b] mt-1">Challenge yourself or a friend</p>
      </header>

      <div className="w-full max-w-lg flex flex-col items-center gap-6">
        <div className="w-full flex gap-4 bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl p-3 shadow-[4px_4px_0_#2d2d2d]">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
              Game Mode
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setGameMode("pvp");
                  startNewGame();
                }}
                className={`flex-1 py-2 px-3 border-2 border-[#2d2d2d] rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  gameMode === "pvp"
                    ? "bg-[#2d2d2d] text-[#faf8f5] shadow-[2px_2px_0_#e8d5c4]"
                    : "bg-[#faf8f5] text-[#2d2d2d] hover:bg-[#e8d5c4]/30"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Pass & Play
              </button>
              <button
                onClick={() => {
                  setGameMode("pve");
                  startNewGame();
                }}
                className={`flex-1 py-2 px-3 border-2 border-[#2d2d2d] rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  gameMode === "pve"
                    ? "bg-[#2d2d2d] text-[#faf8f5] shadow-[2px_2px_0_#e8d5c4]"
                    : "bg-[#faf8f5] text-[#2d2d2d] hover:bg-[#e8d5c4]/30"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                vs AI
              </button>
            </div>
          </div>

          {gameMode === "pve" && (
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider">
                Difficulty
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDifficulty("easy")}
                  className={`flex-1 py-2 px-3 border-2 border-[#2d2d2d] rounded-lg font-semibold text-xs transition-all duration-200 cursor-pointer ${
                    difficulty === "easy"
                      ? "bg-[#2d2d2d] text-[#faf8f5]"
                      : "bg-[#faf8f5] text-[#2d2d2d] hover:bg-[#e8d5c4]/30"
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setDifficulty("hard")}
                  className={`flex-1 py-2 px-3 border-2 border-[#2d2d2d] rounded-lg font-semibold text-xs transition-all duration-200 cursor-pointer ${
                    difficulty === "hard"
                      ? "bg-[#2d2d2d] text-[#faf8f5]"
                      : "bg-[#faf8f5] text-[#2d2d2d] hover:bg-[#e8d5c4]/30"
                  }`}
                >
                  Unbeatable
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full grid grid-cols-3 border-2 border-[#2d2d2d] rounded-xl bg-[#e8d5c4] divide-x-2 divide-[#2d2d2d] overflow-hidden shadow-[4px_4px_0_#2d2d2d]">
          <div className="py-2.5 flex flex-col items-center bg-[#faf8f5]">
            <span className="text-[10px] font-bold text-[#6b6b6b] uppercase">
              Player X
            </span>
            <span className="text-xl font-extrabold text-[#2d2d2d]">
              {scores.x}
            </span>
          </div>
          <div className="py-2.5 flex flex-col items-center bg-[#faf8f5]">
            <span className="text-[10px] font-bold text-[#6b6b6b] uppercase">
              Draws
            </span>
            <span className="text-xl font-extrabold text-[#2d2d2d]">
              {scores.draws}
            </span>
          </div>
          <div className="py-2.5 flex flex-col items-center bg-[#faf8f5]">
            <span className="text-[10px] font-bold text-[#6b6b6b] uppercase">
              {gameMode === "pve" ? "Computer O" : "Player O"}
            </span>
            <span className="text-xl font-extrabold text-[#2d2d2d]">
              {scores.o}
            </span>
          </div>
        </div>

        <div className="w-full flex items-center justify-center min-h-[40px]">
          {winner ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#e8d5c4] border-2 border-[#2d2d2d] rounded-lg font-bold text-sm text-[#2d2d2d] animate-bounce">
              <Award className="w-4 h-4 text-amber-500 fill-current" />
              {winner === "X"
                ? "Player X"
                : gameMode === "pve"
                  ? "Computer O"
                  : "Player O"}{" "}
              Wins!
            </div>
          ) : isDraw ? (
            <div className="px-4 py-1.5 border-2 border-[#2d2d2d] rounded-lg font-bold text-sm text-[#6b6b6b] bg-[#faf8f5]">
              It's a Draw!
            </div>
          ) : (
            <div className="text-sm font-semibold text-[#2d2d2d]">
              {isAiThinking ? (
                <span className="inline-flex items-center gap-1">
                  Computer is planning...
                </span>
              ) : (
                <span>
                  Turn:{" "}
                  <strong className="font-extrabold">
                    {turn === "X"
                      ? "Player X"
                      : gameMode === "pve"
                        ? "Computer O"
                        : "Player O"}
                  </strong>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#faf8f5] border-2 border-[#2d2d2d] rounded-2xl p-4 shadow-[6px_6px_0_#2d2d2d] max-w-[340px] w-full aspect-square flex items-center justify-center">
          <div className="grid grid-cols-3 gap-3 w-full h-full">
            {board.map((cell, idx) => {
              const isWinningCell = winningLine?.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSquareClick(idx)}
                  disabled={!!cell || !!winner || isDraw || isAiThinking}
                  className={`w-full aspect-square border-2 border-[#2d2d2d] rounded-xl flex items-center justify-center text-4xl font-extrabold transition-all duration-200 cursor-pointer ${
                    isWinningCell
                      ? "bg-[#e8d5c4] text-[#2d2d2d] scale-105 shadow-[2px_2px_0_#2d2d2d]"
                      : cell
                        ? "bg-[#faf8f5] cursor-default text-[#2d2d2d]"
                        : "bg-[#faf8f5] hover:bg-[#e8d5c4]/30 hover:translate-y-[-1px] hover:shadow-[2px_2px_0_#2d2d2d] active:translate-y-0 active:shadow-none"
                  }`}
                >
                  <span
                    className={
                      cell === "X"
                        ? "text-orange-600"
                        : cell === "O"
                          ? "text-sky-600"
                          : ""
                    }
                  >
                    {cell}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full flex gap-4 mt-2">
          <button
            onClick={startNewGame}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2d2d2d] text-[#faf8f5] border-2 border-[#2d2d2d] rounded-xl font-bold text-sm hover:bg-[#1a1a1a] hover:translate-y-[-2px] hover:shadow-[3px_3px_0_#2d2d2d] active:translate-y-0 active:shadow-none transition-all duration-200 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            {winner || isDraw ? "Play Again" : "Reset Board"}
          </button>

          <button
            onClick={resetScores}
            disabled={scores.x === 0 && scores.o === 0 && scores.draws === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#2d2d2d] rounded-xl font-bold text-sm text-[#2d2d2d] hover:bg-[#2d2d2d] hover:text-[#faf8f5] hover:translate-y-[-2px] hover:shadow-[3px_3px_0_#2d2d2d] active:translate-y-0 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-transparent disabled:hover:text-[#2d2d2d] transition-all duration-200 cursor-pointer"
          >
            Reset Scores
          </button>
        </div>
      </div>
    </div>
  );
}
