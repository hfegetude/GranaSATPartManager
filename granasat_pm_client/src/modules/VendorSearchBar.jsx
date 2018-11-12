import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';

import clipboardPasteProxy from '../utils/PasteProxy'


class VendorSearchBar extends React.Component {
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



  vendorSelect(p){
    this.setState({selectedVendor:p,
      searchVendor:p.name,
      vendorCoincidences: [],
      creationStatus:0})
    this.props.onSelect(p)
  }

  createVendor(){
    if(this.props.onCreateVendor){
      this.props.onCreateVendor(this.state.searchVendor)
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
          <Label for="vendor">Vendor</Label>
          <Input type="text" name="vendor" id="vendor" value={(this.state.searchVendor) ? this.state.searchVendor : ""} onChange={e => this.vendorFinder(e)} />
        </FormGroup>

        {(this.state.vendorCoincidences && this.state.vendorCoincidences.length) ?
          this.state.vendorCoincidences.map(e => <p onClick={c => this.vendorSelect(e)} key={e.id}><b>{e.name}</b> <small>{e.URL}</small></p>)
          : (this.state.searchVendor && !(this.state.selectedVendor))
          ? <Alert color="danger"> Vendor {this.state.searchVendor} was not found, would you like to <a href="#" onClick={this.createVendor.bind(this)} >create it? </a></Alert>
          : null}

        {(this.state.selectedVendor) ?
            <p>Selected: <b>{this.state.selectedVendor.name}</b> <small>{this.state.selectedVendor.URL}</small></p>
        : null}
         {((!this.state.searchVendor ) || (this.state.vendorCoincidences && this.state.vendorCoincidences.length)) 
         ? <Alert color="success"> <a href="#" onClick={this.createVendor.bind(this)} >Create new vendor? </a></Alert>
         :null
        }

      </Form>
    );
  }
}
export default VendorSearchBar;
