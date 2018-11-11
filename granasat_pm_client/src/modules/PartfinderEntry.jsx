import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';

class PartfinderEntry extends Component {
  constructor(props) {
    super(props);
    this.state ={index: props.index,
                name: props.name, 
                description:props.description,
                manufacturer:props.manufacturer,
                datasheetURL: props.datasheetURL,
                place: props.place,
                qty: props.qty};
  }
  
  render() {
    return (
        <thead>
            <tr>
                <td scope="row">{this.state.index}</td>
                <td>{this.state.name}</td>
                <td><img src="assets/pdf-logo.png"></img></td>
                <td>{this.state.manufacturer}</td>
                <td>{this.state.description}</td>
                <td>{this.state.place}</td>
                <td>{this.state.qty}</td>
                <td> 
                    <div class="form-group col-md-2">
                        <Button color="success">+</Button>{' '}
                        <Button color="danger">-</Button>{' '}
                        <Input placeholder="0" />
                    </div> 
                </td> 
            </tr>  
        </thead>
     
    );
  }
}

export default PartfinderEntry;
