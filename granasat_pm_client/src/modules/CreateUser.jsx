import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

class CreateUser extends React.Component {
constructor(props) {
    super(props);
    this.state = {username:null, 
                email:null,
                password:null,
                firstname:null,
                lastname: null,
                usercreated:false
            };
    }
    handleSubmit(event) {
        event.preventDefault();
        const formData = {
          username: this.state.username,
          password: this.state.password,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
          email: this.state.email
        }
      
        // Encoded form parser for sending data in the body
       
        console.log(formData);
        console.log(JSON.stringify(formData));

        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json()).then((data) => {
          this.setState({usercreated:true})
        })
    }

  render() {
    return (

      (this.state.usercreated) ? "User created OK" : 
      <Form autoComplete="off" onSubmit={(e)=>{this.handleSubmit(e)}}>
        <FormGroup>
          <Label for="username">User name</Label>
          <Input type="text" name="username" id="username" placeholder="Your username" onChange={(e)=>{this.setState({username:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="userEmail">Email</Label>
          <Input type="email" name="email" id="userEmail" placeholder="noshitsherlock@gmail.com" onChange={(e)=>{this.setState({email:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="userPassword">Password</Label>
          <Input type="password" name="userPassword" id="userPassword" placeholder="put your password here" onChange={(e)=>{this.setState({password:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="firstName">First name</Label>
          <Input type="text" name="firstName" id="firstName" placeholder="John" onChange={(e)=>{this.setState({firstname:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="lastname">Second name</Label>
          <Input type="text" name="lastname" id="lastname" placeholder="Doe" onChange={(e)=>{this.setState({lastname:e.target.value})}}/>
        </FormGroup>
        <Button color="success">Create User</Button>
      </Form>
    );
  }
}
export default CreateUser;
