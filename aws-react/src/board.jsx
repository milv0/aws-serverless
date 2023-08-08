import React, { Component } from "react";
import axios from "axios";
import "./Form.css";
// import "./board.css";

export class Board extends Component {
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
    this.sendBoardData = this.sendBoardData.bind(this);
    this.getBoardList = this.getBoardList.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
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

  // 게시물
  async sendBoardData(event) {
    event.preventDefault();
    try {
      const { userId, image, boardTitle, boardContent, boardCategory, rate } =
        this.state;
      await axios.put("/boards", {
        userId: `${userId}`,
        image: `${image}`,
        boardTitle: `${boardTitle}`,
        boardContent: `${boardContent}`,
        boardCategory: `${boardCategory}`,
        rate: `${rate}`,
      });
      this.setState({ systemMessage: `게시물 업로드 성공!!!` });
    } catch (error) {
      console.error("Error get item:", error);
      this.setState({ systemMessage: `게시물 업로드 실패...` });
    }
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

  async handleCategoryChange(event) {
    const selectedCategory = event.target.value;
    const isChecked = event.target.checked;

    this.setState((prevState) => {
      let updatedCategories;
      if (isChecked) {
        updatedCategories = [...prevState.boardCategory, selectedCategory];
      } else {
        updatedCategories = prevState.boardCategory.filter(
          (category) => category !== selectedCategory
        );
      }

      return {
        boardCategory: updatedCategories,
      };
    });
  }

  render() {
    const { isLoggedIn, isError, loginMessage, errorMessage, systemMessage } =
      this.state;

    return (
      <div className="form-wrapper">
        {/* Display System Message */}
        <h1 className="system-message">{systemMessage}</h1>
        <h1 className="main-heading">Boarddfd Page</h1>

        <div className="form-container">
          <form onSubmit={this.sendBoardData} className="form-item board-form">
            <h2>게시물 작성</h2>
            <div className="input-field">
              <input
                type="text"
                name="userId"
                onChange={this.handleChange}
                value={this.state.userId}
                placeholder="사용자 ID"
                className="input-field"
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                name="image"
                onChange={this.handleChange}
                value={this.state.image}
                placeholder="이미지 URL"
                className="input-field"
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                name="boardTitle"
                onChange={this.handleChange}
                value={this.state.boardTitle}
                placeholder="게시물 제목"
                className="input-field"
              />
            </div>
            <div className="input-field">
              <textarea
                onChange={this.handleChange}
                value={this.state.boardContent}
                name="boardContent"
                placeholder="게시물 내용"
                className="input-field textarea-field"
              />
            </div>
            <div className="input-field">
              {/* <input
                type="text"
                name="boardCategory"
                onChange={this.handleChange}
                value={this.state.boardCategory}
                placeholder="게시물 카테고리"
                className="input-field"
              /> */}
              <label>
                <input
                  type="checkbox"
                  name="boardCategory"
                  value="category1"
                  checked={this.state.boardCategory.includes("category1")}
                  onChange={this.handleCategoryChange}
                />
                Category 1
              </label>
              <label>
                <input
                  type="checkbox"
                  name="boardCategory"
                  value="category2"
                  checked={this.state.boardCategory.includes("category2")}
                  onChange={this.handleCategoryChange}
                />
                Category 2
              </label>
              <label>
                <input
                  type="checkbox"
                  name="boardCategory"
                  value="category3"
                  checked={this.state.boardCategory.includes("category3")}
                  onChange={this.handleCategoryChange}
                />
                Category 3
              </label>
              <label>
                <input
                  type="checkbox"
                  name="boardCategory"
                  value="category4"
                  checked={this.state.boardCategory.includes("category4")}
                  onChange={this.handleCategoryChange}
                />
                Category 4
              </label>
            </div>

            <div className="input-field">
              <input
                type="number"
                name="rate"
                onChange={this.handleChange}
                value={this.state.rate}
                placeholder="평점"
                className="input-field"
              />
            </div>
            <button type="submit" className="submit-button">
              게시물 업로드
            </button>
          </form>
        </div>

        {/* Get All Items Button */}
        <button
          type="button"
          className="submit-button"
          onClick={this.getBoardList}
        >
          Get All boards List
        </button>
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
                  {/* <p>BoardContent: {item.boardContent}</p> */}
                  <p>BoardCategory: {item.boardCategory}</p>
                  <p>Rate: {item.rate}</p>
                </div>
              )
          )}
      </div>
    );
  }
}
export default Board; // Form 컴포넌트를 일반적인 내보내기로 설정
