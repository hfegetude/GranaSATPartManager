import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import {Fragment,Typeahead,Control} from 'react-bootstrap-typeahead'

import clipboardPasteProxy from '../utils/PasteProxy'
 

class AddStock extends React.Component {
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
                foundstock:null,
                createPartName: null,
                createPartDescription: null,
                createPartManufacturer: null

            };

    this.partFinderTimeout = null
    this.vendorFinderTimeout = null
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
        }     
      })
    },400)  
  }

  vendorFinder(e,autoselect=false){
    this.setState({searchVendor:e.target.value})
    
    if (this.vendorFinderTimeout) {
      clearTimeout(this.partFinderTimeout)
    }

    this.vendorFinderTimeout = setTimeout(()=>{
      axios.get('/api/vendor', {
        params: {
          name: this.state.searchVendor
        }
      }).then((data) => {
        if (autoselect && data.data.results.length === 1) {
          this.vendorSelect(data.data.results[0])
        }else{
          this.setState({selectedVendor:null,vendorCoincidences:data.data.results})
        }
      })
    },400)  
  }

  partSelect(p){
    this.setState({selectedPart:p,
      searchName:p.name,
      nameCoincidences: [],
    creationStatus:0})
  }

  vendorSelect(p){
    this.setState({selectedVendor:p,
      searchVendor:p.name,
      vendorCoincidences: [],
      creationStatus:0})
  }

  checkStock(){
    if (this.state.selectedVendor && this.state.selectedPart) {
      axios.get('/api/stock', {
        params: {
          vendor: this.state.selectedVendor.id,
          part: this.state.selectedPart.id
        }
      }).then((data) => {
        console.log(data)
        if (data.data.results.length === 0) {
          this.setState({creationStatus:1})
        }else{
          console.log(data.data.results)
          this.setState({foundstock:data.data.results[0], creationStatus:2})
        }
      })
    }
  }
  createPart(){
    const formData = {
      name: this.state.createPartName,
      description: this.state.createPartDescription,
      manufacturer: this.state.createPartManufacturer,
    }
    

    axios.post('/api/part', formData)
    .then((data)=>{
      console.log(data)
    })
    .catch((error)=>{
      console.log(error)
    })
  }
  

  includeStock(){
    if (this.state.selectedVendor && this.state.selectedPart) {
      axios.post('/api/stock', {
          vendor: this.state.selectedVendor,
          part: this.state.selectedPart,
          quantity: this.state.quantity,
          url: this.state.stockurl,
          storageplace: this.state.storageplaces.filter(e => e.name === this.state.storageplace)[0]
        }).then((data) => {
        if (data.data.error) {
          this.setState({error:data.data.error})
        }else{
          this.setState({creationStatus:3})
        }
      })
    }
  }

  render() {
    return (
      <Form autoComplete ="off">
        {(this.state.error) 
                ?   <Alert color="danger">
                        {this.state.error}
                    </Alert>
                : null

        }
        <div>
          <h2>From part</h2>
          <FormGroup>
            <Label for="partName">Part name</Label>
            <Input type="text" name="partName" value={(this.state.searchName) ? this.state.searchName : ""} id="partName" onChange={e => this.partFinder(e)}/>
          </FormGroup>
          {(this.state.nameCoincidences && this.state.nameCoincidences.length && this.state.searchName) ? 
          this.state.nameCoincidences.map(e => <p onClick={c => this.partSelect(e)} key={e.id}><b>{e.name}</b> {e.manufacturer} <small>{e.description}</small></p>)
          : null}
        
        {(this.state.selectedPart) ? 
            <p>Selected: <b>{this.state.selectedPart.name}</b> {this.state.selectedPart.manufacturer} <small>{this.state.selectedPart.description}</small></p>
        : null}
      </div>

      <div>
        <h2>Create part</h2>
        <FormGroup>
          <Label for="partName">Part name</Label>
          <Input type="text" name="partName" value={this.state.createPartName} id="partName" placeholder="" onChange={(e)=>{this.setState({createPartName:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="description">Part Description</Label>
          <Input type="text" name="description" value={this.state.createPartDescription} id="description" placeholder="" onChange={(e)=>{this.setState({createPartDescription:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="manufacturer">Manufacturer</Label>
          <Input type="text" name="manufacturer" value={this.state.createPartManufacturer}  id="manufacturer" placeholder="" onChange={(e)=>{this.setState({createPartManufacturer:e.target.value})}}/>
        </FormGroup>
      </div>


       
       


        
        
        <Button onClick={this.createPart.bind(this)}>Add part</Button> :
        {(this.state.creationStatus === 0) ?
        <Button onClick={this.checkStock.bind(this)}>Check</Button> :
        (this.state.creationStatus === 1) ?
        <Button onClick={this.includeStock.bind(this)}>Include stock</Button> :
        (this.state.creationStatus === 2) ?
        <p>Stock available. Found: {this.state.foundstock.quantity} units @ {this.state.storageplaces.filter(e => e.id === this.state.foundstock.storageplace)[0].name}  (<a href={this.state.foundstock.url}>Link</a>) </p>:
        <p>Stock created OK</p>}
        
      </Form>
    );
  }
}
export default AddStock;