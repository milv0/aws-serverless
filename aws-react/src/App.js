import React, { Component } from 'react';
import axios from 'axios';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      pw: '',
      items: [],  // holds the items fetched from the API
      getItemId: '',  // 데이터 조회
      deleteItemId: '' // 데이터 삭제
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGetItem = this.handleGetItem.bind(this);
    this.handleGetAllItem = this.handleGetAllItem.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
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
      alert('Sign Up 성공!!!');

    } catch (error) {
      console.error('Error get item:', error);
      alert('Sign Up 실패...');
    }

  }

  // 전체 데이터 조회
  async handleGetAllItem(event){
    event.preventDefault();
    try {
      const response = await axios.get(`/items`);  
      alert(`조회 성공!!!`);
      this.setState({ items: response.data });  
      console.log('handleGetItem state:', this.state,response) ;  
    } catch (error) {
      console.error('Error get item:', error);
      alert('조회 실패 (해당 ID 없음)...');
    }
  }
 
  // 개별 데이터 조회 (id)
  async handleGetItem(event) {
    event.preventDefault();
    const { getItemId } = this.state;

    try {
      const response = await axios.get(`/items/${getItemId}`);  
      alert(`ID ${getItemId} 조회 성공!!!`);
      this.setState({ items: [response.data] });  
      console.log('handleGetItem state:', this.state,response) ;  
    } catch (error) {
      console.error('Error get item:', error);
      alert('조회 실패 (해당 ID 없음)...');
    }
  }

  // 개별 데이터 삭제 (id)
  async handleDeleteItem(event) {
    event.preventDefault();
    const { deleteItemId } = this.state;
  
    try {
      await axios.delete(`/items/${deleteItemId}`); 
      alert(`ID ${deleteItemId} 삭제 성공!!!`);
      this.setState({ deleteItemId: '' }); 
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('삭제 실패...');  // 없는 id 삭제 해도 성공으로 뜸
    }
  }


  render() {
    return (
      <div>
        <div className="form-container">
          <form onSubmit={this.handleSubmit} className="form-item">
            <label className="label"> ** Sign Up ** </label>
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
                value={this.state.price}
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

        {/* 전체 데이터 조회 */}
        <button type="button" onClick={this.handleGetAllItem}>Get All Items</button>

        {/* 개별 데이터 ID로 조회 */}
        <form onSubmit={this.handleGetItem}>
          <label>** Get item by ID ** </label>
          <input
            type="text"
            name="getItemId"
            onChange={this.handleChange}
            value={this.state.getItemId}
          />
          <button type="submit">Get Item</button>
        </form>


        {/* 개별 데이터 ID로 삭제 */}
        <form onSubmit={this.handleDeleteItem}>
          <label>** Delete item by ID ** </label>
          <input
            type="text"
            name="deleteItemId"
            onChange={this.handleChange}
            value={this.state.deleteItemId}
          />
          <button type="submit">Delete Item</button>
        </form>

        {/* 리스트 출력 */}
        {Array.isArray(this.state.items) && this.state.items.map((item, index) => (
          item && <div key={index}>
             <p>Created Date: {item.date}</p>
            <p>Id: {item.id}</p>
            <p>pw: {item.pw}</p>
            <p>Name: {item.name}</p>
          </div>
        ))}     
       </div>
    );
  }
}