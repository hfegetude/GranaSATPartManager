import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import Select from 'react-select'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'

import TransactionModal from './TransactionModal'
import clipboardPasteProxy from '../utils/PasteProxy'
import {getPart,createPart,createVendor,getStock,createStock,getStorage} from '../utils/apiUtilities' 

class AddStockAndres extends React.Component {
constructor(props) {
    super(props);
    this.state = {searchName:null,
                searchVendor: null,
                storageplaces:[],
                
                error: null,

                nameCoincidences: null,
                selectedPart:null,

                vendorCoincidences:null,
                selectedVendor:null,

                quantity: 0,

                foundstock:null,

                clipboardData: null,
                createdStock:null,

                showTransactionModal: false,
            };
  
    this.partFinderTimeout = null
    this.vendorFinderTimeout = null
    }

    
    componentDidMount(){
      this.pasteListener= clipboardPasteProxy((data)=>{
        data.vendor = "Andres Roldan Stock SL"
        data.vendorUrl = "www.industriasroldan.com"
        data.vendorCode = data.manufacturerCode
        this.setState({
          searchName: data.manufacturerCode,
          searchVendor: data.vendor,
          clipboardData: data,
          selectedPart:null,
          selectedVendor:null,
          foundstock:null,
          nameCoincidences: null,
          vendorCoincidences:null,
          quantity: 0,
          createdStock:null,
          showTransactionModal: false,

        },()=>{
          this.partFinderTimeout = null
          this.vendorFinderTimeout = null
          this.partFinder(this.state.searchName,true)
          this.vendorFinder(this.state.searchVendor,true)
        })  
      });

      document.addEventListener('paste', this.pasteListener);

      getStorage().then((data) => {
        data = data.data.results.map(e => {
          const p = {value : e, label: e.name}
          return p
        })

        var local = JSON.parse(localStorage.getItem('storageplace'))
        local = (local) ? data.filter(e => e.label === local.label) : []
        var defstorage = (local.length) ? local[0] : data[0];

        this.setState({storageplaces:data,storageplace:defstorage})
      })

    }
    componentWillUnmount(){
      document.removeEventListener('paste', this.pasteListener);
    }

    partFinder(e,autoselect=false){
      this.setState({searchName:e})
      
      if (this.partFinderTimeout) {
        clearTimeout(this.partFinderTimeout)
      }

      this.partFinderTimeout = setTimeout(()=>{
        getPart(this.state.searchName).then((data) => {
          if (autoselect && data.data.results.length === 1) {
            this.partSelect(data.data.results[0])
          }else{
            this.setState({selectedPart:null,nameCoincidences:data.data.results})
          }     
        })
      },50)  
    }

    vendorFinder(e,autoselect=false){
      this.setState({searchVendor:e})
      
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
      },50)  
    }

  createNotFoundPart(){
    createPart(this.state.clipboardData.manufacturerCode,this.state.clipboardData.description,this.state.clipboardData.manufacturer,this.state.clipboardData.datasheet).then(response => {
      this.partSelect(response.data.inserted)
    })
  }

  createNotFoundVendor(){
    createVendor(this.state.clipboardData.vendor,this.state.clipboardData.vendorUrl).then(response => {
      this.vendorSelect(response.data.inserted)
    })
  }

  partSelect(p){
    this.setState({selectedPart:p,
      searchName:p.name,
      nameCoincidences: null},
      ()=>{
        this.checkStock()
      })    
  }

  vendorSelect(p){
    this.setState({selectedVendor:p,
      searchVendor:p.name,
      vendorCoincidences: null}
      ,()=>{
        this.checkStock()
      })
    }

  checkStock(){
    if(this.state.selectedVendor && this.state.selectedPart){
      getStock(this.state.selectedPart,this.state.selectedVendor).then(response => {
        if (response.data.results.length) {
          var found = response.data.results[0]
          found.vendor = this.state.selectedVendor
          found.part = this.state.selectedPart
          found.storageplace = this.state.storageplaces.filter(e => e.value.id === found.storageplace)[0].value
          found.name = found.part.name
          found.vendorname = found.vendor.name
          this.setState({foundstock:response.data.results[0]})
        }
      })
    }
  }

  insertStock(){
    createStock(this.state.selectedPart,this.state.selectedVendor,this.state.clipboardData.vendorCode,this.state.clipboardData.url,parseInt(this.state.quantity),this.state.storageplace.value,this.state.clipboardData.image).then((response) => {
      if (response.data.error) {
        this.setState({error:response.data.error})
      }else{
        this.setState({createdStock:response.data.inserted})
      }
    })
  }

  resetState(){
    this.setState({searchName:null,
      searchVendor: null,
      
      error: null,

      nameCoincidences: null,
      selectedPart:null,

      vendorCoincidences:null,
      selectedVendor:null,

      quantity: 0,

      foundstock:null,

      clipboardData: null,
      createdStock:null,

      showTransactionModal: false,
  })
  }

  render() {
    return (

      (this.state.createdStock) ? 
      <div>
          Created OK. <a href="#" onClick={_ => {this.resetState()}}> Create another</a>
      </div>
      
      : 
      <Form autoComplete="off">
        {(this.state.error) 
                ?   <Alert color="danger">
                        {this.state.error}
                    </Alert>
                : null

        }

        <Row>
        
          <Col md="9">
            <FormGroup>
            <Label for="partName">Part name</Label>
            <Input disabled={true} type="text" name="partName" value={(this.state.searchName) ? this.state.searchName : ""} id="partName" onChange={e => this.partFinder(e.target.value)}/>
          </FormGroup>
          </Col>
          { (this.state.clipboardData && this.state.clipboardData.image) ? 
                <Col md="3">
                  <img src={this.state.clipboardData.image} className="img-fluid"></img>
                </Col>
          : null
          }
        </Row>
        
        
        {(this.state.nameCoincidences && this.state.nameCoincidences.length) ? 
          this.state.nameCoincidences.map(e => <p onClick={c => {this.partSelect(e)}} key={e.id}><b>{e.name}</b> {e.manufacturer} <small>{e.description}</small></p>)
          : null}

        {(!this.state.selectedPart && this.state.clipboardData) ? 
            <p>Part not found: <b>{this.state.clipboardData.manufacturerCode}</b> ({this.state.clipboardData.manufacturer})<br/>
            {(this.state.clipboardData.datasheet) ? 
            <div>Found PDF:  <a href={this.state.clipboardData.datasheet} target="_blank" ><FontAwesomeIcon icon={faFilePdf} /> Datasheet</a><br/></div>
            : null}
            <small>{this.state.clipboardData.description}</small><br/>
            <Button size="sm" color="success" onClick={this.createNotFoundPart.bind(this) }>Create</Button></p>
          : null}
        
        {(this.state.selectedPart) ? 
            <p>Found Part: <b>{this.state.selectedPart.name}</b> {this.state.selectedPart.manufacturer} <small>{this.state.selectedPart.description}</small></p>
        : null}

       
       
        <FormGroup>
          <Label for="vendor">Vendor</Label>
          <Input disabled={true} type="text" name="vendor" id="vendor" value={(this.state.searchVendor) ? this.state.searchVendor : ""} onChange={e => this.vendorFinder(e.target.value)} />
        </FormGroup>

        {(this.state.vendorCoincidences && this.state.vendorCoincidences.length) ? 
          this.state.vendorCoincidences.map(e => <p onClick={c => this.vendorSelect(e)} key={e.id}><b>{e.name}</b> <small>{e.URL}</small></p>)
          : null}

        {(!this.state.selectedVendor && this.state.vendorCoincidences && this.state.vendorCoincidences.length === 0) ? 
            <p>Vendor not found: <b>{this.state.clipboardData.vendor}</b> <small>({this.state.clipboardData.vendorUrl})</small><br/>
            <Button size="sm" color="success" onClick={this.createNotFoundVendor.bind(this) }>Create</Button></p>
          : null}
        
        {(this.state.selectedVendor) ? 
            <p>Found Vendor: <b>{this.state.selectedVendor.name}</b> <small>({this.state.selectedVendor.url})</small></p>
        : null}
        

        {(this.state.selectedVendor && this.state.selectedPart && !this.state.foundstock) ? 
        <div><FormGroup>
          <Label for="stockurl">Stock URL</Label>
          <Input disabled={true} type="text" name="stockurl" id="stockurl" value={(this.state.clipboardData.url) ? this.state.clipboardData.url : ""}/>
        </FormGroup>


        <FormGroup>
          <Label for="quantity">Quantity</Label>
          <Input type="number" step="1" name="quantity" id="quantity" value={this.state.quantity} onChange={(e)=>{this.setState({quantity:e.target.value})}}/>
        </FormGroup>

        <FormGroup>
          <Label for="storageplaces">Storage Place</Label>
          <Select name="storageplaces" selectProps="name" value={this.state.storageplace} options={this.state.storageplaces} onChange={s => {
          this.setState({storageplace:s})
          localStorage.setItem('storageplace', JSON.stringify(s));
          }}></Select>
        </FormGroup>

        <Button size="sm" color="success" onClick={this.insertStock.bind(this)}>Create Stock</Button>

        </div>
        : null} 

       
        
        {(this.state.foundstock) ?
        <div>
            <p>Stock already available. Found: {this.state.foundstock.quantity} units @ {this.state.foundstock.storageplace.name}  (<a href={this.state.foundstock.url}>Link</a>) </p>
            <Button size="sm" color="success" onClick={()=>{this.setState({showTransactionModal:true})}}>Modify Available Stock</Button>
        </div>
            : null}

        {(this.state.showTransactionModal) ? 
        <TransactionModal stock={this.state.foundstock} onDone={()=>{
          this.setState({showTransactionModal:false})
          this.checkStock()
        }}></TransactionModal>
        : null}
                    

      </Form>
    );
  }
}
export default AddStockAndres;