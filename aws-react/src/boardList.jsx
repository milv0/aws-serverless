import React, { Component } from "react";
import axios from "axios";
import "./Form.css";
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
  render() {
    const {
      isLoggedIn,
      isError,
      loginMessage,
      errorMessage,
      systemMessage,
      rate,
    } = this.state;

    return (
      <div className="form-wrapper">
        {/* Display System Message */}
        <h1 className="system-message">{systemMessage}</h1>
        <h1 className="main-heading">Board Page</h1>

        {/* Get All Items Button */}
        <button
          type="button"
          className="submit-button"
          onClick={this.getBoardList}
        >
          Get All boards List
        </button>

        {/* 게시물 작성으로 이동하는 버튼 */}
        <Link to="/board" className="submit-button">
         게시물 작성
        </Link>

        {/* List output */}
        {Array.isArray(this.state.items) &&
          this.state.items.map(
            (item, index) =>
              item && (
                <div key={index} className="item-container">
                  <p>Created Date: {item.date}</p>
                  <p>UserID: {item.userId}</p>
                  <p>BoardTitle: {item.boardTitle}</p>
                  <p>Img: {item.image}</p>
                  <p>BoardCategory: {item.boardCategory}</p>
                  <div className="rate-container">
                    {this.showStars(item.rate)}
                  </div>
                </div>
              )
          )}
      </div>
    );
  }
}
export default BoardList;
