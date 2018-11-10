import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import {createVendor} from '../utils/apiUtilities'


class AddVendor extends React.Component {
constructor(props) {
    super(props);
    this.state = {
                vendorName:null,
                vendorUrl:null,
                error: null
            };
    }
    handleSubmit(event) {
        event.preventDefault();
        createVendor(this.state.vendorName, this.state.vendorUrl)
        .then((data) => {
          console.log(data)
          if(data.error){
            this.setState({error: data.error})
          }else{
            this.setState({error: null});
            this.props.onDone({name: this.state.vendorName, url: this.state.vendorUrl})
          }
        });
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
          <Label for="vendorName">Vendor url</Label>
          <Input type="text" name="vendorName" id="vendorName" placeholder="Mouser" onChange={(e)=>{this.setState({vendorName:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="vendorUrl">Part Description</Label>
          <Input type="text" name="vendorUrl" id="vendorUrl" placeholder="www.mouser.com" onChange={(e)=>{this.setState({vendorUrl:e.target.value})}}/>
        </FormGroup>
        <Button>Create vendor</Button>
      </Form>
    );
  }
}
export default AddVendor;
