import React, { Component } from 'react';
import axios from 'axios';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      price: '',
      items: [],  // holds the items fetched from the API
      getItemId: ''  // holds the ID input by the user to fetch a specific item
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGetItem = this.handleGetItem.bind(this);
  }


  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }

  async handleGetItem(event) {
    event.preventDefault();
    const { getItemId } = this.state;
    const response = await axios.get(`/items/${getItemId}`);  // fetch the specific item
    this.setState({ items: [response.data] });  // update the items array with the fetched item
    console.log('handleGetItem state:', this.state,response) ;  // log the updated state

  }

  async handleSubmit(event) {
    event.preventDefault();
    const { id, price, name } = this.state;
    await axios.put("/items",  
    { id: `${id}`, price: `${price}`, name: `${name}` });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label> ** Input the items ** </label>
          <label>id:</label>
          <input
            type="text"
            name="id"
            onChange={this.handleChange}
            value={this.state.id}
          />

          <label>price:</label>
          <input
            type="text"
            name="price"
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
            <p>Name: {item.name}</p>
            <p>Price: {item.price}</p>
          </div>
        ))}     
       </div>
    
    );
  }
}
