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
    // mg
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


  async handleSubmit(event) {
    event.preventDefault();
    const { id, pw, name } = this.state;
    await axios.put("/items",  
    { id: `${id}`, pw: `${pw}`, name: `${name}` });

  }

  async handleGetItem(event) {
    event.preventDefault();
    const { getItemId } = this.state;

    try {
      const response = await axios.get(`/items/${getItemId}`);  // Get the specific item
      alert(`ID ${getItemId} 조회 성공!`);
      this.setState({ items: [response.data] });  // update the items array with the fetched item
      console.log('handleGetItem state:', this.state,response) ;  // log the updated state
    } catch (error) {
      console.error('Error get item:', error);
      alert('조회 실패 (해당 ID 없음).');
    }
  }
  
  // mg
  async handleDeleteItem(event) {
    event.preventDefault();
    const { deleteItemId } = this.state;
  
    try {
      await axios.delete(`/items/${deleteItemId}`); // Delete the specific item
      alert(`ID ${deleteItemId} 삭제 성공!`);
      this.setState({ deleteItemId: '' }); // Clear the input field after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  }


  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> ** Sign Up ** </label>
          <label>id:</label>
          <input
            type="text"
            name="id"
            onChange={this.handleChange}
            value={this.state.id}
          />

          <label>pw:</label>
          <input
            type="text"
            name="pw"
            onChange={this.handleChange}
            value={this.state.price}
          />

        <label>name:</label>
          <input
            type="text"
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
          />

          <button type="submit">Send</button>
        </form>

        {/* Add an input box and a button to fetch a specific item by ID */}
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

        {/* Render the list of items */}
        {Array.isArray(this.state.items) && this.state.items.map((item, index) => (
          item && <div key={index}>
             <p>Created Date: {item.date}</p>
            <p>Id: {item.id}</p>
            <p>pw: {item.pw}</p>
            <p>Name: {item.name}</p>
          </div>
        ))}     

        {/* mg */}
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
       </div>
    
    );
  }
}