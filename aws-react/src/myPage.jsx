import React, { Component } from "react";
import axios from "axios";
import "./css/Form.css"; // Form 컴포넌트의 CSS 스타일을 가져옵니다.
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트를 가져옵니다.

export class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null, // 사용자 정보를 저장할 상태
      showBoardButton: false, // Board 페이지로 이동하는 버튼을 표시할 지 여부
      getItemId: "",
      deleteItemId: "",
      items: [],
      boards: [],
      errorMessage: "",
      systemMessage: "",
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGetItem = this.handleGetItem.bind(this);
    this.handleGetAllItem = this.handleGetAllItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.getBoardList = this.getBoardList.bind(this);
  }

  // 사용자 정보 가져오기
  async fetchUserInfo() {
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.get(`/items/${userId}`);
      const userInfo = response.data;

      this.setState({
        userInfo,
        showBoardButton: true, // 사용자 정보가 있을 경우 버튼 표시
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  componentDidMount() {
    this.fetchUserInfo(); // 페이지 로드 시 사용자 정보 가져오기
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }
  // 로그아웃 시 localStorage에 id 삭제
  handleLogout() {
    localStorage.removeItem("userId");
    this.setState({
      userInfo: null,
      showBoardButton: false,
    });
  }
  // 전체 유저 조회
  async handleGetAllItem(event) {
    event.preventDefault();
    try {
      const response = await axios.get(`/items`);
      this.setState({
        items: response.data,
        systemMessage: `전체 데이터 조회 성공!!!`,
      });
      console.log("handleGetItem state:", this.state, response);
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({ systemMessage: `전체 데이터 조회 실패...` });
    }
  }
  // 전체 게시물 조회
  async getBoardList(event) {
    event.preventDefault();
    try {
      const response = await axios.get(`/boards`);
      this.setState({
        boards: response.data,
        systemMessage: `전체 게시물 조회 성공!!!`,
      });
      console.log("handleGetItem state:", this.state, response);
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({ systemMessage: `전체 게시물 조회 실패...` });
    }
  }
  // 개별 데이터 조회 (id)
  async handleGetItem(event) {
    event.preventDefault();
    const { getItemId } = this.state;

    try {
      const response = await axios.get(`/items/${getItemId}`);
      this.setState({
        items: [response.data],
        systemMessage: `ID ${getItemId} 조회 성공!!!`,
      });
      console.log("handleGetItem state:", this.state, response);
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({ systemMessage: `조회 실패 (해당 ID 없음)...` });
    }
  }

  // 개별 데이터 삭제 (id)
  async handleDeleteItem(event) {
    event.preventDefault();
    const { deleteItemId } = this.state;

    try {
      await axios.delete(`/items/${deleteItemId}`);
      this.setState({
        deleteItemId: "",
        systemMessage: `ID ${deleteItemId} 삭제 성공!!!`,
      });
    } catch (error) {
      console.error("Error deleting item:", error); // 없는 id 삭제 해도 성공으로 뜸
      this.setState({ systemMessage: `삭제 실패...` });
    }
  }

  // 별 아이콘을 그리는 함수
  showStars(value) {
    const fullStars = Math.floor(value);
    const halfStar = value - fullStars >= 0.5 ? true : false;
    const emptyStars = 5 - Math.ceil(value);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, index) => (
          <span key={index} className="star selected">
            ★
          </span>
        ))}
        {halfStar && (
          <span className="star selected">
            <span className="half-star">★</span>
          </span>
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="star">
            ★
          </span>
        ))}
      </div>
    );
  }
  render() {
    const { userInfo, showBoardButton } = this.state;
    const isLoggedIn = !!userInfo; // Check if user is logged in

    return (
      <div className="form-wrapper">
        <header className="app-header">
          <h1>MyPage</h1>
        </header>

        <div className="form-container">
          {/* 사용자 정보 출력 */}
          {userInfo ? (
            <div className="user-info">
              <p>ID: {userInfo.id}</p>
              <p>Name: {userInfo.name}</p>
              {/* 로그아웃 버튼 */}
              <button onClick={this.handleLogout} className="submit-button">
                Logout
              </button>
            </div>
          ) : (
            <p>Loading user information...</p>
          )}

          {/* 로그인 버튼 또는 사용자 정보 표시 */}
          {!isLoggedIn ? (
            <Link to="/login" className="submit-button">
              Login
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Get All Items Button */}
        <button
          type="button"
          className="submit-button"
          onClick={this.handleGetAllItem}
        >
          Get All Users
        </button>

        {/* Get All Boards Button */}
        <button
          type="button"
          className="submit-button"
          onClick={this.getBoardList}
        >
          Get All Boards
        </button>

        {/* Get User by ID Form */}
        <form onSubmit={this.handleGetItem} className="form-item board-form">
          <h2>Get ID</h2>
          <input
            type="text"
            name="getItemId"
            onChange={this.handleChange}
            value={this.state.getItemId}
            className="input-field-mp"
          />
          <br />
          <button type="submit" className="submit-button">
            Get ID
          </button>
        </form>

        {/* Delete Item by ID Form */}
        <form onSubmit={this.handleDeleteItem} className="form-item board-form">
          <h2>Delete ID</h2>
          <input
            type="text"
            name="deleteItemId"
            onChange={this.handleChange}
            value={this.state.deleteItemId}
            className="input-field-mp"
          />{" "}
          <br />
          <button type="submit" className="submit-button">
            Delete ID
          </button>
        </form>

        {/* List output */}
        {Array.isArray(this.state.items) &&
          this.state.items.map(
            (item, index) =>
              item && (
                <div key={index} className="item-container">
                  <p>ID: {item.id}</p>
                  <p>Password: {item.pw}</p>
                  <p>Name: {item.name}</p>
                  <p>{item.date}</p>
                </div>
              )
          )}

        <div className="board-list">
          {Array.isArray(this.state.boards) &&
            this.state.boards.map(
              (item, index) =>
                item && (
                  <div key={index} className="board-item">
                    <div className="board-info">
                      <p className="board-title">Title: {item.boardTitle}</p>
                      <img src={item.image}></img>{" "}
                      {/* google 이미지 주소를 넣었을 때만 가능 */}
                      <p className="board-category">
                        Category: {item.boardCategory}
                      </p>
                    </div>
                    <div className="board-rating">
                      {this.showStars(item.rate)}
                      <p className="board-user">작성자: {item.userId}</p>
                      <p className="board-date">{item.date}</p>
                    </div>
                  </div>
                )
            )}
        </div>
        {/* 회원가입 페이지로 이동하는 버튼 */}
        {/* <Link to="/signup" className="submit-button">
          Go to Sign Up page
        </Link> */}
      </div>
    );
  }
}

export default MyPage;
