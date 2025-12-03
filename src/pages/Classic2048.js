// 2048-classic（4x4）
// 说明: 方向键移动合并；达到 2048 判胜；记录累计分数为高分。
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 4;

function empty(){ return Array(N).fill(0).map(()=> Array(N).fill(0)); }
function randSpawn(board){
  const empties = [];
  for(let r=0;r<N;r++) for(let c=0;c<N;c++) if (board[r][c]===0) empties.push([r,c]);
  if (empties.length===0) return board;
  const [r,c] = empties[Math.floor(Math.random()*empties.length)];
  const val = Math.random()<0.9? 2:4;
  const next = board.map(row=> row.slice());
  next[r][c] = val;
  return next;
}

function compressRow(row){
  const nums = row.filter(v=> v!==0);
  const res = [];
  let scoreGain = 0;
  for(let i=0;i<nums.length;i++){
    if (i<nums.length-1 && nums[i]===nums[i+1]){ const v = nums[i]*2; res.push(v); scoreGain += v; i++; }
    else res.push(nums[i]);
  }
  while(res.length<N) res.push(0);
  return { row: res, gain: scoreGain };
}

function moveLeft(board){
  let gain = 0;
  const next = board.map(rw => {
    const cr = compressRow(rw);
    gain += cr.gain;
    return cr.row;
  });
  const changed = JSON.stringify(next) !== JSON.stringify(board);
  return { next, gain, changed };
}
function rotateCW(b){ const n= b.length; const r= Array(n).fill(0).map(()=> Array(n).fill(0)); for(let i=0;i<n;i++) for(let j=0;j<n;j++) r[j][n-1-i]=b[i][j]; return r; }
function rotateCCW(b){ const n= b.length; const r= Array(n).fill(0).map(()=> Array(n).fill(0)); for(let i=0;i<n;i++) for(let j=0;j<n;j++) r[n-1-j][i]=b[i][j]; return r; }
function moveRight(b){ const rot2= rotateCW(rotateCW(b)); const {next,gain,changed}= moveLeft(rot2); const back= rotateCW(rotateCW(next)); return { next: back, gain, changed } }
function moveUp(b){ const rot= rotateCCW(b); const {next,gain,changed}= moveLeft(rot); const back= rotateCW(next); return { next: back, gain, changed } }
function moveDown(b){ const rot= rotateCW(b); const {next,gain,changed}= moveLeft(rot); const back= rotateCCW(next); return { next: back, gain, changed } }

function anyMoves(b){
  for(let r=0;r<N;r++) for(let c=0;c<N;c++) if (b[r][c]===0) return true;
  // check merges
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    const v = b[r][c];
    if (r+1<N && b[r+1][c]===v) return true;
    if (c+1<N && b[r][c+1]===v) return true;
  }
  return false;
}

function Classic2048(){
  const [board, setBoard] = useState(randSpawn(randSpawn(empty())));
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ setStatus('playing'); },[]);

  useEffect(()=>{
    const handler = (e)=>{
      if (status !== 'playing') return;
      let res;
      if (e.key==='ArrowLeft') res = moveLeft(board);
      else if (e.key==='ArrowRight') res = moveRight(board);
      else if (e.key==='ArrowUp') res = moveUp(board);
      else if (e.key==='ArrowDown') res = moveDown(board);
      else return;
      if (!res.changed) return;
      let b = randSpawn(res.next);
      setScore(s=> s + res.gain);
      // win or over
      if (b.flat().some(v=> v>=2048)){
        setStatus('won');
        Storage.incrementGamesWon();
        Storage.updateHighScore(27, score + res.gain);
        alert('Correct!');
      } else if (!anyMoves(b)){
        setStatus('lost');
        alert('Game Over');
      }
      setBoard(b);
    };
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  }, [board, score, status]);

  const reset = ()=>{ setBoard(randSpawn(randSpawn(empty()))); setScore(0); setStatus('playing'); };

  return (
    <div className="game-container">
      <h2 className="game-title">2048-classic (4x4)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Score:</span><strong>{score}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>方向键移动合并</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(4, 80px)' }}>
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

export default Classic2048;