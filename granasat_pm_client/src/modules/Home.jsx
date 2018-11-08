import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Col } from 'reactstrap';
import LateralNav from './LateralNav'
class Login extends Component {
  constructor(props) {
    super(props);
    this.handleMenu = this.handleMenu.bind(this);
    this.state = {selectedScreen: null};
  }
  
  handleMenu(e){
    console.log(e)
  }
  
  render() {
    return (
        <LateralNav hola="hola" onItemSelection={this.handleMenu}></LateralNav>
    );
  }
}

export default Login;
