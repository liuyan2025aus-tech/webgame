// Simon Says（跟随序列）
// 说明: 播放颜色序列，玩家按顺序点击；长度达 5 判胜。
// Note: Play color sequence; user repeats; reach length 5 to win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const COLORS = ['#e74c3c','#2ecc71','#3498db','#f1c40f'];

function SimonSays(){
  const [seq, setSeq] = useState([]);
  const [user, setUser] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [flash, setFlash] = useState(-1);

  useEffect(()=>{ reset(); },[]);

  // 重置序列与状态 / Reset sequence and state
  const reset = ()=>{
    setSeq([]);
    setUser([]);
    setPlaying(false);
    setFlash(-1);
  };

  // 播放下一步：生成新颜色并按节奏闪烁 / Playback with timed flashes
  const playNext = ()=>{
    const nextColor = Math.floor(Math.random()*4);
    const nextSeq = [...seq, nextColor];
    setSeq(nextSeq);
    setPlaying(true);
    // playback
    nextSeq.forEach((c, i)=>{
      setTimeout(()=>{ setFlash(c); }, i*600);
      setTimeout(()=>{ setFlash(-1); }, i*600 + 400);
    });
    setTimeout(()=> setPlaying(false), nextSeq.length*600 + 400);
    setUser([]);
  };

  // 用户输入：逐步比较，错误则重置；达到目标长度则胜 / Input compare & win
  const onPress = (idx)=>{
    if (playing) return;
    const nextUser = [...user, idx];
    setUser(nextUser);
    // compare
    for(let i=0;i<nextUser.length;i++){
      if (nextUser[i] !== seq[i]){
        alert('Wrong!');
        reset();
        return;
      }
    }
    if (nextUser.length === seq.length){
      if (seq.length >= 5){
        Storage.incrementGamesWon();
        Storage.updateHighScore(7, seq.length);
        alert('Correct!');
        reset();
      } else {
        playNext();
      }
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Simon Says</h2>
      <div className="game-board">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 120px)', gap: 12 }}>
          {COLORS.map((c, i)=> (
            <div key={i} onClick={()=>onPress(i)} style={{ width:120, height:120, background: c, opacity: flash===i? 0.5 : 1, borderRadius: 8, cursor:'pointer' }} />
          ))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-primary" onClick={playNext} disabled={playing}>Play sequence</button>
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default SimonSays;