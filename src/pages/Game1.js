// src/pages/Game1.js (示例游戏模板)
// Blanko（填空游戏）
// 说明: 随机选一句话，挑选3个非空格字符为空格，用户填入正确字符即胜。
// Note: Random sentence, hide 3 non-space chars; fill correctly to win.
import React, { useState, useEffect, useMemo } from 'react';
import Storage from '../components/Storage';
import './Game.css';

// 考试给定数据
const strs = [
  'the fat cats',
  'larger frogs',
  'banana cakes',
  'unsw vs usyd',
  'french toast',
  'hawaii pizza',
  'barack obama',
];

function Game1() {
  const [currentStr, setCurrentStr] = useState('');
  const [inputIndices, setInputIndices] = useState([]); // 需要输入的位置索引
  const [inputs, setInputs] = useState({}); // 索引 -> 用户输入字符

  // 随机选择字符串 & 随机3个非空格字符索引 / Pick sentence & choose 3 indices
  const setupNewGame = () => {
    const s = strs[Math.floor(Math.random() * strs.length)];
    // 选取非空格的索引
    const charIndices = [...s].map((ch, idx) => (ch !== ' ' ? idx : null)).filter(i => i !== null);
    const chosen = new Set();
    while (chosen.size < 3 && chosen.size < charIndices.length) {
      const pick = charIndices[Math.floor(Math.random() * charIndices.length)];
      chosen.add(pick);
    }
    setCurrentStr(s);
    setInputIndices(Array.from(chosen).sort((a, b) => a - b));
    setInputs({});
  };

  // 首次加载初始化 / Init once on mount
  useEffect(() => {
    setupNewGame();
  }, []);

  // 监听输入是否完成且正确
  // 检查输入是否全部填完且与答案匹配 / Validate inputs and match original chars
  useEffect(() => {
    if (inputIndices.length === 3) {
      const allFilled = inputIndices.every(idx => (inputs[idx] || '').length === 1);
      if (!allFilled) return;

      const correct = inputIndices.every(idx => inputs[idx] === currentStr[idx]);
      if (correct) {
        Storage.incrementGamesWon();
        alert('Correct!');
        setupNewGame();
      }
    }
  }, [inputs, inputIndices, currentStr]);

  // 计算渲染用的字符数组 / Memoized array for rendering 12-box row
  const boxes = useMemo(() => [...currentStr], [currentStr]);

  // 单字符输入限制 / Limit input to single character
  const handleInputChange = (idx, value) => {
    const v = (value || '').slice(0, 1);
    setInputs(prev => ({ ...prev, [idx]: v }));
  };

  return (
    <div className="game-container">
      <h2 className="game-title">Blanko</h2>
      <div className="game-board">
        <div className="blanko-row">
          {boxes.map((ch, idx) => {
            const isInput = inputIndices.includes(idx);
            return (
              <div key={idx} className="blanko-cell">
                {isInput ? (
                  <input
                    className="blanko-input"
                    type="text"
                    maxLength={1}
                    value={inputs[idx] || ''}
                    onChange={e => handleInputChange(idx, e.target.value)}
                  />
                ) : (
                  <span className="blanko-char">{ch}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="game-controls">
        <button className="btn-secondary" onClick={setupNewGame}>(reset)</button>
      </div>
    </div>
  );
}

export default Game1;