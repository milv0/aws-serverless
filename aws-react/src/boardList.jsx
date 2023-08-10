import React, { Component } from "react";
import axios from "axios";
// import "./css/Form.css";
import "./css/boardList.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

export class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      pw: "",
      items: [], // holds the items fetched from the API
      getItemId: "", // 데이터 조회
      deleteItemId: "", // 데이터 삭제
      chkId: "",
      chkPw: "",
      isLoggedIn: false,
      isError: false,
      loginMessage: "",
      errorMessage: "",
      systemMessage: "",
      file: null,
      type: null,

      userId: "",
      image: "", //sendImgS3()를 통해 받아온 이미지 데이터
      boardTitle: "",
      boardContent: "",
      boardCategory: "",
      rate: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    // ㄱㅔ시물
    this.getBoardList = this.getBoardList.bind(this);
    this.handleRateClick = this.handleRateClick.bind(this);
  }

  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }
  handleFileChange(event) {
    this.setState({
      file: event.target.files[0],
    });
  }

  async getBoardList(event) {
    event.preventDefault();
    try {
      const response = await axios.get(`/boards`);
      this.setState({
        items: response.data,
        systemMessage: `전체 게시물 조회 성공!!!`,
      });
      console.log("handleGetItem state:", this.state, response);
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({ systemMessage: `전체 게시물 조회 실패...` });
    }
  }

  // 게시물 별점 저장하기
  async handleRateClick(rate) {
    this.setState({ rate });
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

  componentDidMount() {
    this.fetchUserInfo(); // 페이지 로드 시 사용자 정보 가져오기
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
  
  render() {
    const { userInfo } = this.state;
    const isLoggedIn = !!userInfo; // Check if user is logged in

    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Board List</h1>
        </header>
        <main className="app-main">
          <div className="board-controls">
            <button className="get-list-button" onClick={this.getBoardList}>
              Get All Boards List
            </button>
            {/* 로그인 되있을 때만 게시물 작성 버튼 활성화 */}
            {isLoggedIn && (
              <Link to="/board" className="submit-button">
                게시물 작성
              </Link>
            )}
          </div>
          <div className="board-list">
            {Array.isArray(this.state.items) &&
              this.state.items.map(
                (item, index) =>
                  item && (
                    <div key={index} className="board-item">
                      <div className="board-info">
                        <p className="board-title">Title: {item.boardTitle}</p>
                        <p className="board-image">Image: {item.image}</p>
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
        </main>
      </div>
    );
  }
}
export default BoardList;
