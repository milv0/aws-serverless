import React, { Component } from "react";
import axios from "axios";
// import "./css/Form.css";
import "./css/boardList.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import PostDetail from "./PostDetail";
// import { Route } from "react-router-dom";

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
    // this.props.history.push(`/postDetail/${postId}`);
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
      <div className="container">
        <header className="mt-4">
          <h1>Board List</h1>
        </header>
        <main className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <button className="btn btn-primary" onClick={this.getBoardList}>
              Get All Boards List
            </button>
            {isLoggedIn && (
              <Link to="/post" className="btn btn-success">
                게시물 작성
              </Link>
            )}
          </div>

          <div className="mb-4">
            {userInfo ? (
              <div className="card">
                <div className="card-header">사용자 정보</div>
                <div className="card-body">
                  <p className="card-text">ID: {userInfo.id}</p>
                  <p className="card-text">Name: {userInfo.name}</p>
                </div>
              </div>
            ) : (
              <p>Loading user information...</p>
            )}
          </div>

          {/* 게시물 가져오기 */}
          <div className="selected-item">
            {this.state.selectedItem && (
              <div className="selected-content p-4 border">
                <h2 className="mb-4">선택한 게시물</h2>
                <p>날짜: {this.state.selectedItem.date}</p>
                <p>PostID: {this.state.selectedItem.postId}</p>
                <p>작성자: {this.state.selectedItem.userId}</p>
                <p>제목: {this.state.selectedItem.boardTitle}</p>
                <p>내용: {this.state.selectedItem.boardContent}</p>
                {this.showStars(this.state.selectedItem.rate)}
              </div>
            )}
          </div>


          <div className="row">
            {Array.isArray(this.state.items) &&
              this.state.items.map((item, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">{item.boardTitle}</h3>
                      <p className="card-text">{item.boardCategory}</p>
                      <p className="card-text">{item.postId}</p>
                      <p className="card-text">{item.date}</p>
                      {this.showStars(item.rate)}
                      <button
                        className="btn btn-primary get-post-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.handleGetPostItem(item.postId);
                        }}
                      >
                        게시물 가져오기
                      </button>

                      {loggedInUserId === item.userId && (
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleDeleteItem(item.userId, item.date);
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    );
  }
}

export default BoardList;
