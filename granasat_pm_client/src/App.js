import React, { Component } from 'react';
import './App.css';
import Login from './modules/Login';
import Partfinder from './modules/Partfinder';
import CreateUser from './modules/CreateUser';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logged: false,
                  user : null};
  }
 
  render() {
    return (
     this.state.logged 
        ? <CreateUser></CreateUser> 
        : <Login onLogged={(user)=>{this.setState({logged: true, user:user})}}></Login>
    );
  }
}



export default App;
