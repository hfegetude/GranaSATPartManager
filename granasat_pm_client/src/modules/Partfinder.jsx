import React, { Component } from 'react';
import { Button, Table, Input } from 'reactstrap';
import PartfinderEntry from './PartfinderEntry'
class Partfinder extends Component {
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
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedForm,
      credentials: 'include'
    })
    .then(response => {
      fetch('/api/whoami',{
        credentials: 'include'
      }).then((response)=>console.log(response))
    })
  }
  render() {
    return (
        <div>
            <div class="form-group col-md-2">
                <Button color="success">Search</Button>{' '}
                <Input placeholder="0" />
            </div> 
            <Table responsive>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Datashit</th>
                    <th>Manufacturer</th>
                    <th>Description</th>
                    <th>Place</th>
                    <th>Qty</th>
                    <th>Operation</th>
                </tr>
                </thead>
                
                <PartfinderEntry index="1" name="a" manufacturer="x" description="b" place="c" qty="c"></PartfinderEntry> 
                <PartfinderEntry index="1" name="a" manufacturer="x" description="b" place="c" qty="c"></PartfinderEntry> 
                <PartfinderEntry index="1" name="a" manufacturer="x" description="b" place="c" qty="c"></PartfinderEntry> 
            </Table>
        </div>
        
    );
  }
}

export default Partfinder;
