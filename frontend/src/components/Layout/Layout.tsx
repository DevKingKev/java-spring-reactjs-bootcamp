import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { toggleTheme, toggleSidebar } from "../../store/slices/uiSlice";

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <div className="header-content">
          <button
            className="sidebar-toggle"
            onClick={() => dispatch(toggleSidebar())}>
            ☰
          </button>
          <Link to="/" className="logo">
            🎬 Movie Search
          </Link>
          <nav className="nav">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/favourites">Favourites</NavLink>
            <NavLink to="/history">History</NavLink>
          </nav>
          <button
            className="theme-toggle"
            onClick={() => dispatch(toggleTheme())}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <div className="main-content">
        {sidebarOpen && (
          <aside className="sidebar">
            <nav className="sidebar-nav">
              <NavLink to="/">🏠 Home</NavLink>
              <NavLink to="/search">🔍 Search</NavLink>
              <NavLink to="/favourites">❤️ Favorites</NavLink>
              <NavLink to="/history">📋 History</NavLink>
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
