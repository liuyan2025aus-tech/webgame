// src/pages/Game2.js - Slido (Sliding Puzzle)
// 3x3 滑块拼图
// 说明: 保证初始局面可还原（奇偶校验），点击相邻空格的方块移动；复原即胜。
// Note: Ensures solvable start (parity), move tiles adjacent to zero; solved => win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const GOAL = [1,2,3,4,5,6,7,8,0];

// 生成可解的随机棋盘 / Shuffle until solvable and not already solved
function shuffleSolvable() {
  // Simple shuffle until solvable for 3x3 (parity check)
  const arr = [...GOAL];
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr) || arrayEquals(arr, GOAL));
  return arr;
}

function isSolvable(arr) {
  const inv = inversions(arr.filter(n => n !== 0));
  // 3x3 solvable if inversions count is even
  return inv % 2 === 0;
}

function inversions(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) count++;
    }
  }
  return count;
}

function arrayEquals(a,b){
  return a.length === b.length && a.every((v,i)=>v===b[i]);
}

function Game2() {
  const [board, setBoard] = useState(GOAL);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    setBoard(shuffleSolvable());
    setMoves(0);
  };

  // 执行移动：判断是否与空格相邻，交换并计步 / Move action
  const moveTile = (index) => {
    const zeroIdx = board.indexOf(0);
    const canMove = isAdjacent(index, zeroIdx);
    if (!canMove) return;
    const next = [...board];
    [next[index], next[zeroIdx]] = [next[zeroIdx], next[index]];
    setBoard(next);
    setMoves(m => m + 1);
    if (arrayEquals(next, GOAL)) {
      Storage.incrementGamesWon();
      Storage.updateHighScore(2, moves + 1);
      alert('Correct!');
      reset();
    }
  };

  // 是否相邻（曼哈顿距离为1）/ Adjacent check
  const isAdjacent = (i, j) => {
    const rowI = Math.floor(i / 3), colI = i % 3;
    const rowJ = Math.floor(j / 3), colJ = j % 3;
    return (Math.abs(rowI - rowJ) + Math.abs(colI - colJ)) === 1;
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Slido (Sliding Puzzle)</h2>
      <div className="game-info">
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board puzzle-board">
          {board.map((n, idx) => (
            <div
              key={idx}
              className={`grid-cell puzzle-cell`}
              onClick={() => moveTile(idx)}
              style={{ background: n === 0 ? '#eee' : 'white', cursor: n === 0 ? 'default' : 'pointer' }}
            >
              {n !== 0 ? n : ''}
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

export default Game2;