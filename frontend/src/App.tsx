import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Favourites from "./pages/Favourites";
import Movie from "./pages/Movie";
import "./App.scss";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="movie/:id" element={<Movie />} />
            <Route
              path="history"
              element={<div>History Page (Coming Soon)</div>}
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
