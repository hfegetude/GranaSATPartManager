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

  render() {
    return (
     this.state.logged 
        ? <Home user={this.state.user}></Home>
        : <Login onLogged={(user)=>{this.setState({logged: true, user:user.user})}}></Login>
    );
  }
}



export default App;
