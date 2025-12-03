// src/pages/Game3.js - Tetro (2048-lite)
// 2048 合并小游戏
// 说明: 方向键移动，压缩并合并行/列，达到 2048 判胜；记录得分与最高分。
// Note: Arrow keys move; compress/merge rows; reaching 2048 wins; tracks score/high score.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const size = 4;

function emptyBoard() {
  return Array(size).fill(0).map(() => Array(size).fill(0));
}

function randomEmptyCell(board) {
  const empties = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return null;
  return empties[Math.floor(Math.random() * empties.length)];
}

function spawn(board) {
  const pos = randomEmptyCell(board);
  if (!pos) return board;
  const [r, c] = pos;
  const val = Math.random() < 0.9 ? 2 : 4;
  const next = board.map(row => row.slice());
  next[r][c] = val;
  return next;
}

function rotate(board) {
  const n = size;
  const res = emptyBoard();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      res[c][n - 1 - r] = board[r][c];
    }
  }
  return res;
}

function compress(row) {
  const vals = row.filter(v => v !== 0);
  while (vals.length < size) vals.push(0);
  return vals;
}

function merge(row) {
  let scoreGain = 0;
  for (let i = 0; i < size - 1; i++) {
    if (row[i] !== 0 && row[i] === row[i + 1]) {
      row[i] *= 2;
      scoreGain += row[i];
      row[i + 1] = 0;
    }
  }
  return { row, scoreGain };
}

function moveLeft(board) {
  let scoreGain = 0;
  const next = board.map(row => {
    let r = compress(row);
    const m = merge(r);
    r = compress(m.row);
    scoreGain += m.scoreGain;
    return r;
  });
  return { board: next, scoreGain };
}

function boardsEqual(a, b) {
  return a.every((row, r) => row.every((v, c) => v === b[r][c]));
}

function anyMoves(board) {
  // if any cell empty or any adjacent mergeable
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r][c];
      if (v === 0) return true;
      if (r + 1 < size && board[r + 1][c] === v) return true;
      if (c + 1 < size && board[r][c + 1] === v) return true;
    }
  }
  return false;
}

function Game3() {
  const [board, setBoard] = useState(spawn(spawn(emptyBoard())));
  const [score, setScore] = useState(0);

  // 键盘控制与移动处理 / Keyboard controls for moves
  useEffect(() => {
    const handler = (e) => {
      let b = board;
      let sGain = 0;
      if (e.key === 'ArrowLeft') {
        const { board: nb, scoreGain } = moveLeft(b);
        if (!boardsEqual(nb, b)) {
          b = spawn(nb);
          sGain = scoreGain;
        }
      } else if (e.key === 'ArrowRight') {
        // 右移通过旋转两次 -> 左移 -> 再旋转两次还原 / Right move via 180° rotate -> left -> rotate back
        const moved = moveLeft(rotate(rotate(b)));
        let nb = rotate(rotate(moved.board));
        const scoreGain = moved.scoreGain;
        if (!boardsEqual(nb, b)) {
          b = spawn(nb);
          sGain = scoreGain;
        }
      } else if (e.key === 'ArrowUp') {
        // 上移通过旋转270° -> 左移 -> 再旋转90°还原 / Up via 270° rotate -> left -> 90° back
        const moved = moveLeft(rotate(rotate(rotate(b))));
        let nb = rotate(moved.board);
        const scoreGain = moved.scoreGain;
        if (!boardsEqual(nb, b)) {
          b = spawn(nb);
          sGain = scoreGain;
        }
      } else if (e.key === 'ArrowDown') {
        // 下移通过旋转90° -> 左移 -> 再旋转270°还原 / Down via 90° rotate -> left -> 270° back
        const moved = moveLeft(rotate(b));
        let nb = rotate(rotate(rotate(moved.board)));
        const scoreGain = moved.scoreGain;
        if (!boardsEqual(nb, b)) {
          b = spawn(nb);
          sGain = scoreGain;
        }
      } else {
        return;
      }
      setBoard(b);
      if (sGain) setScore(sc => sc + sGain);

      // win if any tile reaches 2048
      if (b.flat().some(v => v >= 2048)) {
        Storage.incrementGamesWon();
        Storage.updateHighScore(3, score + sGain);
        alert('Correct!');
        reset();
      } else if (!anyMoves(b)) {
        alert('Game Over');
        reset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [board, score]);

  // 重置棋盘与分数 / Reset board and score
  const reset = () => {
    setBoard(spawn(spawn(emptyBoard())));
    setScore(0);
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Tetro (2048-lite)</h2>
      <div className="game-info">
        <div className="info-item"><span>Score:</span><strong>{score}</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(4, 80px)' }}>
          {board.flat().map((v, i) => (
            <div key={i} className="grid-cell" style={{ width: 80, height: 80, background: v ? '#fff' : '#eee' }}>
              {v || ''}
            </div>
          ))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default Game3;