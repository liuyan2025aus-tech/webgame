// Hangman-lite（简化版刽子手）
// 说明: 随机单词，逐字母猜测；最多 6 次错误；猜出全部字母判胜。
// Note: Guess letters for a random word; 6 wrong max; reveal all to win.
import React, { useEffect, useState } from 'react';
import Storage from '../components/Storage';
import './Game.css';

const WORDS = ['JAVASCRIPT','PYTHON','REACT','PUZZLE','BINARY','COOKIE'];

function pick(){ return WORDS[Math.floor(Math.random()*WORDS.length)]; }

function HangmanLite(){
  const [answer, setAnswer] = useState(pick());
  const [guessed, setGuessed] = useState([]); // letters
  const [wrong, setWrong] = useState(0);

  useEffect(()=>{ reset(); },[]);

  const reset = ()=>{ setAnswer(pick()); setGuessed([]); setWrong(0); };

  const onGuess = (ch)=>{
    const letter = ch.toUpperCase();
    if (!letter || guessed.includes(letter)) return;
    const inWord = answer.includes(letter);
    setGuessed(g=> [...g, letter]);
    if (!inWord){
      setWrong(w=> {
        const nw = w+1; 
        if (nw >= 6){ alert(`Game Over. Answer: ${answer}`); reset(); }
        return nw;
      });
    } else {
      const allRevealed = [...answer].every(c=> c===' ' || guessed.includes(c) || c===letter);
      if (allRevealed){ Storage.incrementGamesWon(); Storage.updateHighScore(12, Math.max(0, 6 - wrong)); alert('Correct!'); reset(); }
    }
  };

  const masked = [...answer].map(c=> (c===' ' || guessed.includes(c)) ? c : '_').join(' ');

  return (
    <div className="game-container">
      <h2 className="game-title">Hangman-lite</h2>
      <div className="game-info">
        <div className="info-item"><span>Wrong:</span><strong>{wrong}/6</strong></div>
      </div>
      <div className="game-board">
        <div className="game-play-area" style={{ textAlign:'center' }}>
          <div style={{ fontSize: 24, letterSpacing: 2, marginBottom: 16 }}>{masked}</div>
          <div className="game-controls">
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch)=> (
              <button key={ch} className="btn-primary" style={{ padding: '6px 10px' }} onClick={()=>onGuess(ch)} disabled={guessed.includes(ch)}>{ch}</button>
            ))}
            <button className="btn-secondary" onClick={reset}>(reset)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HangmanLite;