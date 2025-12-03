// src/pages/Dashboard.js
// Dashboard（仪表盘/首页）
// 说明: 展示胜场、重置入口、高分统计，并提供主/扩展游戏入口。
// Note: Shows games won, reset control, high scores, and links to main/extra games.
import React, { useState, useEffect } from 'react';
import Storage from '../components/Storage';
import './Dashboard.css';

function Dashboard() {
  const [gamesWon, setGamesWon] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [highScores, setHighScores] = useState({ game1: 0, game2: 0, game3: 0 });

  // 初始化
  // 初始化数据与订阅（Init data & subscribe Storage updates）
  useEffect(() => {
    const init = async () => {
      // 首次访问时从API获取初始值
      if (Storage.isFirstVisit()) {
        setLoading(true);
        try {
          const initialScore = await Storage.resetFromAPI();
          setGamesWon(initialScore);
        } catch (err) {
          setError('Failed to fetch initial data');
        } finally {
          setLoading(false);
        }
      } else {
        setGamesWon(Storage.getGamesWon());
      }
      
      // 加载高分
      setHighScores(Storage.getHighScores());
    };

    init();

    // 监听storage更新
    const handleStorageUpdate = (event) => {
      if (event.detail.key === Storage.KEYS.GAMES_WON) {
        setGamesWon(event.detail.value);
      } else if (event.detail.key === Storage.KEYS.HIGH_SCORES) {
        setHighScores(event.detail.value);
      }
    };

    window.addEventListener('storageUpdate', handleStorageUpdate);
    return () => window.removeEventListener('storageUpdate', handleStorageUpdate);
  }, []);

  // 重置处理
  // 重置：从 API 获取初始分并清空本地状态 / Reset via API and clear local state
  const handleReset = async () => {
    if (!window.confirm('Reset all game data?')) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newScore = await Storage.resetFromAPI();
      setGamesWon(newScore);
      
      // 清除所有游戏状态
      Storage.clearGameState(1);
      Storage.clearGameState(2);
      Storage.clearGameState(3);
      
      // 重置高分
      Storage.safeSet(Storage.KEYS.HIGH_SCORES, { game1: 0, game2: 0, game3: 0 });
      setHighScores({ game1: 0, game2: 0, game3: 0 });
    } catch (err) {
      setError('Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* 主要内容 - 考试要求 */}
        <h1 className="dashboard-title">
          Please choose an option from the navbar
        </h1>
        
        <div className="dashboard-score">
          <span className="score-text">
            Games won: {loading ? '...' : gamesWon}
          </span>
          <button 
            className="reset-btn"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? 'Loading...' : '(reset)'}
          </button>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {/* 精选游戏 */}
        <div className="dashboard-featured">
          <h3>Featured Games</h3>
          <div className="featured-grid">
            <a className="featured-card" href="/blanko">
              <h4>Blanko</h4>
              <p>填空小游戏，补全句子赢取胜场。</p>
            </a>
            <a className="featured-card" href="/slido">
              <h4>Slido</h4>
              <p>3x3滑块拼图，复原排列计步挑战。</p>
            </a>
            <a className="featured-card" href="/tetro">
              <h4>Tetro (2048-lite)</h4>
              <p>合并数字到 2048，刷新最高分。</p>
            </a>
          </div>
        </div>

        {/* 额外信息（可选） */}
        <div className="dashboard-stats">
          <h3>High Scores</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span>Game 1:</span>
              <strong>{highScores.game1}</strong>
            </div>
            <div className="stat-item">
              <span>Game 2:</span>
              <strong>{highScores.game2}</strong>
            </div>
            <div className="stat-item">
              <span>Game 3:</span>
              <strong>{highScores.game3}</strong>
            </div>
          </div>
        </div>

        {/* 其他游戏入口 */}
        <div className="dashboard-stats" style={{ marginTop: 20 }}>
          <h3>More Games</h3>
          <div className="stats-grid">
            <div className="stat-item"><a href="/wordle">Wordle-lite</a></div>
            <div className="stat-item"><a href="/memory">Memory Match</a></div>
            <div className="stat-item"><a href="/reaction">Reaction Test</a></div>
            <div className="stat-item"><a href="/whack">Whack-a-Mole</a></div>
            <div className="stat-item"><a href="/simon">Simon Says</a></div>
            <div className="stat-item"><a href="/minesweeper">Minesweeper-mini</a></div>
            <div className="stat-item"><a href="/tictactoe">TicTacToe</a></div>
            <div className="stat-item"><a href="/rps">Rock-Paper-Scissors</a></div>
            <div className="stat-item"><a href="/hangman">Hangman-lite</a></div>
            <div className="stat-item"><a href="/numberguess">Number Guess</a></div>
            <div className="stat-item"><a href="/hanoi">Tower of Hanoi (Lite)</a></div>
            <div className="stat-item"><a href="/fifteen">Fifteen Puzzle (4x4)</a></div>
            <div className="stat-item"><a href="/lightsout">Lights Out (5x5)</a></div>
            <div className="stat-item"><a href="/connect4">Connect Four</a></div>
            <div className="stat-item"><a href="/tetro-mini">Tetro Mini (3x3)</a></div>
            <div className="stat-item"><a href="/sokoban">Sokoban-lite</a></div>
            <div className="stat-item"><a href="/nonogram">Nonogram-mini</a></div>
            <div className="stat-item"><a href="/queens">Eight Queens</a></div>
            <div className="stat-item"><a href="/samegame">SameGame-lite</a></div>
            <div className="stat-item"><a href="/snake-lite">Snake-lite</a></div>
            <div className="stat-item"><a href="/sudoku-mini">Sudoku-mini (4x4)</a></div>
            <div className="stat-item"><a href="/mastermind">Mastermind-mini</a></div>
            <div className="stat-item"><a href="/gomoku">Gomoku-mini (13x13)</a></div>
            <div className="stat-item"><a href="/2048">2048-classic (4x4)</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;