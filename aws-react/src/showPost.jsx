import React, { Component } from "react";
import axios from "axios";
import "./css/Form.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";


class ShowPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
          item: null,
          loading: true,
          error: null,
        };
      }
      async componentDidMount() {
        const { userId, date } = this.props.match.params;
      
        try {
          const response = await axios.get(`/boards/${userId}/${date}`);
          const item = response.data;
          this.setState({ item, loading: false });
        } catch (error) {
          console.error("Error getting item:", error);
          this.setState({ loading: false, error });
        }
      }
      
    
      render() {
        const { item, loading, error } = this.state;
    
        if (loading) {
          return <p>Loading...</p>;
        }
    
        if (error) {
          return <p>Error: {error.message}</p>;
        }
    
        if (!item) {
          return <p>Item not found.</p>;
        }
    
        return (
            <div className="board-details">
            <h2>상세 보기</h2>
            <p>제목: {item.boardTitle}</p>
            <p>내용: {item.boardContent}</p>
            <p>작성자: {item.userId}</p>
            <p>날짜: {item.date}</p>
            {/* 필요한 정보를 추가로 출력 */}
          </div>
        );
      }
    }
    

export default ShowPost;
