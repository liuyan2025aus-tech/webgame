// Tetro Mini（3x3 1024-lite）
// 说明: 方向键移动，3x3 棋盘合并到 1024 判胜；更紧凑的 2048 变体。
// Note: Arrow keys move; 3x3 board, reach 1024 to win; compact variant.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const size = 3;

function emptyBoard(){
  return Array(size).fill(0).map(()=> Array(size).fill(0));
}

function randomEmptyCell(board){
  const empties = [];
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) if (board[r][c]===0) empties.push([r,c]);
  if (empties.length===0) return null;
  return empties[Math.floor(Math.random()*empties.length)];
}

function spawn(board){
  const pos = randomEmptyCell(board);
  if (!pos) return board;
  const [r,c] = pos;
  const val = Math.random() < 0.85 ? 2 : 4;
  const next = board.map(row=> row.slice());
  next[r][c] = val;
  return next;
}

function rotate(board){
  const n = size;
  const res = emptyBoard();
  for (let r=0;r<n;r++) for (let c=0;c<n;c++) res[c][n-1-r] = board[r][c];
  return res;
}

function compress(row){
  const vals = row.filter(v=> v!==0);
  while (vals.length < size) vals.push(0);
  return vals;
}

function merge(row){
  let scoreGain = 0;
  for (let i=0;i<size-1;i++){
    if (row[i]!==0 && row[i]===row[i+1]){ row[i]*=2; scoreGain+=row[i]; row[i+1]=0; }
  }
  return { row, scoreGain };
}

function moveLeft(board){
  let scoreGain = 0;
  const next = board.map(r=>{
    let rr = compress(r);
    const m = merge(rr);
    rr = compress(m.row);
    scoreGain += m.scoreGain;
    return rr;
  });
  return { board: next, scoreGain };
}

function boardsEqual(a,b){
  return a.every((row,r)=> row.every((v,c)=> v===b[r][c]));
}

function anyMoves(board){
  for (let r=0;r<size;r++) for (let c=0;c<size;c++){
    const v = board[r][c];
    if (v===0) return true;
    if (r+1<size && board[r+1][c]===v) return true;
    if (c+1<size && board[r][c+1]===v) return true;
  }
  return false;
}

function TetroMini(){
  const [board, setBoard] = useState(spawn(spawn(emptyBoard())));
  const [score, setScore] = useState(0);

  useEffect(()=>{
    const handler = (e)=>{
      let b = board; let sGain = 0;
      if (e.key==='ArrowLeft'){
        const moved = moveLeft(b); const nb = moved.board; const sg = moved.scoreGain;
        if (!boardsEqual(nb, b)){ b = spawn(nb); sGain = sg; }
      } else if (e.key==='ArrowRight'){
        const moved = moveLeft(rotate(rotate(b))); let nb = rotate(rotate(moved.board)); const sg = moved.scoreGain;
        if (!boardsEqual(nb, b)){ b = spawn(nb); sGain = sg; }
      } else if (e.key==='ArrowUp'){
        const moved = moveLeft(rotate(rotate(rotate(b)))); let nb = rotate(moved.board); const sg = moved.scoreGain;
        if (!boardsEqual(nb, b)){ b = spawn(nb); sGain = sg; }
      } else if (e.key==='ArrowDown'){
        const moved = moveLeft(rotate(b)); let nb = rotate(rotate(rotate(moved.board))); const sg = moved.scoreGain;
        if (!boardsEqual(nb, b)){ b = spawn(nb); sGain = sg; }
      } else { return; }
      setBoard(b);
      if (sGain) setScore(sc=> sc + sGain);
      if (b.flat().some(v=> v>=1024)){
        Storage.incrementGamesWon();
        Storage.updateHighScore(18, score + sGain);
        alert('Correct!');
        reset();
      } else if (!anyMoves(b)){
        alert('Game Over');
        reset();
      }
    };
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  }, [board, score]);

  const reset = ()=>{ setBoard(spawn(spawn(emptyBoard()))); setScore(0); };

  return (
    <div className="game-container">
      <h2 className="game-title">Tetro Mini (3x3)</h2>
      <div className="game-info">
        <div className="info-item"><span>Score:</span><strong>{score}</strong></div>
        <div className="info-item"><span>Win:</span><strong>达到 1024 / Reach 1024</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(3, 80px)' }}>
          {board.flat().map((v,i)=> (
            <div key={i} className="grid-cell" style={{ width:80, height:80, background: v? '#fff':'#eee' }}>{v||''}</div>
          ))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default TetroMini;