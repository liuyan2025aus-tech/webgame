// RockPaperScissors（剪刀石头布）
// 说明: 玩家选择 R/P/S，CPU 随机；判断胜负并记录连胜最高值。
// Note: Player picks R/P/S, CPU random; track best win streak.
import React, { useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const CHOICES = ['Rock','Paper','Scissors'];

function result(p, c){
  if (p === c) return 'draw';
  if ((p==='Rock' && c==='Scissors') || (p==='Paper' && c==='Rock') || (p==='Scissors' && c==='Paper')) return 'win';
  return 'lose';
}

function RockPaperScissors(){
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [last, setLast] = useState(null);

  const play = (choice)=>{
    const cpu = CHOICES[Math.floor(Math.random()*3)];
    const r = result(choice, cpu);
    setLast(`${choice} vs ${cpu}: ${r}`);
    if (r === 'win'){
      const ns = streak + 1;
      setStreak(ns);
      if (ns > best){ setBest(ns); Storage.updateHighScore(11, ns); }
      Storage.incrementGamesWon();
    } else if (r === 'lose') {
      setStreak(0);
    }
  };

  const reset = ()=>{ setStreak(0); setLast(null); };

  return (
    <div className="game-container">
      <h2 className="game-title">Rock-Paper-Scissors</h2>
      <div className="game-info">
        <div className="info-item"><span>Streak:</span><strong>{streak}</strong></div>
        <div className="info-item"><span>Best:</span><strong>{best}</strong></div>
      </div>
      <div className="game-board">
        <div className="game-play-area" style={{ textAlign:'center' }}>
          <p>{last || 'Choose your move:'}</p>
          <div className="game-controls" style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={()=>play('Rock')}>Rock</button>
            <button className="btn-primary" onClick={()=>play('Paper')}>Paper</button>
            <button className="btn-primary" onClick={()=>play('Scissors')}>Scissors</button>
            <button className="btn-secondary" onClick={reset}>(reset)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RockPaperScissors;