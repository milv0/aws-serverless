import React, { Component } from "react";
import axios from "axios";
import "./Form.css"; // Form 컴포넌트의 CSS 스타일을 가져옵니다.
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트를 가져옵니다.

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chkId: "",
      chkPw: "",
      isLoggedIn: false, // 로그인 상태 여부
      isError: false,
      loginMessage: "",
      errorMessage: "",
      systemMessage: "",
      showBoardButton: false, // Board 페이지로 이동하는 버튼을 표시할 지 여부
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleGetAllItem = this.handleGetAllItem.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
  }

  async handleGetAllItem(event) {
    event.preventDefault();
    try {
      const response = await axios.get(`/items`);
      this.setState({
        items: response.data,
        systemMessage: `전체 데이터 조회 성공!!!`,
      });
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({ systemMessage: `전체 데이터 조회 실패...` });
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    const { chkId, chkPw } = this.state;
    try {
      const response = await axios.get(`/items/${chkId}`);
      const item = response.data;

      if (item && item.pw === chkPw) {
        this.setState({
          isError: false,
          isLoggedIn: true, // 로그인 상태로 변경
          loginMessage: `ID ${chkId} 로그인 성공!!!`,
          showBoardButton: true, // 로그인 성공 시 버튼 표시
        });
        localStorage.setItem("userId", item.id); // 로그인 성공 시 localStorage에 id 값 저장
      } else {
        this.setState({
          isLoggedIn: false,
          isError: true,
          errorMessage: "로그인 실패 (ID 또는 비밀번호가 일치하지 않습니다)...",
          showBoardButton: false, // 로그인 실패 시 버튼 가리기
        });
      }
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({
        isLoggedIn: false,
        isError: true,
        errorMessage: "로그인 실패 (해당 ID 없음)...",
        showBoardButton: false, // 로그인 실패 시 버튼 가리기
      });
    }
  }

  // 창 이동해도 로그인 유지
  componentDidMount() {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      this.setState({
        isLoggedIn: true,
        showBoardButton: true,
      });
    }
  }

  // 로그아웃 시 localStorage에 id 삭제
  handleLogout() {
    localStorage.removeItem("userId");
    this.setState({
      isLoggedIn: false,
      showBoardButton: false,
      loginMessage: "",
    });
  }

  render() {
    const {
      isLoggedIn,
      isError,
      loginMessage,
      errorMessage,
      systemMessage,
      showBoardButton,
    } = this.state;

    return (
      <div className="form-wrapper">
        <h1 className="system-message">{systemMessage}</h1>
        <h1>Login Page</h1>

        <div className="form-container">
          {/* 로그인 상태일 때 */}
          {isLoggedIn ? (
            <div>
              <h1 className="login-message">{loginMessage}</h1>
              {/* 로그아웃 버튼 */}
              <button onClick={this.handleLogout} className="submit-button">
                Logout
              </button>
            </div>
          ) : (
            /* 로그인 상태가 아닐 때 */
            <form onSubmit={this.handleLogin} className="form-item">
              <label className="form-label"> ** Login ** </label>
              <div className="input-field">
                <input
                  type="text"
                  name="chkId"
                  onChange={this.handleChange}
                  value={this.state.chkId}
                  placeholder="id"
                  className="input-field"
                />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  name="chkPw"
                  onChange={this.handleChange}
                  value={this.state.chkPw}
                  placeholder="pw"
                  className="input-field"
                />
              </div>
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
          )}
        </div>

        {isError && <h1 className="error-message">{errorMessage}</h1>}

        {/* 회원가입 페이지로 이동하는 버튼 */}
        <Link to="/signup" className="submit-button">
          Go to Sign Up page
        </Link>

        {/* Board 페이지로 이동하는 버튼 */}
        {showBoardButton && (
          <Link to="/board" className="submit-button">
            Board 페이지로 이동
          </Link>
        )}

        {/* 전체 아이템 목록 출력 */}
        {Array.isArray(this.state.items) &&
          this.state.items.map(
            (item, index) =>
              item && (
                <div key={index} className="item-container">
                  <p>Created Date: {item.date}</p>
                  <p>ID: {item.id}</p>
                  <p>Password: {item.pw}</p>
                  <p>Name: {item.name}</p>
                </div>
              )
          )}
      </div>
    );
  }
}

export default Login;
