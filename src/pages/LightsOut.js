// Lights Out（熄灯，5x5）
// 说明: 点击切换该格与四邻居的状态；全部熄灭判胜。
// Note: Click toggles cell and its neighbors; all off => win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 5;

function emptyBoard(){
  return Array(N).fill(0).map(()=> Array(N).fill(false));
}

function cloneBoard(b){
  return b.map(row=> row.slice());
}

function randomStart(){
  // 随机点击若干次，生成可玩局面 / Apply random toggles
  let b = emptyBoard();
  const clicks = 8 + Math.floor(Math.random()*6);
  for (let k=0;k<clicks;k++){
    const r = Math.floor(Math.random()*N);
    const c = Math.floor(Math.random()*N);
    b = toggleAt(b, r, c);
  }
  return b;
}

function toggleAt(b, r, c){
  const next = cloneBoard(b);
  const dirs = [[0,0],[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dr,dc] of dirs){
    const nr = r+dr, nc = c+dc;
    if (nr>=0 && nr<N && nc>=0 && nc<N){
      next[nr][nc] = !next[nr][nc];
    }
  }
  return next;
}

function allOff(b){
  return b.every(row=> row.every(v=> !v));
}

function LightsOut(){
  const [board, setBoard] = useState(emptyBoard());
  const [moves, setMoves] = useState(0);

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(randomStart());
    setMoves(0);
  };

  const clickCell = (r,c)=>{
    const next = toggleAt(board, r, c);
    setBoard(next);
    setMoves(m=> m+1);
    if (allOff(next)){
      Storage.incrementGamesWon();
      Storage.updateHighScore(16, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
      reset();
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Lights Out (5x5)</h2>
      <div className="game-info">
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>点击切换当前与四邻格 / Toggle current + neighbors</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: `repeat(${N}, 60px)` }}>
          {board.flat().map((v, idx)=>{
            const r = Math.floor(idx / N), c = idx % N;
            return (
              <div key={idx} className="grid-cell" onClick={()=>clickCell(r,c)} style={{ width:60, height:60, background: v? '#007bff':'#eee' }} />
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

export default LightsOut;