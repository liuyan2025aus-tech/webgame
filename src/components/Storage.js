// src/components/Storage.js

class StorageManager {
  constructor() {
    // 键名常量
    this.KEYS = {
      GAMES_WON: 'gamesWon',
      GAME1_STATE: 'game1State',
      GAME2_STATE: 'game2State',
      GAME3_STATE: 'game3State',
      HIGH_SCORES: 'highScores',
      LAST_PLAYED: 'lastPlayed'
    };
  }

  // ========= 核心方法 =========
  
  // 安全的localStorage操作（防止隐私模式错误）
  safeGet(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  safeSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // 触发自定义事件，通知其他组件
      window.dispatchEvent(new CustomEvent('storageUpdate', { 
        detail: { key, value } 
      }));
      return true;
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return false;
    }
  }

  // ========= 游戏胜利计数 =========
  
  getGamesWon() {
    return this.safeGet(this.KEYS.GAMES_WON, 0);
  }

  setGamesWon(count) {
    return this.safeSet(this.KEYS.GAMES_WON, count);
  }

  incrementGamesWon() {
    const current = this.getGamesWon();
    const newCount = current + 1;
    this.setGamesWon(newCount);
    return newCount;
  }

  // 从API重置（考试要求）
  async resetFromAPI() {
    try {
      // 按照考试题目提供的 URL（包含结尾的句号）
      const response = await fetch('https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json.');
      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      const score = data.score || 0;
      this.setGamesWon(score);
      return score;
    } catch (error) {
      console.error('API Error, resetting to 0:', error);
      this.setGamesWon(0);
      return 0;
    }
  }

  // ========= 游戏状态管理 =========
  
  saveGameState(gameId, state) {
    const key = `game${gameId}State`;
    return this.safeSet(key, state);
  }

  getGameState(gameId) {
    const key = `game${gameId}State`;
    return this.safeGet(key, null);
  }

  clearGameState(gameId) {
    const key = `game${gameId}State`;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  // ========= 高分管理 =========
  
  getHighScores() {
    return this.safeGet(this.KEYS.HIGH_SCORES, {
      game1: 0,
      game2: 0,
      game3: 0
    });
  }

  updateHighScore(gameId, score) {
    const scores = this.getHighScores();
    const key = `game${gameId}`;
    const current = Number(scores[key] ?? 0);
    if (Number(score) > current) {
      scores[key] = Number(score);
      this.safeSet(this.KEYS.HIGH_SCORES, scores);
      return true; // 新高分
    }
    return false;
  }

  // ========= 工具方法 =========
  
  isFirstVisit() {
    return localStorage.getItem(this.KEYS.GAMES_WON) === null;
  }

  clearAll() {
    try {
      localStorage.clear();
      window.dispatchEvent(new CustomEvent('storageCleared'));
      return true;
    } catch (error) {
      return false;
    }
  }

  // 调试方法
  debug() {
    console.log('=== LocalStorage Debug ===');
    for (let key in this.KEYS) {
      const value = this.safeGet(this.KEYS[key]);
      console.log(`${key}:`, value);
    }
  }
}

// 导出单例
const Storage = new StorageManager();
export default Storage;