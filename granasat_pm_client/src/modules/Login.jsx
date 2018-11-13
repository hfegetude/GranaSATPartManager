import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Col } from 'reactstrap';
import '../css/Login.css';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {user:null, pass:null};
  }
  handleSubmit(event) {
    event.preventDefault();
    const formData = {
      username: this.state.user,
      password: this.state.pass
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
        fetch('/api/whoami')
          .then(response => response.json()).then((data) => {
          this.props.onLogged(data);
        })   
      }
  })
}
  render() {
    return (
      <Container className="Login">
        <h2>Login GranaSAT Part Manager</h2>
        <Form className="form" onSubmit={(e)=>{this.handleSubmit(e)}}>
          <Col>
            <FormGroup>
              <Label>Username</Label>
              <Input
                type="input"
                name="email"
                id="exampleEmail"
                placeholder="Insert username"
                onChange={(e)=>{this.setState({user:e.target.value})}}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Insert password"
                onChange={(e)=>{this.setState({pass:e.target.value})}}
            />
            </FormGroup>
          </Col>
          <Button>Submit</Button>
        </Form>
      </Container>

    );
  }
}

export default Login;
