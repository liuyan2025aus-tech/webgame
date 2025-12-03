// SameGame-lite（彩色块消除，10x10）
// 说明: 点击连通块（>=2）进行消除，重力下落并左移压缩；无可消除时结束。
// Note: Click connected groups (>=2) to remove; apply gravity and left shift; end when no moves.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const R = 10, C = 10, COLORS = ['#e74c3c','#2ecc71','#3498db'];

function randomGrid(){
  return Array(R).fill(0).map(()=> Array(C).fill(0).map(()=> Math.floor(Math.random()*COLORS.length)));
}

function inBounds(r,c){ return r>=0 && r<R && c>=0 && c<C; }

function cloneGrid(g){ return g.map(row=> row.slice()); }

function bfsCluster(g, r, c){
  const color = g[r][c];
  if (color === null) return [];
  const q = [[r,c]]; const seen = new Set([`${r},${c}`]);
  const acc = [[r,c]];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  while(q.length){
    const [cr,cc] = q.shift();
    for (const [dr,dc] of dirs){
      const nr = cr+dr, nc = cc+dc; const key = `${nr},${nc}`;
      if (!inBounds(nr,nc) || seen.has(key)) continue;
      if (g[nr][nc] === color){ seen.add(key); q.push([nr,nc]); acc.push([nr,nc]); }
    }
  }
  return acc;
}

function applyGravity(g){
  const next = Array(R).fill(0).map(()=> Array(C).fill(null));
  for (let c=0;c<C;c++){
    const colVals = [];
    for (let r=0;r<R;r++) if (g[r][c] !== null) colVals.push(g[r][c]);
    for (let i=0;i<colVals.length;i++) next[R-1-i][c] = colVals[colVals.length-1-i];
  }
  return next;
}

function shiftLeft(g){
  // 将全空列移除并左移剩余列
  const cols = [];
  for (let c=0;c<C;c++){
    const isEmpty = Array(R).fill(0).every((_,r)=> g[r][c] === null);
    if (!isEmpty) cols.push(c);
  }
  const next = Array(R).fill(0).map(()=> Array(C).fill(null));
  for (let idx=0; idx<cols.length; idx++){
    const c = cols[idx];
    for (let r=0;r<R;r++) next[r][idx] = g[r][c];
  }
  return next;
}

function anyMoves(g){
  for (let r=0;r<R;r++) for (let c=0;c<C;c++){
    if (g[r][c] === null) continue;
    const cluster = bfsCluster(g,r,c);
    if (cluster.length >= 2) return true;
  }
  return false;
}

function SameGameLite(){
  const [grid, setGrid] = useState(randomGrid());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setGrid(randomGrid());
    setScore(0);
    setStatus('playing');
  };

  const clickCell = (r,c)=>{
    if (status !== 'playing') return;
    const cluster = bfsCluster(grid, r, c);
    if (cluster.length < 2) return; // 至少两个相连才消除
    const g1 = cloneGrid(grid);
    for (const [cr,cc] of cluster) g1[cr][cc] = null;
    const g2 = applyGravity(g1);
    const g3 = shiftLeft(g2);
    setGrid(g3);
    setScore(s=> s + cluster.length);
    if (!anyMoves(g3)){
      setStatus('over');
      Storage.incrementGamesWon();
      Storage.updateHighScore(22, score + cluster.length);
      alert('Correct!');
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">SameGame-lite (10x10)</h2>
      <div className="game-info">
        <div className="info-item"><span>Score:</span><strong>{score}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>点击连通块（≥2）消除 / Click connected group (≥2)</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: `repeat(${C}, 40px)` }}>
          {grid.flat().map((v, idx)=>{
            const r = Math.floor(idx / C), c = idx % C;
            return (
              <div key={idx} className="grid-cell" onClick={()=>clickCell(r,c)} style={{ width:40, height:40, background: v===null? '#eee' : COLORS[v] }} />
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

export default SameGameLite;