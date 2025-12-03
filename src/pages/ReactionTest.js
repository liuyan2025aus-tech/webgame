// Reaction Time Test（反应时测试）
// 说明: 随机延迟后进入“Click now”，点击越快越好；低于阈值判胜。
// Note: Random delay, then "Click now"; fast click wins under threshold.
import React, { useEffect, useRef, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

function ReactionTest(){
  const [state, setState] = useState('idle'); // idle -> waiting -> ready -> done
  const [startTime, setStartTime] = useState(null);
  const [reaction, setReaction] = useState(null);
  const timerRef = useRef(null);

  // 开始：进入等待态，随机延迟后进入 ready / Start with random delay
  const start = () => {
    setReaction(null);
    setState('waiting');
    const delay = 1000 + Math.random()*2000;
    timerRef.current = setTimeout(()=>{
      setState('ready');
      setStartTime(performance.now());
    }, delay);
  };

  // 点击：在 ready 时记录反应时；在 waiting 时视为过早 / Click handling
  const click = () => {
    if (state === 'ready'){
      const rt = Math.round(performance.now() - startTime);
      setReaction(rt);
      setState('done');
      if (rt < 300){
        Storage.incrementGamesWon();
        Storage.updateHighScore(5, 300 - rt);
        alert('Correct!');
      }
    } else if (state === 'waiting'){
      // too soon
      setReaction(null);
      setState('idle');
      clearTimeout(timerRef.current);
      alert('Too soon!');
    }
  };

  useEffect(()=>()=> clearTimeout(timerRef.current),[]);

  return (
    <div className="game-container">
      <h2 className="game-title">Reaction Time Test</h2>
      <div className="game-board">
        <div style={{ textAlign:'center' }}>
          {state === 'idle' && <p>Click start, then click when instructed.</p>}
          {state === 'waiting' && <p>Wait for it...</p>}
          {state === 'ready' && <p style={{ color:'#28a745', fontWeight:'bold' }}>Click now!</p>}
          {state === 'done' && <p>Reaction: {reaction} ms</p>}
          <div style={{ marginTop: 20 }}>
            <button className="btn-primary" onClick={start}>Start</button>
            <button className="btn-secondary" onClick={click}>Click</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReactionTest;