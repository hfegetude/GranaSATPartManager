import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button , Container} from 'reactstrap';
import Login from './Login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {logged: 1};
  }

  render() {
    return (
     logged 
        ? <Login></Login>
        : <Partfinder></Partfinder>     
    );
  }
}



export default App;
