import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import {createVendor} from '../utils/apiUtilities'


class AddVendor extends React.Component {
constructor(props) {
    super(props);
    if(this.props.defaultValues){
      this.state = {
        vendorName:this.props.defaultValues.name,
        vendorUrl:null,
        error: null,
        done: false
      };
    }
    else{
      this.state = {
        vendorName:null,
        vendorUrl:null,
        error: null,
        done: false

      };
    }

    }
    handleSubmit(event) {
        event.preventDefault();
        createVendor(this.state.vendorName, this.state.vendorUrl)
        .then((data) => {
          this.setState({error: null, done: true});

          this.props.onDone(data.data.inserted)
        })
        .catch((error)=>{
          this.setState({error: "oops, something went wrong, maybe vendor already exists"});
        });
      }
  isStringAndNotEmpty(s){
    if(typeof s === "string")
      return !(!s || 0 === s.length)
    else
      return false
  }
  isInputOk(){
    return (this.isStringAndNotEmpty(this.state.vendorName ) 
            &&this.isStringAndNotEmpty(this.state.vendorUrl))
  }

  render() {
    return (
      <Form onSubmit={(e)=>{this.handleSubmit(e)}}>
        {(this.state.error)
                ?   <Alert color="danger">
                        {this.state.error}
                    </Alert>
                : null

        }
        <FormGroup>
          <Label for="vendorName">Vendor Name</Label>
          <Input type="text" name="vendorName" id="vendorName" placeholder="Mouser" value={this.state.vendorName}  onChange={(e)=>{this.setState({vendorName:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="vendorUrl">Vendor URL</Label>
          <Input type="text" name="vendorUrl" id="vendorUrl" placeholder="www.mouser.com" value={this.state.vendorUrl} onChange={(e)=>{this.setState({vendorUrl:e.target.value})}}/>
        </FormGroup>
        {(this.isInputOk() && !this.state.done)
        ?<Button color="success">Create vendor</Button>
        :<Button disabled="true" color="success">Create vendor</Button>
      }
        
      </Form>
    );
  }
}
export default AddVendor;
