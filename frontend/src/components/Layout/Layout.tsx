import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="header-content">
          <button
            className="sidebar-toggle"
            onClick={() => dispatch(toggleSidebar())}
          >
            ☰
          </button>
          <Link to="/" className="logo">
            🎬 Movie Search
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="main-content">
        {sidebarOpen && (
          <aside className="sidebar">
            <nav className="sidebar-nav">
              <Link to="/">🏠 Home</Link>
              <Link to="/search">🔍 Search</Link>
              <Link to="/favorites">❤️ Favorites</Link>
              <Link to="/history">📋 History</Link>
            </nav>
          </aside>
        )}

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;