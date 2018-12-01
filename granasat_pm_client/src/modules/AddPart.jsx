import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import clipboardPasteProxy from '../utils/PasteProxy'

import {createPart,modifyPart} from '../utils/apiUtilities'


class AddPart extends React.Component {
constructor(props) {
    super(props);


    if (this.props.part) {
      this.state = {
        name:this.props.part.name,
        description:this.props.part.description,
        manufacturer:this.props.part.manufacturer,
        datasheet: null,
        altiumFile: null,
        error: null,
        done: false
      }
    }else{
      if(this.props.defaultValues){
        this.state = {
          name:this.props.defaultValues.name,
        }
      }
      else {
          this.state = {name:"",
          description:"",
          manufacturer:"",
          datasheet: "",
          altiumFile: "",
          error: "",
          done: false
        }
      }
    }
  }

    componentDidMount(){
      this.pasteListener= clipboardPasteProxy((data)=>{
        this.setState({
          name: data.manufacturerCode,
          manufacturer: data.manufacturer,
          description: data.description
        })
      });
      document.addEventListener('paste', this.pasteListener);
    }
    componentWillUnmount(){
      document.removeEventListener('paste', this.pasteListener);
    }

    handleSubmit() {
      if (this.props.part) {
        modifyPart(this.props.part.id,this.state.name,this.state.description,this.state.manufacturer).then(response=>{
          if (this.props.onDone) {
            this.props.onDone()
          }
        })
      }else{
        createPart(this.state.name,this.state.description,this.state.manufacturer)
        .then((data) => {
          this.setState({error: null, done: true});
          if (this.props.onDone) {

            this.props.onDone(data.data.inserted)
          }
        }).catch((error)=>{
          this.setState({error: "ooops, something went wrong. Maybe part name is already in use"})
        })
      }

    }

  render() {
    return (
      <Form autoComplete="off">
        {(this.state.error)
                ?   <Alert color="danger">
                        {this.state.error}
                    </Alert>
                : null

        }
        <FormGroup>
          <Label for="partName">Part name</Label>
          <Input type="text" name="partName" value={this.state.name} id="partName" placeholder="" onChange={(e)=>{this.setState({name:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="description">Part Description</Label>
          <Input type="text" name="description" value={this.state.description} id="description" placeholder="" onChange={(e)=>{this.setState({description:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="manufacturer">Manufacturer</Label>
          <Input type="text" name="manufacturer" value={this.state.manufacturer}  id="manufacturer" placeholder="" onChange={(e)=>{this.setState({manufacturer:e.target.value})}}/>
        </FormGroup>
        {!this.state.done
        ?<Button onClick={()=>{this.handleSubmit()}} color="success">{(this.props.part) ? "Modify part" : "Create Part"}</Button>
        :<Button disabled="true" color="success">{(this.props.part) ? "Modify part" : "Create Part"}</Button>}


      </Form>
    );
  }
}
export default AddPart;
