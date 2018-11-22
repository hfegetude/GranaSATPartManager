import React, { Component } from 'react';
import { Col, Row, Nav, NavLink, NavItem,Navbar,NavbarBrand, Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';


import AddStockManual from './AddStock'
import AddStock from './AddStockCP'
import SearchStock from './SearchStock'
import CreateUser from './CreateUser'
import AddStorage from './AddStorage';
import AddStockAndres from './AddStockCPAndres'
import Projects from './Projects'


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedScreen: "searchstock"};

    this.menusAdmin = {
      "searchstock": "Search Stock",
      "createstock": "Create Stock",
      "createstockmanual": "Create Stock Manual",
      "createstockandres": "Create Stock Andrés",
      "createstorage": "Create Storage",
      "createuser": "Create User",
      "projects": "Projects"
    }

    this.menusUser = {
      "searchstock": "Search Stock",
    }
  }

  render() {
    return (
      <Container className="">
        <Navbar className="mb-3" color="light" light expand="md">
          <NavbarBrand>GranaSAT Stock Manager</NavbarBrand>
        </Navbar>
        <Row>
          <Col md="2">
          <Nav vertical>

          {(this.props.user.user_group === 1) ? 
          Object.keys(this.menusAdmin).map(e => {
            return <NavItem key={e}>
                    <NavLink href="#" onClick={_ => this.setState({selectedScreen:e})}>{this.menusAdmin[e]}</NavLink>
                  </NavItem>
          })
          :
          Object.keys(this.menusUser).map(e => {
            return <NavItem key={e}>
                    <NavLink href="#" onClick={_ => this.setState({selectedScreen:e})}>{this.menusAdmin[e]}</NavLink>
                  </NavItem>
          })
        }
        
        </Nav>
          </Col>
          <Col md="10">
            {(this.state.selectedScreen === "searchstock") ? <SearchStock></SearchStock> : null}
            {/* {(this.state.selectedScreen === "createpart") ? <AddPart></AddPart> : null} */}
            {(this.state.selectedScreen === "createstock") ? <AddStock></AddStock> : null}
            {(this.state.selectedScreen === "createstockmanual") ? <AddStockManual></AddStockManual> : null}
            {(this.state.selectedScreen === "createstockandres") ? <AddStockAndres></AddStockAndres> : null}

            {(this.state.selectedScreen === "createuser") ? <CreateUser></CreateUser> : null}
            {(this.state.selectedScreen === "createstorage") ? <AddStorage></AddStorage> : null}
            {(this.state.selectedScreen === "projects") ? <Projects></Projects> : null}

          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
