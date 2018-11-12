import React from 'react';
import { Button, Form, FormGroup, Label, Input , Alert} from 'reactstrap';

import {createStorage} from '../utils/apiUtilities'


class AddStorage extends React.Component {
  constructor(props) {
      super(props);

      this.state = {name:"",
        description:"",
        photo: null,
        error: null,
        creationstatus: 0
      }
    }

    handleSubmit() {
      createStorage(this.state.name,this.state.description,this.state.photo).then(res => {
        if (res.data.status === "OK") {
          this.setState({creationstatus:1})
        }
      })
    }

  render() {
    return (
      (this.state.creationstatus === 0) ?  
      <Form autoComplete="off">
        {(this.state.error)
                ?   <Alert color="danger">
                        {this.state.error}
                    </Alert>
                : null
        }
        <FormGroup>
          <Label for="partName">Storage name</Label>
          <Input type="text" name="partName" value={this.state.name} id="partName" placeholder="" onChange={(e)=>{this.setState({name:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="description">Storage Description</Label>
          <Input type="text" name="description" value={this.state.description} id="description" placeholder="" onChange={(e)=>{this.setState({description:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="photo">Photo</Label>
          <Input type="file" name="photo" id="photo" onChange={(e)=>{this.setState({photo:e.target.files})}}/>
        </FormGroup>

        <Button onClick={()=>{this.handleSubmit()}} color="success">Create Storage</Button>
      </Form> 
      :
      "Storage added ok!"
    );
  }
}
export default AddStorage;
