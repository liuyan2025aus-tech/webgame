// TicTacToe（三子棋）
// 说明: 玩家为 X，CPU 为 O；玩家点击空格落子，CPU随机回应；三连线判胜。
// Note: Player is X, CPU is O; click to place; three-in-a-row wins.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diags
];

function checkWinner(board){
  for (const [a,b,c] of LINES){
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(x=> x) ? 'draw' : null;
}

function TicTacToe(){
  const [board, setBoard] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('X'); // X then O
  const [status, setStatus] = useState('idle'); // idle/playing/over

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(Array(9).fill(''));
    setTurn('X');
    setStatus('playing');
  };

  const playerMove = (i)=>{
    if (status !== 'playing' || board[i]) return;
    const next = [...board];
    next[i] = 'X';
    const w = checkWinner(next);
    if (w){
      setBoard(next);
      setStatus('over');
      if (w === 'X') { Storage.incrementGamesWon(); Storage.updateHighScore(10, 1); alert('Correct!'); }
      else if (w === 'draw') { alert('Draw'); }
      else { alert('Game Over'); }
      return;
    }
    setBoard(next);
    setTurn('O');
    // 传入最新棋盘，避免闭包使用旧状态 / Pass latest board to avoid stale closure
    setTimeout(() => cpuMove(next), 300);
  };

  const cpuMove = (currentBoard)=>{
    const b = currentBoard ?? board;
    const empties = b.map((v,i)=> v? null : i).filter(i=> i!==null);
    if (empties.length === 0) return;
    const pick = empties[Math.floor(Math.random()*empties.length)];
    const next = [...b];
    next[pick] = 'O';
    const w = checkWinner(next);
    if (w){
      setBoard(next);
      setStatus('over');
      if (w === 'X') { Storage.incrementGamesWon(); Storage.updateHighScore(10, 1); alert('Correct!'); }
      else if (w === 'draw') { alert('Draw'); }
      else { alert('Game Over'); }
      return;
    }
    setBoard(next);
    setTurn('X');
  };

  return (
    <div className="game-container">
      <h2 className="game-title">TicTacToe</h2>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(3, 80px)' }}>
          {board.map((v,i)=> (
            <div key={i} className="grid-cell" style={{ width:80, height:80, fontSize:28, fontWeight:'bold' }} onClick={()=>playerMove(i)}>
              {v}
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

export default TicTacToe;