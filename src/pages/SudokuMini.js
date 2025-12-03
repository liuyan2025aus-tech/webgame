// Sudoku-mini（4x4）
// 说明: 预置 4x4 数独，点击空格循环 1-4，满足行/列/2x2 宫约束即胜。
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

// 0 表示空格
const PUZZLE = [
  [0, 0, 3, 4],
  [3, 4, 0, 0],
  [0, 0, 1, 2],
  [1, 2, 0, 0],
];

function clone(g){ return g.map(r=> r.slice()); }

function isValid(grid){
  // 行列均为 1..4 且不重复；2x2 宫也不重复
  const N = 4;
  const setEq = (arr)=>{
    const s = new Set(arr);
    return s.size === 4 && [...s].every(v=> v>=1 && v<=4);
  };
  for(let r=0;r<N;r++) if (!setEq(grid[r])) return false;
  for(let c=0;c<N;c++){
    const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
    if (!setEq(col)) return false;
  }
  for(let br=0;br<4;br+=2){
    for(let bc=0;bc<4;bc+=2){
      const box = [grid[br][bc], grid[br][bc+1], grid[br+1][bc], grid[br+1][bc+1]];
      if (!setEq(box)) return false;
    }
  }
  return true;
}

function SudokuMini(){
  const [grid, setGrid] = useState(clone(PUZZLE));
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setGrid(clone(PUZZLE));
    setMoves(0);
    setStatus('playing');
  };

  const isFixed = (r,c)=> PUZZLE[r][c] !== 0;
  const cycle = (r,c)=>{
    if (status !== 'playing' || isFixed(r,c)) return;
    const next = clone(grid);
    next[r][c] = ((next[r][c] || 0) % 4) + 1;
    setGrid(next);
    setMoves(m=> m+1);
    // 判胜：无 0 且满足约束
    const filled = next.flat().every(v=> v!==0);
    if (filled && isValid(next)){
      setStatus('won');
      Storage.incrementGamesWon();
      Storage.updateHighScore(24, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Sudoku-mini (4x4)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>点击空格循环 1-4</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(4, 60px)' }}>
          {grid.flat().map((v,idx)=>{
            const r = Math.floor(idx/4), c = idx%4;
            const fixed = isFixed(r,c);
            return (
              <div key={idx} className="grid-cell" onClick={()=>cycle(r,c)} style={{ width:60, height:60, background: fixed? '#ddd':'#fff', fontWeight: fixed? 'bold':'normal' }}>{v||''}</div>
            );
          })}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default SudokuMini;