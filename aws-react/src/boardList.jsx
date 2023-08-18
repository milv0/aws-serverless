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
      getBoardId: "",
      deleteBoardId: "",
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
      postId: "",
      image: "", //sendImgS3()를 통해 받아온 이미지 데이터
      boardTitle: "",
      boardContent: "",
      boardCategory: "",
      rate: 0,
      expandedItemId: null, // 확장된 항목의 ID를 추적하는 상태 속성
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    // ㄱㅔ시물
    this.getBoardList = this.getBoardList.bind(this);
    this.handleRateClick = this.handleRateClick.bind(this);
    // this.handleGetPost = this.handleGetPost.bind(this);
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

  async getBoardList() {
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

  // 게시물 가져오기
  handleGetPostItem = (postId) => {
    const selectedItem = this.state.items.find(
      (item) => item.postId === postId
    );

    if (selectedItem) {
      this.setState({
        selectedItem,
        systemMessage: "게시물을 성공적으로 가져왔습니다.",
      });
    } else {
      this.setState({ systemMessage: "해당 게시물을 찾을 수 없습니다." });
    }
  };

  // 게시물 삭제
  handleDeleteItem = async (userId, date) => {
    try {
      const loggedInUserId = localStorage.getItem("userId");
      if (userId !== loggedInUserId) {
        // 로그인된 아이디와 삭제 대상 아이디가 다른 경우
        this.setState({
          systemMessage: "해당 게시물을 삭제할 권한이 없습니다.",
        });
        return;
      }

      await axios.delete(`/boards/${userId}/${date}`);
      this.setState((prevState) => ({
        items: prevState.items.filter(
          (item) => item.userId !== userId && item.date !== date
        ),
        systemMessage: "게시물이 삭제되었습니다.",
      }));
      await this.getBoardList();
    } catch (error) {
      console.error("Error deleting item:", error);
      this.setState({ systemMessage: "게시물 삭제 실패..." });
    }
  };

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
    this.getBoardList();
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

  toggleExpandedItem(itemId) {
    this.setState((prevState) => ({
      expandedItemId: prevState.expandedItemId === itemId ? null : itemId,
    }));
  }

  render() {
    const { userInfo } = this.state;
    const isLoggedIn = !!userInfo; // Check if user is logged in
    const loggedInUserId = localStorage.getItem("userId"); // 로그인된 아이디

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
              <Link to="/post" className="submit-button">
                게시물 작성
              </Link>
            )}
          </div>

          {/* 사용자 정보 출력 */}
          <div className="form-container">
            {userInfo ? (
              <div className="user-info">
                <p>ID: {userInfo.id}</p>
                <p>Name: {userInfo.name}</p>
              </div>
            ) : (
              <p>Loading user information...</p>
            )}
          </div>

          <div className="selected-item">
            {this.state.selectedItem && (
              <div>
                <h2>선택한 게시물</h2>
                <p>날짜: {this.state.selectedItem.date}</p>

                <p>PostID: {this.state.selectedItem.postId}</p>
                <p>제목: {this.state.selectedItem.boardTitle}</p>
                <p>작성자: {this.state.selectedItem.userId}</p>
                <p>내용: {this.state.selectedItem.boardContent}</p>

                {this.showStars(this.state.selectedItem.rate)}
                <p></p>
              </div>
            )}
          </div>

          <div className="board-list">
            {Array.isArray(this.state.items) &&
              this.state.items.map((item, index) => (
                <div
                  key={index}
                  className={`board-item ${
                    this.state.expandedItemId === item.id ? "expanded" : ""
                  }`}
                  onClick={() => this.toggleExpandedItem(item.id)}
                >
                  <div className="board-info">
                    <p>PostID: {item.postId}</p>

                    <p className="board-title">제목: {item.boardTitle}</p>
                    <img src={item.image} alt="게시물" />
                    <p className="board-category">
                      카테고리: {item.boardCategory}
                    </p>
                  </div>
                  <div className="board-rating">
                    {this.showStars(item.rate)}
                    <p className="board-user">작성자: {item.userId}</p>
                    <p className="board-date">{item.date}</p>
                  </div>

                  <button
                    className="get-post-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.handleGetPostItem(item.postId);
                    }}
                  >
                    게시물 가져오기
                  </button>
                  {loggedInUserId === item.userId && ( // 로그인된 아이디와 게시물 작성자 아이디 비교
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleDeleteItem(item.userId, item.date);
                        this.setState({ expandedItemId: null });
                      }}
                    >
                      삭제
                    </button>
                  )}
                  {/* {this.state.expandedItemId === item.id && (
                    <div className="board-content">
                      {item.boardContent}
                      {loggedInUserId === item.userId && ( // 로그인된 아이디와 게시물 작성자 아이디 비교
                        <button
                          className="delete-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleDeleteItem(item.userId, item.date);
                            this.setState({ expandedItemId: null });
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  )} */}
                </div>
              ))}
          </div>
        </main>
      </div>
    );
  }
}
export default BoardList;
