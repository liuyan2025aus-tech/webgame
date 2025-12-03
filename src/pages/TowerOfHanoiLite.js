// Tower of Hanoi（汉诺塔简化版）
// 说明: 3 根柱子、3 个盘子；点击选择来源柱与目标柱，遵循小盘在大盘之上；全部移到目标柱判胜。
// Note: 3 pegs, 3 discs; click source then target, respecting smaller-on-larger; move all to target to win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const DISC_COUNT = 3;

function TowerOfHanoiLite(){
  const [pegs, setPegs] = useState([[],[],[]]); // 每柱栈顶为数组末尾 / top is end
  const [selected, setSelected] = useState(null); // 选中的来源柱索引
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  // 初始化：所有盘在第0柱（大->小）/ Init with all discs on peg 0
  const reset = ()=>{
    setPegs([Array.from({length:DISC_COUNT}, (_,i)=> DISC_COUNT - i), [], []]);
    setSelected(null);
    setMoves(0);
    setStatus('playing');
  };

  // 点击柱子 / Handle peg click
  const clickPeg = (idx)=>{
    if (status !== 'playing') return;
    if (selected === null){
      // 选择来源柱（必须非空）
      if (pegs[idx].length === 0) return;
      setSelected(idx);
      return;
    }
    if (selected === idx){
      // 再次点击同一柱取消选择
      setSelected(null);
      return;
    }
    // 尝试移动 selected -> idx
    const src = selected;
    const dst = idx;
    const from = [...pegs[src]];
    const to = [...pegs[dst]];
    const disc = from[from.length - 1];
    if (disc === undefined){
      setSelected(null);
      return;
    }
    const topDst = to[to.length - 1];
    if (topDst !== undefined && topDst < disc){
      // 目标柱顶比当前盘更小，违规 / invalid move
      setSelected(null);
      return;
    }
    from.pop();
    to.push(disc);
    const next = pegs.map((p, i)=> (i===src? from : i===dst? to : p));
    setPegs(next);
    setSelected(null);
    setMoves(m=> m+1);
    // 胜利条件：全部移动到第2柱 / win if all discs at peg 2
    if (next[2].length === DISC_COUNT){
      setStatus('over');
      Storage.incrementGamesWon();
      // 高分记为分数（分数=100-步数，越多分越好）/ Score as 100 - moves
      Storage.updateHighScore(14, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
    }
  };

  // 盘子的视觉宽度 / Disc width visual
  const discWidth = (d)=> 40 + d * 20; // d: 1..DISC_COUNT

  return (
    <div className="game-container">
      <h2 className="game-title">Tower of Hanoi (Lite)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>{selected===null? '选择来源柱 / Pick source peg' : '选择目标柱 / Pick target peg'}</strong></div>
      </div>
      <div className="game-board" style={{ display:'flex', gap:'30px', alignItems:'flex-end' }}>
        {pegs.map((peg, i)=> (
          <div key={i} onClick={()=>clickPeg(i)} style={{ width:180, height:300, border:'1px dashed #ccc', borderRadius:6, display:'flex', flexDirection:'column', justifyContent:'flex-end', alignItems:'center', background:'#f9f9fb', cursor:'pointer' }}>
            {peg.map((d, idx)=> (
              <div key={idx} style={{ width:discWidth(d), height:24, background:'#007bff', borderRadius:4, margin:'4px 0' }} />
            ))}
            <div style={{ height:4, width:'100%', background:'#777', marginTop:8 }} />
            <div style={{ marginTop:8, color: selected===i? '#007bff':'#666' }}>Peg {i+1}</div>
          </div>
        ))}
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default TowerOfHanoiLite;