import React, { Component } from 'react';
import axios from 'axios';
import "./Form.css";

export class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
          id: '',
          name: '',
          pw: '',
          items: [],  // holds the items fetched from the API
          getItemId: '',  // 데이터 조회
          deleteItemId: '', // 데이터 삭제
          chkId: '',
          chkPw: '',
          isLoggedIn: false,
          isError: false,
          loginMessage: '',
          errorMessage: '',
          systemMessage:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleGetItem = this.handleGetItem.bind(this);
        this.handleGetAllItem = this.handleGetAllItem.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
      }
    
      handleChange(event) {
        const inputValue = event.target.value;
        const stateField = event.target.name;
        this.setState({
          [stateField]: inputValue,
        });
        console.log(this.state);
      }
    
      // 데이터 저장 (dynamoDB)
      async handleSubmit(event) {
        event.preventDefault();
        try {
          const { id, pw, name } = this.state;
          await axios.put("/items",
            { id: `${id}`, pw: `${pw}`, name: `${name}` });
          this.setState({systemMessage:  `Sign Up 성공!!!`});
    
    
        } catch (error) {
          console.error('Error get item:', error);
          this.setState({systemMessage:  `Sign Up 실패...`});
    
        }
      }
    
      // 전체 데이터 조회
      async handleGetAllItem(event){
        event.preventDefault();
        try {
          const response = await axios.get(`/items`);
          this.setState({ 
            items: response.data,
            systemMessage:  `전체 데이터 조회 성공!!!`
          });
          console.log('handleGetItem state:', this.state, response);
        } catch (error) {
          console.error('Error get item:', error);
          this.setState({systemMessage:  `전체 데이터 조회 실패...`});
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
            systemMessage:  `ID ${getItemId} 조회 성공!!!`
        });
          console.log('handleGetItem state:', this.state, response);
        } catch (error) {
          console.error('Error get item:', error);
          this.setState({systemMessage:  `조회 실패 (해당 ID 없음)...`});
        }
      }
    
      // 개별 데이터 삭제 (id)
      async handleDeleteItem(event) {
        event.preventDefault();
        const { deleteItemId } = this.state;
    
        try {
          await axios.delete(`/items/${deleteItemId}`);
          this.setState({ 
            deleteItemId: '',
            systemMessage:  `ID ${deleteItemId} 삭제 성공!!!`
          });
        } catch (error) {
          console.error('Error deleting item:', error);
          // alert('삭제 실패...');  // 없는 id 삭제 해도 성공으로 뜸
          this.setState({systemMessage:  `삭제 실패...`});
    
        }
      }
    
      // 로그인
      async handleLogin(event) {
        event.preventDefault();
        const { chkId, chkPw } = this.state;
        try {
          const response = await axios.get(`/items/${chkId}`);
          const item = response.data;
    
          if (item && item.pw === chkPw) {
            this.setState({
              isLoggedIn: true,
              isError: false,
              loginMessage: `ID ${chkId} 로그인 성공!!!`,
            });
            // alert(`ID ${id} 로그인 성공!!!`)
    
          } else {
            this.setState({
              isLoggedIn: false,
              isError: true,
              errorMessage: '로그인 실패 (ID 또는 비밀번호가 일치하지 않습니다)...',
            });
            // alert(`로그인 실패 (ID 또는 비밀번호가 일치하지 않습니다)...`)
          }
        } catch (error) {
          console.error('Error get item:', error);
          this.setState({
            isLoggedIn: false,
            isError: true,
            errorMessage: '로그인 실패 (해당 ID 없음)...',
          });
          // alert(`로그인 실패 (해당 ID 없음)...`)
        }
      }
    
  render() {
    const { isLoggedIn, isError, loginMessage, errorMessage, systemMessage } = this.state;

    return (
      (
        
      <div className="form-wrapper">
        {/* Display System Message */}
        <h1 className="system-message">{systemMessage}</h1>
        <h1 className="main-heading">Form.js</h1>

        {/* Sign Up */}
        <div className="form-container">
          <form onSubmit={this.handleSubmit} className="form-item">
            <label> ** Sign Up ** </label>
            <div className="input-field">
              <input
                type="text"
                name="id"
                onChange={this.handleChange}
                value={this.state.id}
                placeholder="id"
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                name="pw"
                onChange={this.handleChange}
                value={this.state.pw}
                placeholder="pw"
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                name="name"
                onChange={this.handleChange}
                value={this.state.name}
                placeholder="name"
              />
            </div>
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        </div>

        {/* Login */}
        <div className="form-container">
          <form onSubmit={this.handleLogin} className="form-item">
            <label> ** Login ** </label>
            <div className="input-field">
              <input
                type="text"
                name="chkId"
                onChange={this.handleChange}
                value={this.state.chkId}
                placeholder="id"
              />
            </div>
            <div className="input-field">
              <input
                type="text"
                name="chkPw"
                onChange={this.handleChange}
                value={this.state.chkPw}
                placeholder="pw"
              />
            </div>
            <button type="submit" className="signup-button">Login</button>
          </form>
        </div>

        {/* Display Login Result */}
        {isLoggedIn && <h1 className="login-message">{loginMessage}</h1>}
        {isError && <h1 className="error-message">{errorMessage}</h1>}

        {/* Get All Items Button */}
        <button
          type="button"
          className="custom-button get-items-button"
          onClick={this.handleGetAllItem}
        >
          Get All Items
        </button>

        {/* Get Item by ID Form */}
        <form onSubmit={this.handleGetItem}>
          <label>** Get item by ID ** </label>
          <input
            type="text"
            name="getItemId"
            onChange={this.handleChange}
            value={this.state.getItemId}
          />
          <button type="submit" className="get-item-button">Get Item</button>
        </form>

        {/* Delete Item by ID Form */}
        <form onSubmit={this.handleDeleteItem}>
          <label>** Delete item by ID ** </label>
          <input
            type="text"
            name="deleteItemId"
            onChange={this.handleChange}
            value={this.state.deleteItemId}
          />
          <button type="submit" className="delete-item-button">Delete Item</button>
        </form>

        {/* List output */}
        {Array.isArray(this.state.items) &&
          this.state.items.map((item, index) => (
            item && (
              <div key={index} className="item-container">
                <p>Created Date: {item.date}</p>
                <p>ID: {item.id}</p>
                <p>Password: {item.pw}</p>
                <p>Name: {item.name}</p>
              </div>
            )
          ))}
      </div>
      )
    );
  }
}
export default Form; // Form 컴포넌트를 일반적인 내보내기로 설정
