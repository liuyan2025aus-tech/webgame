// Number Guess（数字猜谜）
// 说明: 随机生成 1-100 的数字；玩家输入猜测并获得提示，高/低；猜中判胜。
// Note: Random number 1-100; player guesses with higher/lower feedback; correct => win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

function NumberGuess(){
  const [secret, setSecret] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('idle'); // idle/playing/over

  useEffect(()=>{ reset(); },[]);

  // 重置新局 / Reset a new game
  const reset = ()=>{
    setSecret(Math.floor(Math.random()*100)+1);
    setInput('');
    setAttempts(0);
    setFeedback('');
    setStatus('playing');
  };

  // 执行一次猜测 / Perform a guess
  const guess = ()=>{
    if (status !== 'playing') return;
    const n = parseInt(input, 10);
    if (Number.isNaN(n) || n < 1 || n > 100){
      setFeedback('请输入 1-100 的整数 / Enter an integer between 1 and 100');
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (n === secret){
      setFeedback('正确! Correct!');
      setStatus('over');
      Storage.incrementGamesWon();
      // 高分记为分数（分数=100-尝试次数，越多分越好）/ Score as 100 - attempts
      const points = Math.max(0, 100 - nextAttempts);
      Storage.updateHighScore(13, points);
      alert('Correct!');
    }else if (n < secret){
      setFeedback('偏小 / Too low');
    }else{
      setFeedback('偏大 / Too high');
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Number Guess</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Attempts:</span><strong>{attempts}</strong></div>
        <div className="info-item"><span>Feedback:</span><strong>{feedback}</strong></div>
      </div>
      <div className="game-board">
        <div className="game-start" style={{ width:'100%', textAlign:'center' }}>
          <input
            type="number"
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="1-100"
            style={{ padding:'10px', fontSize:'16px', width:'200px', marginRight:'10px' }}
          />
          <button className="btn-primary" onClick={guess}>Guess</button>
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default NumberGuess;