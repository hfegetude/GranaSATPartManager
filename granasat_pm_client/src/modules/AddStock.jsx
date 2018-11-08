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
                foundstock:null
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
        
        {(this.state.nameCoincidences && this.state.nameCoincidences.length) ? 
          this.state.nameCoincidences.map(e => <p onClick={c => this.partSelect(e)} key={e.id}><b>{e.name}</b> {e.manufacturer} <small>{e.description}</small></p>)
          : null}
        
        {(this.state.selectedPart) ? 
            <p>Selected: <b>{this.state.selectedPart.name}</b> {this.state.selectedPart.manufacturer} <small>{this.state.selectedPart.description}</small></p>
        : null}

        {/* <FormGroup>
          <Label for="description">Part Description</Label>
          <Input disabled={this.state.namecoincidences && this.state.namecoincidences.length} type="text" name="description" value={(this.state.description) ? this.state.description : ""} id="description" onChange={(e)=>{this.setState({description:e.target.value})}}/>
        </FormGroup>
        <FormGroup>
          <Label for="manufacturer">Manufacturer</Label>
          <Input disabled={this.state.namecoincidences && this.state.namecoincidences.length} type="text" name="manufacturer" value={(this.state.manufacturer) ? this.state.manufacturer : ""}  id="manufacturer" onChange={(e)=>{this.setState({manufacturer:e.target.value})}}/>
        </FormGroup> */}

       
       

        <FormGroup>
          <Label for="vendor">Vendor</Label>
          <Input type="text" name="vendor" id="vendor" value={(this.state.searchVendor) ? this.state.searchVendor : ""} onChange={e => this.vendorFinder(e)} />
        </FormGroup>

        {(this.state.vendorCoincidences && this.state.vendorCoincidences.length) ? 
          this.state.vendorCoincidences.map(e => <p onClick={c => this.vendorSelect(e)} key={e.id}><b>{e.name}</b> <small>{e.URL}</small></p>)
          : null}
        
        {(this.state.selectedVendor) ? 
            <p>Selected: <b>{this.state.selectedVendor.name}</b> <small>{this.state.selectedVendor.URL}</small></p>
        : null}
        
        {(this.state.creationStatus === 1) ? 
          <div><FormGroup>
          <Label for="stockurl">Stock URL</Label>
          <Input type="text" name="stockurl" id="stockurl" value={(this.state.stockurl) ? this.state.stockurl : ""} onChange={(e)=>{this.setState({stockurl:e.target.value})}}/>
        </FormGroup>

        <FormGroup>
          <Label for="quantity">Quantity</Label>
          <Input type="number" step="1" name="quantity" id="quantity" value={(this.state.quantity) ? this.state.quantity : ""} onChange={(e)=>{this.setState({quantity:e.target.value})}}/>
        </FormGroup>

        <FormGroup>
          <Label for="storageplaces">Storage Place</Label>
          <Input type="select" name="storageplaces" id="storageplaces" value={(this.state.storageplace) ? this.state.storageplace : ""} onChange={(e)=>{this.setState({storageplace:e.target.value})}}>
            {this.state.storageplaces.map((e,index) => <option key={e.id}>{e.name} {(e.description) ?  "(" + e.description + ")" : null}</option>)}
          </Input>
        </FormGroup></div>
        : null}
        
        
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