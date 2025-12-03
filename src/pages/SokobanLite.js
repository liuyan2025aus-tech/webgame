// Sokoban-lite（简化推箱子，5x5）
// 说明: 方向键移动玩家；推箱子到目标点；全部箱子在目标上判胜。
// Note: Arrow keys move; push boxes onto targets; win when all boxes on targets.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const N = 5;

const levelTargets = new Set(['1,3','2,3']); // 目标点坐标（r,c）
const levelWalls = new Set(['0,0','0,1','0,2','0,3','0,4','4,0','4,1','4,2','4,3','4,4','1,0','2,0','3,0','1,4','2,4','3,4']);
const startPlayer = [2,2];
const startBoxes = [[1,2],[2,2]]; // 两个箱子起始位置（第二个与玩家同起点，立即可推动）

function inBounds(r,c){ return r>=0 && r<N && c>=0 && c<N; }

function coordKey(r,c){ return `${r},${c}`; }

function SokobanLite(){
  const [player, setPlayer] = useState(startPlayer);
  const [boxes, setBoxes] = useState(startBoxes);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setPlayer(startPlayer);
    setBoxes(startBoxes);
    setMoves(0);
    setStatus('playing');
  };

  const isBoxAt = (r,c)=> boxes.some(b=> b[0]===r && b[1]===c);

  const move = (dr,dc)=>{
    if (status !== 'playing') return;
    const [pr, pc] = player;
    const nr = pr + dr, nc = pc + dc;
    if (!inBounds(nr,nc)) return;
    if (levelWalls.has(coordKey(nr,nc))) return;
    const hasBox = isBoxAt(nr,nc);
    if (!hasBox){
      setPlayer([nr,nc]);
      setMoves(m=> m+1);
      return;
    }
    // 推箱子：检查前方一格
    const br2 = nr + dr, bc2 = nc + dc;
    if (!inBounds(br2,bc2)) return;
    if (levelWalls.has(coordKey(br2,bc2))) return;
    if (isBoxAt(br2,bc2)) return; // 不能推到另一个箱子上
    const nextBoxes = boxes.map(b=> (b[0]===nr && b[1]===nc) ? [br2,bc2] : b);
    setBoxes(nextBoxes);
    setPlayer([nr,nc]);
    setMoves(m=> m+1);
    // 胜利判定：所有箱子在目标点上
    const allOnTarget = nextBoxes.every(([r,c])=> levelTargets.has(coordKey(r,c)));
    if (allOnTarget){
      setStatus('over');
      Storage.incrementGamesWon();
      Storage.updateHighScore(19, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
    }
  };

  useEffect(()=>{
    const handler = (e)=>{
      if (e.key==='ArrowUp') move(-1,0);
      else if (e.key==='ArrowDown') move(1,0);
      else if (e.key==='ArrowLeft') move(0,-1);
      else if (e.key==='ArrowRight') move(0,1);
    };
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  }, [player, boxes, status, moves]);

  const cellStyle = (r,c)=>{
    const key = coordKey(r,c);
    const isWall = levelWalls.has(key);
    const isTarget = levelTargets.has(key);
    const isPlayer = (player[0]===r && player[1]===c);
    const box = boxes.find(b=> b[0]===r && b[1]===c);
    const bg = isWall ? '#444' : box ? (isTarget ? '#28a745' : '#b5651d') : (isTarget ? '#ffe08a' : '#eee');
    return { width:60, height:60, background:bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'bold' };
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Sokoban-lite (5x5)</h2>
      <div className="game-info">
        <div className="info-item"><span>Status:</span><strong className={`status-${status}`}>{status}</strong></div>
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
        <div className="info-item"><span>Tip:</span><strong>方向键推箱到黄点 / Push boxes to yellow</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(5, 60px)' }}>
          {Array(N*N).fill(0).map((_,idx)=>{
            const r = Math.floor(idx / N), c = idx % N;
            const isPlayer = player[0]===r && player[1]===c;
            return (
              <div key={idx} className="grid-cell" style={cellStyle(r,c)}>
                {isPlayer ? 'P' : ''}
              </div>
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

export default SokobanLite;