import React, { Component } from 'react';
import axios from 'axios'
import './App.css';
import Login from './modules/Login';
import Partfinder from './modules/Partfinder';
import CreateUser from './modules/CreateUser';
import AddPart from './modules/AddPart'

import Home from './modules/Home'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logged: false,
                  user : null};
  }

  componentDidMount(){
    const formData = {
      username: 'hfegetude',
      password: 'gilipollas'
    }
  
    // Encoded form parser for sending data in the body
    const encodedForm = Object.keys(formData).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
    }).join('&')

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodedForm,
      credentials: 'include'
    })
    .then(response => response.json()).then((data) => {
      console.log(data)
      if(data.status === "OK"){
        axios.get('/api/whoami').then((data) => {
          console.log(data.data)
          this.setState({logged: true, user:data});
        })   
      }
  })
  }
 
  render() {
    return (
     this.state.logged 
        ? <Home></Home>
        : <Login onLogged={(user)=>{this.setState({logged: true, user:user})}}></Login>
    );
  }
}



export default App;
