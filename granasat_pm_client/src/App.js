import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button , Container} from 'reactstrap';
import Login from './Login';
import Partfinder from './Partfinder';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logged: 1};
  }

  render() {
    return (
     this.state.logged 
        ? <Partfinder></Partfinder> 
        : <Login></Login>
    );
  }
}



export default App;
