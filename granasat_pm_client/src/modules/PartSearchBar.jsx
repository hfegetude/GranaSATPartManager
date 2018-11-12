import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';

import clipboardPasteProxy from '../utils/PasteProxy'


class PartSearchBar extends React.Component {
constructor(props) {
    super(props);
    this.state = {searchName:null,
                searchVendor: null,
                stockurl:null,
                storageplaces:[],
                error: null,
                nameCoincidences: null,
                selectedPart:null,
                vendorCoincidences:null,
                selectedVendor:null,
                quantity: 0,
                creationStatus: 0,
                foundstock:null
            };

    this.partFinderTimeout = null
    }


    componentDidMount(){
      this.pasteListener= clipboardPasteProxy((data)=>{
        this.setState({
          searchName: data.manufacturerCode,
          searchVendor: data.vendor,
          stockurl: data.url
        })
        this.partFinder({target:{value:data.manufacturerCode}},true)
        this.vendorFinder({target:{value:data.vendor}},true)

      });
      document.addEventListener('paste', this.pasteListener);


      axios.get('/api/storageplaces').then((data) => {
          this.setState({storageplaces:data.data.results,storageplace:data.data.results[0].name})
      })
    }
    componentWillUnmount(){
      document.removeEventListener('paste', this.pasteListener);
    }

  partFinder(e,autoselect=false){
    this.setState({searchName:e.target.value})

    if (this.partFinderTimeout) {
      clearTimeout(this.partFinderTimeout)
    }

    this.partFinderTimeout = setTimeout(()=>{
      axios.get('/api/part', {
        params: {
          name: this.state.searchName
        }
      }).then((data) => {
        if (autoselect && data.data.results.length === 1) {
          this.partSelect(data.data.results[0])
        }else{
          this.setState({selectedPart:null,nameCoincidences:data.data.results})
          if(this.props.onFind){
            this.props.onFind(data.data.results)
          }
          
        }
      })
    },400)
  }
 
  partSelect(p){
    this.setState({selectedPart:p,
      searchName:p.name,
      nameCoincidences: [],
    creationStatus:0})
    if(this.props.onSelect){
      this.props.onSelect(p);
    }
  }
  createPart(){
    if(this.props.onCreatePart){
      this.props.onCreatePart(this.state.searchName)
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
          <Input type="text" name="partName" value={(this.state.searchName) ? this.state.searchName : ""} id="partName" onChange={e => this.partFinder(e)}/>
        </FormGroup>

        {(this.state.nameCoincidences && this.state.nameCoincidences.length && this.state.searchName) ?
          this.state.nameCoincidences.map(e => <p onClick={c => this.partSelect(e)} key={e.id}><b>{e.name}</b> {e.manufacturer} <small>{e.description}</small></p>)
          : (this.state.searchName && !(this.state.selectedPart))
            ? <Alert color="danger"> {this.state.searchName} was not found, would you like to <a href="#" onClick={this.createPart.bind(this)} >create it? </a></Alert>
            : null}
        {(this.state.selectedPart) ?
            <p>Selected: <b>{this.state.selectedPart.name}</b> {this.state.selectedPart.manufacturer} <small>{this.state.selectedPart.description}</small></p>
        : null}
        {((!this.state.searchName ) || (this.state.nameCoincidences && this.state.nameCoincidences.length)) 
         ? <Alert color="success"> <a href="#" onClick={this.createPart.bind(this)} >Create new part? </a></Alert>
         :null
        }
      </Form>
    );
  }
}
export default PartSearchBar;
