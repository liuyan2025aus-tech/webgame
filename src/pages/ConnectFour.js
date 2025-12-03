// Connect Four（四连棋，7x6）
// 说明: 玩家 X 与 CPU O 交替在列中下棋子，形成任意方向连续4个判胜。
// Note: Player X vs CPU O; drop in columns; any 4-in-a-row wins.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const ROWS = 6;
const COLS = 7;

function emptyBoard(){
  return Array(ROWS).fill(0).map(()=> Array(COLS).fill(''));
}

function drop(board, col, player){
  const next = board.map(row=> row.slice());
  for (let r = ROWS-1; r >= 0; r--){
    if (!next[r][col]){ next[r][col] = player; return next; }
  }
  return null; // column full
}

function checkWinner(b){
  const dirs = [[1,0],[0,1],[1,1],[1,-1]]; // vertical, horizontal, diag down, diag up
  for (let r=0;r<ROWS;r++){
    for (let c=0;c<COLS;c++){
      const ch = b[r][c];
      if (!ch) continue;
      for (const [dr,dc] of dirs){
        let count = 1;
        for (let k=1;k<4;k++){
          const nr = r+dr*k, nc = c+dc*k;
          if (nr<0 || nr>=ROWS || nc<0 || nc>=COLS) break;
          if (b[nr][nc] === ch) count++; else break;
        }
        if (count >= 4) return ch;
      }
    }
  }
  // draw if board full
  if (b[0].every(v=> v)) return 'draw';
  return null;
}

function ConnectFour(){
  const [board, setBoard] = useState(emptyBoard());
  const [turn, setTurn] = useState('X');
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(emptyBoard());
    setTurn('X');
    setMoves(0);
    setStatus('playing');
  };

  const playerDrop = (col)=>{
    if (status !== 'playing' || turn !== 'X') return;
    const next = drop(board, col, 'X');
    if (!next) return;
    setBoard(next);
    setMoves(m=> m+1);
    const w = checkWinner(next);
    if (w){
      setStatus('over');
      if (w === 'X'){ Storage.incrementGamesWon(); Storage.updateHighScore(17, Math.max(0, 100 - (moves + 1))); alert('Correct!'); }
      else if (w === 'draw'){ alert('Draw'); }
      else { alert('Game Over'); }
      return;
    }
    setTurn('O');
    setTimeout(()=> cpuDrop(next), 400);
  };

  const cpuDrop = (currentBoard)=>{
    const b = currentBoard ?? board;
    // pick random valid column
    const validCols = [];
    for (let c=0;c<COLS;c++) if (!b[0][c]) validCols.push(c);
    if (validCols.length === 0) return;
    const col = validCols[Math.floor(Math.random()*validCols.length)];
    const next = drop(b, col, 'O');
    if (!next) return;
    setBoard(next);
    setMoves(m=> m+1);
    const w = checkWinner(next);
    if (w){
      setStatus('over');
      if (w === 'X'){ Storage.incrementGamesWon(); Storage.updateHighScore(17, Math.max(0, 100 - (moves + 1))); alert('Correct!'); }
      else if (w === 'draw'){ alert('Draw'); }
      else { alert('Game Over'); }
      return;
    }
    setTurn('X');
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Connect Four</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>点击列顶部投棋 / Click column top to drop</strong></div>
      </div>
      <div className="game-board">
        <div style={{ display:'grid', gridTemplateColumns:`repeat(${COLS}, 60px)`, gap:'8px' }}>
          {Array(COLS).fill(0).map((_,c)=> (
            <div key={`col-${c}`} onClick={()=>playerDrop(c)} style={{ width:60, height:20, background:'#ddd', borderRadius:4, cursor:'pointer' }} />
          ))}
        </div>
        <div style={{ marginTop:10, display:'grid', gridTemplateColumns:`repeat(${COLS}, 60px)`, gap:'8px' }}>
          {board.flat().map((ch, idx)=> (
            <div key={idx} className="grid-cell" style={{ width:60, height:60, borderRadius: '50%', background: ch==='X'? '#007bff' : ch==='O'? '#ff6b6b' : '#eee' }} />
          ))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default ConnectFour;