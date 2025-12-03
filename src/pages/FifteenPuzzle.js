// Fifteen Puzzle（15滑块拼图，4x4）
// 说明: 生成可解的随机局面；点击与空格相邻的方块移动；复原即胜。
// Note: Generates solvable 4x4; click tiles adjacent to blank to move; solved => win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const GOAL4 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];

function arrayEquals(a,b){
  return a.length === b.length && a.every((v,i)=> v===b[i]);
}

function inversions(nums){
  let count = 0;
  for (let i = 0; i < nums.length; i++){
    for (let j = i+1; j < nums.length; j++){
      if (nums[i] > nums[j]) count++;
    }
  }
  return count;
}

// 4x4 可解性判断 / 4x4 solvability
function isSolvable4(arr){
  const inv = inversions(arr.filter(n=> n!==0));
  const zeroIdx = arr.indexOf(0);
  const rowFromBottom = 4 - Math.floor(zeroIdx / 4); // 1-based
  // 偶数宽度规则：
  // rowFromBottom 为偶数时，逆序数需为奇数；为奇数时，逆序数需为偶数
  if (rowFromBottom % 2 === 0){
    return inv % 2 === 1;
  } else {
    return inv % 2 === 0;
  }
}

// 生成可解且非终局的随机棋盘 / Shuffle until solvable and not goal
function shuffleSolvable4(){
  const arr = [...GOAL4];
  do {
    for (let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable4(arr) || arrayEquals(arr, GOAL4));
  return arr;
}

function FifteenPuzzle(){
  const [board, setBoard] = useState(GOAL4);
  const [moves, setMoves] = useState(0);

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{
    setBoard(shuffleSolvable4());
    setMoves(0);
  };

  const isAdjacent = (i,j)=>{
    const rowI = Math.floor(i/4), colI = i % 4;
    const rowJ = Math.floor(j/4), colJ = j % 4;
    return (Math.abs(rowI-rowJ) + Math.abs(colI-colJ)) === 1;
  };

  const moveTile = (index)=>{
    const zeroIdx = board.indexOf(0);
    if (!isAdjacent(index, zeroIdx)) return;
    const next = [...board];
    [next[index], next[zeroIdx]] = [next[zeroIdx], next[index]];
    setBoard(next);
    setMoves(m=> m+1);
    if (arrayEquals(next, GOAL4)){
      Storage.incrementGamesWon();
      Storage.updateHighScore(15, Math.max(0, 100 - (moves + 1)));
      alert('Correct!');
      reset();
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Fifteen Puzzle (4x4)</h2>
      <div className="game-info">
        <div className="info-item"><span>Moves:</span><strong>{moves}</strong></div>
      </div>
      <div className="game-board">
        <div className="grid-board" style={{ gridTemplateColumns: 'repeat(4, 80px)' }}>
          {board.map((n, idx)=> (
            <div key={idx} className="grid-cell" onClick={()=>moveTile(idx)} style={{ width:80, height:80, background: n===0? '#eee':'white', cursor: n===0? 'default':'pointer', fontWeight:'bold' }}>
              {n!==0? n : ''}
            </div>
          ))}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={reset}>(reset)</button>
      </div>
    </div>
  );
}

export default FifteenPuzzle;