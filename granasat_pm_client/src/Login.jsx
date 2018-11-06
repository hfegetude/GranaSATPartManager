import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';

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

    fetch('http://192.168.1.24:9876/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedForm,
      credentials: 'same-origin'
    })
    .then(response => {
      fetch('http://192.168.1.24:9876/api/whoami',{
        credentials: 'include'
      }).then((response)=>console.log(response))
    })
  }
  render() {
    return (
      <Container className="mt-5">
        <Form onSubmit={(e)=>{this.handleSubmit(e)}}>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input type="text" name="username" id="exampleEmail" placeholder="with a placeholder" onChange={(e)=>{this.setState({user:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" onChange={(e)=>{this.setState({pass:e.target.value})}}/>
        </FormGroup>
        <Button disabled={this.state.user === null} >Login</Button>
      </Form>
    </Container>
    );
  }
}

export default Login;
