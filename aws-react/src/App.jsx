import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Form from "./Form";
import Login from "./login";
import SignUp from "./signup";
import Board from "./board";
import BoardList from "./boardList"; // Import the BoardList component
import MyPage from "./myPage";
import "./css/App.css";
import "./css/Form.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {/* <li>
              <Link to="/login">Login</Link>
            </li> */}
            {/* <li>
              <Link to="/signup">SignUp</Link>
            </li> */}
            {/* <li>
              <Link to="/board">Board</Link>
            </li> */}
            <li>
              <Link to="/boardList">List</Link>
            </li>
            <li>
              <Link to="/myPage">MyPage</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/board" element={<Board />} />
          <Route path="/boardList" element={<BoardList />} />
          <Route path="/myPage" element={<MyPage />} />

          {/* <Route path="/" element={<Form />} /> Form as the main page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
