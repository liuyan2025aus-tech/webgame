// Wordle-lite（简化版）
// 说明: 5 字母，6 次机会，颜色反馈（绿/黄/灰）；猜中即胜。
// Note: 5 letters, 6 attempts, color feedback; correct guess increments wins.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const WORDS = ['APPLE','BRAIN','CHAIR','TRAIN','PLANT','ROBOT'];

// 随机选择答案 / Pick a random answer word
function pickWord() {
  return WORDS[Math.floor(Math.random()*WORDS.length)];
}

function WordleLite() {
  const [answer, setAnswer] = useState(pickWord());
  const [rows, setRows] = useState(Array(6).fill(''));
  const [current, setCurrent] = useState(0);
  const [status, setStatus] = useState('playing');

  useEffect(()=>{ setAnswer(pickWord()); setRows(Array(6).fill('')); setCurrent(0); setStatus('playing'); },[]);

  const submit = () => {
    const guess = rows[current].toUpperCase();
    if (guess.length !== 5) return;
    if (guess === answer) {
      Storage.incrementGamesWon();
      alert('Correct!');
      reset();
      return;
    }
    if (current === 5) {
      alert(`Game Over. Answer: ${answer}`);
      reset();
    } else {
      setCurrent(c=>c+1);
    }
  };

  // 重置答案与行 / Reset answer and rows
  const reset = () => {
    setAnswer(pickWord());
    setRows(Array(6).fill(''));
    setCurrent(0);
    setStatus('playing');
  };

  // 逐格反馈：正确位绿、存在但位置错黄、否则灰 / Per-cell feedback
  const feedback = (guess, i) => {
    const cells = [];
    for (let k=0;k<5;k++){
      const ch = guess[k] || '';
      let bg = '#eee';
      if (i < current) {
        if (ch === answer[k]) bg = '#6aaa64';
        else if (answer.includes(ch)) bg = '#c9b458';
        else bg = '#787c7e';
      }
      cells.push(
        <div key={k} className="grid-cell" style={{ width: 50, height: 50, background: bg, color: '#fff', fontWeight: 'bold' }}>
          {ch}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Wordle-lite</h2>
      <div className="game-board">
        <div style={{ display:'grid', gridTemplateRows:'repeat(6, 50px)', gap: 8 }}>
          {rows.map((r,i)=> (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'repeat(5, 50px)', gap: 8 }}>
              {feedback(r.toUpperCase(), i)}
            </div>
          ))}
        </div>
      </div>
      <div className="game-controls">
        <input
          type="text"
          maxLength={5}
          value={rows[current]}
          onChange={e=> setRows(rs=> rs.map((x,idx)=> idx===current? e.target.value : x))}
          style={{ textTransform:'uppercase' }}
        />
        <button className="btn-primary" onClick={submit}>Submit</button>
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default WordleLite;