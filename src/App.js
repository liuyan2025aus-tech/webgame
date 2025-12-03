// src/App.js
// 路由入口与页面骨架
// 说明: 定义 Header/Footer 与所有页面的路由映射；用于导航与内容切换。
// Note: Router entry, defines Header/Footer and route mappings for pages.
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Game3 from './pages/Game3';
import WordleLite from './pages/WordleLite';
import MemoryMatch from './pages/MemoryMatch';
import ReactionTest from './pages/ReactionTest';
import WhackAMole from './pages/WhackAMole';
import SimonSays from './pages/SimonSays';
import MinesweeperMini from './pages/MinesweeperMini';
import TicTacToe from './pages/TicTacToe';
import RockPaperScissors from './pages/RockPaperScissors';
import HangmanLite from './pages/HangmanLite';
import NumberGuess from './pages/NumberGuess';
import TowerOfHanoiLite from './pages/TowerOfHanoiLite';
import FifteenPuzzle from './pages/FifteenPuzzle';
import LightsOut from './pages/LightsOut';
import ConnectFour from './pages/ConnectFour';
import TetroMini from './pages/TetroMini';
import SokobanLite from './pages/SokobanLite';
import NonogramMini from './pages/NonogramMini';
import EightQueens from './pages/EightQueens';
import SameGameLite from './pages/SameGameLite';
import SnakeLite from './pages/SnakeLite';
import SudokuMini from './pages/SudokuMini';
import MastermindMini from './pages/MastermindMini';
import GomokuMini from './pages/GomokuMini';
import Classic2048 from './pages/Classic2048';
import './index.css';

// Header组件 - 包含所有考试要求的样式
// 说明: 顶部固定导航，支持移动端（<=800px）缩写显示；链接保持与考试一致。
// Note: Fixed top nav; uses short labels on small screens; links match exam.
function Header() {
  const location = useLocation();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 800;
  
  // 根据实际游戏名称修改这里
  const games = [
    { path: '/', label: 'Home', shortLabel: 'H' },
    { path: '/blanko', label: 'Blanko', shortLabel: 'B' },
    { path: '/slido', label: 'Slido', shortLabel: 'S' },
    { path: '/tetro', label: 'Tetro', shortLabel: 'T' },
  ];

  return (
    <header className="header">
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23007bff'/%3E%3C/svg%3E"
        alt="Logo" 
        className="logo"
      />
      <nav className="nav">
        {games.map((game, index) => (
          <React.Fragment key={game.path}>
            {index > 0 && <span className="nav-separator">|</span>}
            <Link 
              to={game.path} 
              className={`nav-link ${location.pathname === game.path ? 'active' : ''}`}
            >
              {isMobile ? game.shortLabel : game.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>
    </header>
  );
}

// Footer组件
// 说明: 底部固定栏，满足考试视觉要求。
// Note: Footer bar per exam visual requirements.
function Footer() {
  return (
    <footer className="footer">
      <p>© 2024 Game Portal</p>
    </footer>
  );
}

// 主App组件
function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          {/** 路由映射（Router）: 将路径与页面组件绑定 / Route mappings bind paths to components */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/blanko" element={<Game1 />} />
            <Route path="/slido" element={<Game2 />} />
            <Route path="/tetro" element={<Game3 />} />
            <Route path="/wordle" element={<WordleLite />} />
            <Route path="/memory" element={<MemoryMatch />} />
            <Route path="/reaction" element={<ReactionTest />} />
            <Route path="/whack" element={<WhackAMole />} />
            <Route path="/simon" element={<SimonSays />} />
            <Route path="/minesweeper" element={<MinesweeperMini />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/rps" element={<RockPaperScissors />} />
            <Route path="/hangman" element={<HangmanLite />} />
            <Route path="/numberguess" element={<NumberGuess />} />
            <Route path="/hanoi" element={<TowerOfHanoiLite />} />
            <Route path="/fifteen" element={<FifteenPuzzle />} />
            <Route path="/lightsout" element={<LightsOut />} />
            <Route path="/connect4" element={<ConnectFour />} />
            <Route path="/tetro-mini" element={<TetroMini />} />
            <Route path="/sokoban" element={<SokobanLite />} />
            <Route path="/nonogram" element={<NonogramMini />} />
            <Route path="/queens" element={<EightQueens />} />
            <Route path="/samegame" element={<SameGameLite />} />
            <Route path="/snake-lite" element={<SnakeLite />} />
            <Route path="/sudoku-mini" element={<SudokuMini />} />
            <Route path="/mastermind" element={<MastermindMini />} />
            <Route path="/gomoku" element={<GomokuMini />} />
            <Route path="/2048" element={<Classic2048 />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;