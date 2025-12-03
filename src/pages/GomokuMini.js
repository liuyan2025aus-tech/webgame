// Gomoku-mini（13x13 五子棋，双人轮流）
// 说明: 玩家 X 与 O 轮流点击落子，任意方向连续5子即胜；判和为满盘未胜。
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 13;

function inBounds(r,c){ return r>=0 && r<N && c>=0 && c<N; }

function checkWin(board, r, c){
  const ch = board[r][c];
  const dirs = [[1,0],[0,1],[1,1],[1,-1]];
  for (const [dr,dc] of dirs){
    let count = 1;
    for (let k=1;k<5;k++){ const nr=r+dr*k, nc=c+dc*k; if (!inBounds(nr,nc)||board[nr][nc]!==ch) break; count++; }
    for (let k=1;k<5;k++){ const nr=r-dr*k, nc=c-dc*k; if (!inBounds(nr,nc)||board[nr][nc]!==ch) break; count++; }
    if (count>=5) return true;
  }
  return false;
}

function GomokuMini(){
  const [board, setBoard] = useState(Array(N).fill(0).map(()=> Array(N).fill(null)));
  const [turn, setTurn] = useState('X');
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(Array(N).fill(0).map(()=> Array(N).fill(null)));
    setTurn('X');
    setMoves(0);
    setStatus('playing');
  };

  const clickCell = (r,c)=>{
    if (status !== 'playing' || board[r][c]!==null) return;
    const next = board.map(row=> row.slice());
    next[r][c] = turn;
    setBoard(next);
    setMoves(m=> m+1);
    if (checkWin(next, r, c)){
      setStatus('over');
      if (turn === 'X'){ Storage.incrementGamesWon(); Storage.updateHighScore(26, Math.max(0, 100 - (moves + 1))); alert('Correct!'); }
      else { alert('Game Over'); }
      return;
    }
    if (next.flat().every(v=> v!==null)){ setStatus('over'); alert('Draw'); return; }
    setTurn(t=> t==='X' ? 'O' : 'X');
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Gomoku-mini (13x13)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Turn:</span><strong>{turn}</strong></div>
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: `repeat(${N}, 36px)` }}>
          {board.flat().map((ch,idx)=>{
            const r = Math.floor(idx/N), c = idx%N;
            return (
              <div key={idx} className="grid-cell" onClick={()=>clickCell(r,c)} style={{ width:36, height:36, background: '#fff' }}>{ch||''}</div>
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

export default GomokuMini;