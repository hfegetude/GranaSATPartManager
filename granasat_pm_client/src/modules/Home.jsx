import React, { Component } from 'react';
import { Col, Row, Nav, NavLink, NavItem,Navbar,NavbarBrand, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import AddStock from './AddStockCP'
import AddStockM from './AddStock'
import AddPart from './AddPart'
import SearchStock from './SearchStock'




class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedScreen: "searchstock"};
  }
  
  render() {
    return (
      <Container className="">
        <Navbar className="mb-3" color="light" light expand="md">
          <NavbarBrand href="/">GranaSAT Stock Manager</NavbarBrand>
        </Navbar>
        <Row>
          <Col md="3">
          <Nav vertical>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"searchstock"})}>Search Stock</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createstock"})}>Create Stock</NavLink>
          </NavItem>
          <NavItem>
<<<<<<< HEAD
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createstockManual"})}>Create Stock Manual</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Disabled Link</NavLink>
          </NavItem>
=======
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createpart"})}>Create Part</NavLink>
          </NavItem> 
>>>>>>> origin/master
        </Nav>
          </Col>
          <Col md="9">
            {(this.state.selectedScreen === "searchstock") ? <SearchStock></SearchStock> : null}
            {(this.state.selectedScreen === "createpart") ? <AddPart></AddPart> : null}
            {(this.state.selectedScreen === "createstock") ? <AddStock></AddStock> : null}
            {(this.state.selectedScreen === "createstockManual") ? <AddStockM></AddStockM> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
