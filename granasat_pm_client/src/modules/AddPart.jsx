import React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import clipboardPasteProxy from '../utils/PasteProxy'


class AddPart extends React.Component {
constructor(props) {
    super(props);
    this.state = {name:null, 
                description:null,
                manufacturer:null,
                datasheet: null,
                altiumFile: null,
                error: null
            };
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
    handleSubmit(event) {
        event.preventDefault();
        const formData = {
          name: this.state.name,
          description: this.state.description,
          manufacturer: this.state.manufacturer,
        }

      
        // Encoded form parser for sending data in the body
       
        console.log(formData);
        console.log(JSON.stringify(formData));
    
        fetch('/api/part', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then((data) => {
          if(data.error){
            this.setState({error: data.error})
          }else{
            this.setState({error: null});
            if(this.state.altiumFile || this.state.datasheet){
                const fileData = new FormData()
                if(this.state.datasheet){
                    fileData.append('file', this.state.datasheet[0], "datasheet_"+this.state.datasheet[0].name)
                }
                if(this.state.altiumFile){
                    fileData.append('file', this.state.altiumFile[0], "altium_"+this.state.altiumFile[0].name)
                }
                fetch('/api/part/files/'+data.id, {
                    method: 'POST',
                    body:fileData,
                })
            }
          }
           
        })
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
        <FormGroup>
          <Label for="datasheet">Datasheet</Label>
          <Input type="file" name="datasheet" id="datasheet" onChange={(e)=>{this.setState({datasheet:e.target.files})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="altiumFile">Altium Lib</Label>
          <Input type="file" name="altiumFile" id="altiumFile" onChange={(e)=>{this.setState({altiumFile:e.target.files})}}/>
        </FormGroup>
        
        <Button>Submit</Button>
      </Form>
    );
  }
}
export default AddPart;