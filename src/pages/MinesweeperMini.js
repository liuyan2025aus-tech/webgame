// Minesweeper-mini（简化扫雷）
// 说明: 6x6 棋盘、5 枚雷；点击打开安全格直到胜利；记录胜场与重置。
// Note: 6x6 grid with 5 mines; open safe cells to win; integrates with Storage.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 6; const MINES = 5;

// 生成棋盘：随机布雷并计算周围雷数 / Generate board with mines and counts
function genBoard(){
  const board = Array(N).fill(0).map(()=> Array(N).fill({ mine:false, open:false, count:0 }));
  // place mines
  let placed = 0;
  while(placed < MINES){
    const r = Math.floor(Math.random()*N), c = Math.floor(Math.random()*N);
    if (!board[r][c].mine){ board[r][c] = { ...board[r][c], mine:true }; placed++; }
  }
  // counts
  for(let r=0;r<N;r++){
    for(let c=0;c<N;c++){
      if (board[r][c].mine) continue;
      let cnt=0;
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        const nr=r+dr, nc=c+dc; if (nr<0||nc<0||nr>=N||nc>=N) continue; if (board[nr][nc].mine) cnt++;
      }
      board[r][c] = { ...board[r][c], count:cnt };
    }
  }
  return board;
}

function MinesweeperMini(){
  const [board, setBoard] = useState(genBoard());
  const [status, setStatus] = useState('playing');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(genBoard());
    setStatus('playing');
  };

  const openCell = (r,c)=>{
    if (status !== 'playing') return;
    const next = board.map(row=> row.map(cell=> ({...cell})));
    const cell = next[r][c];
    if (cell.open) return;
    cell.open = true;
    if (cell.mine){
      setStatus('lost');
      alert('Game Over');
      reset();
      return;
    }
    setBoard(next);
    // win check
    const openedSafe = next.flat().filter(c=>c.open && !c.mine).length;
    const safeTotal = N*N - MINES;
    if (openedSafe === safeTotal){
      Storage.incrementGamesWon();
      Storage.updateHighScore(8, safeTotal);
      alert('Correct!');
      reset();
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Minesweeper-mini</h2>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns:`repeat(${N}, 40px)` }}>
          {board.flat().map((cell, i)=>{
            const r = Math.floor(i / N), c = i % N;
            return (
              <div key={i} className="grid-cell" style={{ width:40, height:40, background: cell.open? '#fff':'#ccc' }} onClick={()=>openCell(r,c)}>
                {cell.open && !cell.mine ? (cell.count || '') : ''}
              </div>
            );
          })}
        </div>
      </div>
      <div className="game-controls"><button className="btn-secondary" onClick={reset}>(reset)</button></div>
    </div>
  );
}

export default MinesweeperMini;