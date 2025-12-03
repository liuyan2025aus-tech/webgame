// Mastermind-mini（四色密码）
// 说明: 6种颜色中随机生成4位密码；每次提交获得黑白提示（位置与颜色都对=黑，颜色对位置错=白）；猜中胜利。
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const COLORS = ['#e74c3c','#3498db','#f1c40f','#2ecc71','#9b59b6','#e67e22'];
const MAX_ATTEMPTS = 8;

function randCode(){ return Array(4).fill(0).map(()=> Math.floor(Math.random()*COLORS.length)); }

function feedback(secret, guess){
  // 黑：位置颜色都对；白：颜色对但位置错（不重复计数）
  const usedS = Array(4).fill(false);
  const usedG = Array(4).fill(false);
  let black = 0, white = 0;
  for(let i=0;i<4;i++){
    if (guess[i] === secret[i]){ black++; usedS[i]=true; usedG[i]=true; }
  }
  for(let i=0;i<4;i++){
    if (usedG[i]) continue;
    for(let j=0;j<4;j++){
      if (usedS[j]) continue;
      if (guess[i] === secret[j]){ white++; usedS[j]=true; usedG[i]=true; break; }
    }
  }
  return { black, white };
}

function MastermindMini(){
  const [secret, setSecret] = useState(randCode());
  const [rows, setRows] = useState([]); // { guess: [4], fb: {black,white} }
  const [current, setCurrent] = useState([0,0,0,0]);
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setSecret(randCode());
    setRows([]);
    setCurrent([0,0,0,0]);
    setAttempts(0);
    setStatus('playing');
  };

  const cycle = (i)=>{
    if (status !== 'playing') return;
    const next = [...current];
    next[i] = (next[i]+1) % COLORS.length;
    setCurrent(next);
  };

  const submit = ()=>{
    if (status !== 'playing') return;
    const fb = feedback(secret, current);
    const nextRows = [...rows, { guess: current, fb }];
    setRows(nextRows);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (fb.black === 4){
      setStatus('won');
      Storage.incrementGamesWon();
      Storage.updateHighScore(25, Math.max(0, 100 - nextAttempts));
      alert('Correct!');
      return;
    }
    if (nextAttempts >= MAX_ATTEMPTS){ setStatus('lost'); alert('Game Over'); }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Mastermind-mini</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Attempts:</span><strong>{attempts}/{MAX_ATTEMPTS}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>点击圆点换色，提交获取提示</strong></div>
      </div>
      <div className="game-board" style={{ display:'flex', gap:20 }}>
        <div>
          <div style={{ display:'flex', gap:10, marginBottom:10 }}>
            {current.map((ci,idx)=> (
              <div key={idx} onClick={()=>cycle(idx)} style={{ width:40, height:40, borderRadius:'50%', background: COLORS[ci], cursor:'pointer' }} />
            ))}
          </div>
          <button className="btn-primary" onClick={submit}>Submit</button>
        </div>
        <div>
          <h4>History</h4>
          {rows.map((row,i)=> (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, margin:'6px 0' }}>
              <div style={{ display:'flex', gap:6 }}>
                {row.guess.map((ci,idx)=> (<div key={idx} style={{ width:20, height:20, borderRadius:'50%', background: COLORS[ci] }} />))}
              </div>
              <span>Black: {row.fb.black} / White: {row.fb.white}</span>
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

export default MastermindMini;