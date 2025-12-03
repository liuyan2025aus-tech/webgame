// Snake-lite（简易贪吃蛇，20x15）
// 说明: 方向键控制；吃到食物增长与加分；碰撞边界或自身则结束。
// Note: Arrow keys control; eat food for growth and points; hitting wall/self ends.
import React, { useEffect, useRef, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const W = 20, H = 15;

function randCell(exclude){
  while(true){
    const p = [Math.floor(Math.random()*H), Math.floor(Math.random()*W)];
    if (!exclude.some(q=> q[0]===p[0] && q[1]===p[1])) return p;
  }
}

function SnakeLite(){
  const [snake, setSnake] = useState([[7,9],[7,8],[7,7]]); // [r,c]，头在第一个
  const [dir, setDir] = useState([0,1]);
  const [food, setFood] = useState([5,5]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    const initial = [[7,9],[7,8],[7,7]];
    setSnake(initial);
    setDir([0,1]);
    setFood(randCell(initial));
    setScore(0);
    setStatus('playing');
  };

  useEffect(()=>{
    const onKey = (e)=>{
      if (status !== 'playing') return;
      if (e.key==='ArrowUp' && dir[0]!==1) setDir([-1,0]);
      else if (e.key==='ArrowDown' && dir[0]!==-1) setDir([1,0]);
      else if (e.key==='ArrowLeft' && dir[1]!==1) setDir([0,-1]);
      else if (e.key==='ArrowRight' && dir[1]!==-1) setDir([0,1]);
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [dir, status]);

  useEffect(()=>{
    if (status !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setSnake(prev=>{
        const head = prev[0];
        const nextHead = [head[0]+dir[0], head[1]+dir[1]];
        // 撞墙或撞自己
        const out = nextHead[0]<0 || nextHead[0]>=H || nextHead[1]<0 || nextHead[1]>=W;
        const hitSelf = prev.some(p=> p[0]===nextHead[0] && p[1]===nextHead[1]);
        if (out || hitSelf){
          setStatus('over');
          Storage.updateHighScore(23, score);
          alert('Game Over');
          clearInterval(timerRef.current);
          return prev;
        }
        const eat = (nextHead[0]===food[0] && nextHead[1]===food[1]);
        const next = [nextHead, ...prev];
        if (!eat) next.pop();
        else {
          setScore(s=> s+1);
          setFood(randCell(next));
        }
        return next;
      });
    }, 200);
    return ()=> clearInterval(timerRef.current);
  }, [dir, status, food, score]);

  return (
    <div className="game-container">
      <h2 className="game-title">Snake-lite (20x15)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Score:</span><strong>{score}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>方向键控制；吃到红点</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: `repeat(${W}, 20px)` }}>
          {Array(H*W).fill(0).map((_,idx)=>{
            const r = Math.floor(idx/W), c = idx%W;
            const isFood = (food[0]===r && food[1]===c);
            const isSnake = snake.some(p=> p[0]===r && p[1]===c);
            return (
              <div key={idx} className="grid-cell" style={{ width:20, height:20, background: isSnake? '#2ecc71' : isFood? '#e74c3c' : '#eee' }} />
            );
          })}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default SnakeLite;