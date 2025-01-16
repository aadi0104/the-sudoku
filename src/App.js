import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import GetSolution from "./Components/GetSolution";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
function App() {
  return (
    <div className="app">
      <div className="title">
        <h2 className="container">
          <Link to="/the-sudoku">
            Sudoku <FontAwesomeIcon icon={faPuzzlePiece} color="#4CAF60" />
          </Link>
        </h2>
      </div>
      <Routes>
        <Route path="/the-sudoku" Component={Home} />
        <Route path="/the-sudoku/getsolution" Component={GetSolution} />
      </Routes>
    </div>
  );
}

export default App;
