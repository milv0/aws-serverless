import React, { Component } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

class PostDetail extends Component {
  render() {
    const { selectedItem } = this.props.location.state;

    return (
      <div className="container">
        <header className="mt-4">
          <h1>게시물 상세 정보</h1>
        </header>
        <main className="mt-4">
          {selectedItem && (
            <div className="selected-content p-4 border">
              <h2 className="mb-4">선택한 게시물</h2>
              <p>날짜: {selectedItem.date}</p>
              <p>PostID: {selectedItem.postId}</p>
              <p>제목: {selectedItem.boardTitle}</p>
              <p>작성자: {selectedItem.userId}</p>
              <p>내용: {selectedItem.boardContent}</p>
            </div>
          )}

          <Link to="/boardList" className="btn btn-primary mt-4">
            목록으로 돌아가기
          </Link>
        </main>
      </div>
    );
  }
}

export default PostDetail;
