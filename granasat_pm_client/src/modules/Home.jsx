import React, { Component } from 'react';
import { Col, Row, Nav, NavLink, NavItem,Navbar,NavbarBrand, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import AddStockManual from './AddStock'
import AddStock from './AddStockCP'
import AddPart from './AddPart'
import SearchStock from './SearchStock'



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedScreen: "createstockmanual"};
  }

  render() {
    return (
      <Container className="">
        <Navbar className="mb-3" color="light" light expand="md">
          <NavbarBrand href="/">GranaSAT Stock Manager</NavbarBrand>
        </Navbar>
        <Row>
          <Col md="2">
          <Nav vertical>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"searchstock"})}>Search Stock</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createstock"})}>Create Stock</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createpart"})}>Create Part</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" onClick={e => this.setState({selectedScreen:"createstockmanual"})}>Create Stock Manual</NavLink>
          </NavItem>
        </Nav>
          </Col>
          <Col md="10">
            {(this.state.selectedScreen === "searchstock") ? <SearchStock></SearchStock> : null}
            {(this.state.selectedScreen === "createpart") ? <AddPart></AddPart> : null}
            {(this.state.selectedScreen === "createstock") ? <AddStock></AddStock> : null}
            {(this.state.selectedScreen === "createstockmanual") ? <AddStockManual></AddStockManual> : null}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
