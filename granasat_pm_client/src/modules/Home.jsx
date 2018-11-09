import React, { Component } from 'react';
import { Col, Row, Nav, NavLink, NavItem,Navbar,NavbarBrand, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import AddStock from './AddStockCP'
import AddPart from './AddPart'


class Login extends Component {
  constructor(props) {
    super(props);
    this.handleMenu = this.handleMenu.bind(this);
    this.state = {selectedScreen: "createstock"};
  }
  
  handleMenu(e){
    console.log(e)
  }
  
  render() {
    return (
      <div>
        <Navbar className="mb-3" color="light" light expand="md">
          <NavbarBrand href="/">GranaSAT Stock Manager</NavbarBrand>
        </Navbar>
        <Row>
          <Col md="3">
          <Nav vertical>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createpart"})}>Create Part</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createstock"})}>Create Stock</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Another Link</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Disabled Link</NavLink>
          </NavItem>
        </Nav>
          </Col>
          <Col md="9">
            {(this.state.selectedScreen === "createpart") ? <AddPart></AddPart> : null}
            {(this.state.selectedScreen === "createstock") ? <AddStock></AddStock> : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
