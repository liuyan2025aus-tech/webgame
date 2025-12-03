// Memory Match（翻牌配对）
// 说明: 4x4 牌堆，翻两张相同则配对；全部配对胜，记录步数与最佳。
// Note: 4x4 deck, match pairs; all matched => win, track moves and best.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const icons = ['🍎','🍌','🍇','🍓','🍍','🥝','🍒','🍑'];

// 洗牌算法（Fisher–Yates）/ Shuffle deck
function shuffle(array){
  const arr = array.slice();
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function MemoryMatch(){
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(()=>{ reset(); },[]);

  // 重置牌面与状态 / Reset deck and state
  const reset = ()=>{
    const deck = shuffle([...icons, ...icons]).map((v, i)=>({ id:i, value:v }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  // 翻牌逻辑：两张时计步，匹配则加入 matched / Flip logic and match handling
  const onFlip = (idx)=>{
    if (flipped.includes(idx) || matched.includes(idx)) return;
    const nf = [...flipped, idx];
    setFlipped(nf);
    if (nf.length === 2){
      setMoves(m=>m+1);
      const [a,b] = nf;
      if (cards[a].value === cards[b].value){
        setMatched(m=>[...m,a,b]);
        setFlipped([]);
        if (matched.length + 2 === cards.length){
          Storage.incrementGamesWon();
          Storage.updateHighScore(4, moves + 1);
          alert('Correct!');
          reset();
        }
      } else {
        setTimeout(()=> setFlipped([]), 700);
      }
    }
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Memory Match</h2>
      <div className="game-info"><div className="info-item"><span>Moves:</span><strong>{moves}</strong></div></div>
      <div className="game-board">
        <div className="card-grid" style={{ maxWidth: 400 }}>
          {cards.map((card, idx)=>{
            const show = flipped.includes(idx) || matched.includes(idx);
            return (
              <div key={card.id} className="card" onClick={()=>onFlip(idx)} style={{ background: show? '#fff':'#007bff', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 28 }}>
                {show ? card.value : ''}
              </div>
            );
          })}
        </div>
      </div>
      <div className="game-controls"><button className="btn-secondary" onClick={reset}>(reset)</button></div>
    </div>
  );
}

export default MemoryMatch;