// Nonogram-mini（5x5 逻辑绘图）
// 说明: 根据行/列线索填格；解出预设图案判胜。
// Note: Fill cells per row/column clues; solve preset pattern to win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 5;

// 预设解（true=填充）/ preset solution
const SOL = [
  [false,true,false,true,false],
  [true,true,true,false,false],
  [false,false,true,false,false],
  [false,true,true,true,false],
  [false,false,true,false,false]
];

// 行/列线索（预计算）/ clues
function lineClues(line){
  const clues = [];
  let run = 0;
  for (let i=0;i<line.length;i++){
    if (line[i]) run++; else if (run>0){ clues.push(run); run=0; }
  }
  if (run>0) clues.push(run);
  return clues.length? clues : [0];
}

const ROW_CLUES = SOL.map(row=> lineClues(row));
const COL_CLUES = Array(N).fill(0).map((_,c)=> lineClues(Array(N).fill(0).map((_,r)=> SOL[r][c])));

function NonogramMini(){
  const [board, setBoard] = useState(Array(N).fill(0).map(()=> Array(N).fill(false)));
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(Array(N).fill(0).map(()=> Array(N).fill(false)));
    setMoves(0);
    setStatus('playing');
  };

  const toggleCell = (r,c)=>{
    if (status !== 'playing') return;
    const next = board.map(row=> row.slice());
    next[r][c] = !next[r][c];
    setBoard(next);
    setMoves(m=> m+1);
    // 判胜：与预设解完全一致
    const solved = next.every((row,ri)=> row.every((v,ci)=> v === SOL[ri][ci]));
    if (solved){
      setStatus('over');
      Storage.incrementGamesWon();
      Storage.updateHighScore(20, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Nonogram Mini (5x5)</h2>
      <div className="game-info">
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>依据行/列线索填格 / Use row/col clues</strong></div>
      </div>
      <div className="game-board" style={{ display:'flex', gap:'20px' }}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${N}, 60px)`, gap:'6px' }}>
            {board.flat().map((v,idx)=>{
              const r = Math.floor(idx/N), c = idx%N;
              return (
                <div key={idx} className="grid-cell" onClick={()=>toggleCell(r,c)} style={{ width:60, height:60, background: v? '#333':'#eee' }} />
              );
            })}
          </div>
        </div>
        <div>
          <h4>Row clues</h4>
          {ROW_CLUES.map((cl,i)=> (<div key={i}>{cl.join(' ')}</div>))}
          <h4 style={{ marginTop:10 }}>Col clues</h4>
          {COL_CLUES.map((cl,i)=> (<div key={i}>{cl.join(' ')}</div>))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default NonogramMini;