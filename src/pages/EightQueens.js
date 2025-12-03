// Eight Queens（八皇后）
// 说明: 在 8x8 棋盘放置 8 个皇后，任意两个不可互相攻击；放满判胜。
// Note: Place 8 queens on 8x8 board; no two attack each other; full => win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 8;

function canPlace(queens, r, c){
  for (const [qr,qc] of queens){
    if (qr===r || qc===c) return false;
    if (Math.abs(qr-r) === Math.abs(qc-c)) return false;
  }
  return true;
}

function EightQueens(){
  const [queens, setQueens] = useState([]); // list of [r,c]
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');
  const [tip, setTip] = useState('点击空格放置皇后；已放的再点可移除');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setQueens([]);
    setMoves(0);
    setStatus('playing');
    setTip('点击空格放置皇后；已放的再点可移除');
  };

  const clickCell = (r,c)=>{
    if (status !== 'playing') return;
    const idx = queens.findIndex(q=> q[0]===r && q[1]===c);
    if (idx >= 0){
      const next = queens.slice();
      next.splice(idx,1);
      setQueens(next);
      return;
    }
    if (!canPlace(queens, r, c)) { setTip('无效位置（被攻击）/ Invalid (attacked)'); return; }
    const next = [...queens, [r,c]];
    setQueens(next);
    setMoves(m=> m+1);
    setTip('');
    if (next.length === 8){
      setStatus('over');
      Storage.incrementGamesWon();
      Storage.updateHighScore(21, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Eight Queens (8x8)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>{tip}</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: `repeat(${N}, 50px)` }}>
          {Array(N*N).fill(0).map((_,idx)=>{
            const r = Math.floor(idx/N), c = idx%N;
            const placed = queens.some(q=> q[0]===r && q[1]===c);
            const dark = (r+c)%2===1;
            return (
              <div key={idx} className="grid-cell" onClick={()=>clickCell(r,c)} style={{ width:50, height:50, background: dark? '#b58863':'#f0d9b5', fontSize:24, fontWeight:'bold' }}>
                {placed ? 'Q' : ''}
              </div>
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

export default EightQueens;