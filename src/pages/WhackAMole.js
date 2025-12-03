// Whack-a-Mole（打地鼠）
// 说明: 3x3 网格，随机地鼠位置；20s 内尽量点击，达到阈值判胜。
// Note: 3x3 grid with random mole; score within 20s, pass threshold to win.
import React, { useEffect, useRef, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

function WhackAMole(){
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef(null);
  const moleRef = useRef(null);

  useEffect(()=>{ reset(); },[]);

  // 重置分数与计时器、随机地鼠刷新 / Reset timers and mole position
  const reset = ()=>{
    setScore(0);
    setTimeLeft(20);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if (t <= 1){
          clearInterval(timerRef.current);
          clearInterval(moleRef.current);
          if (score >= 5){
            Storage.incrementGamesWon();
            Storage.updateHighScore(6, score);
            alert('Correct!');
          } else {
            alert('Game Over');
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    if (moleRef.current) clearInterval(moleRef.current);
    moleRef.current = setInterval(()=> setPos(Math.floor(Math.random()*9)), 800);
  };

  // 点击命中加分 / Scoring when clicking the mole cell
  const clickCell = (i)=>{
    if (i === pos) setScore(s=> s+1);
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Whack-a-Mole</h2>
      <div className="game-info">
        <div className="info-item"><span>Score:</span><strong>{score}</strong></div>
        <div className="info-item"><span>Time:</span><strong>{timeLeft}s</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns:'repeat(3, 80px)' }}>
          {Array.from({ length: 9 }).map((_, i)=> (
            <div key={i} className="grid-cell" style={{ width:80, height:80, background: i===pos? '#28a745':'#eee' }} onClick={()=>clickCell(i)} />
          ))}
        </div>
      </div>
      <div className="game-controls"><button className="btn-secondary" onClick={reset}>(reset)</button></div>
    </div>
  );
}

export default WhackAMole;