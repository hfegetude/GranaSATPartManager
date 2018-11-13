import React from 'react';
import { Row, Col, Alert,Form, FormGroup, Label, Input, Table} from 'reactstrap';
import {searchStock} from '../utils/apiUtilities' 

import { UncontrolledTooltip} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf,faLink, faFileArchive, faCog, faHandRock, faArrowDown, faArrowRight, faCalendar, faFolder } from '@fortawesome/free-solid-svg-icons'

import SearchStockItem from './SearchStockItem'
import TransactionModal from './TransactionModal'
import PartModifyModal from './PartModifyModal'
import ShowTransactionsModal from './ShowTransactionsModal'
import FilesModal from './FilesModal'



import clipboardPasteProxy from '../utils/PasteProxy'

class SearchStock extends React.Component {
constructor(props) {
    super(props);
      this.state = {
        search: "",
        results: undefined,
        showTransactionModal:false,
        showTransactionListModal:false,
        transactionstock: null,
        showModifyModal:false,
        modifypart:null,

        showFilesModal:false
      };

      this.searchTimeout = null
  }

  componentDidMount(){
    this.pasteListener= clipboardPasteProxy((data)=>{
      this.handleSearch(data.manufacturerCode,0)
    });
    document.addEventListener('paste', this.pasteListener);
  }
  componentWillUnmount(){
    document.removeEventListener('paste', this.pasteListener);
  }

  groupByVendor(collection) {
    var groups = {}
    for (let i = 0; i < collection.length; i++) {
      const vendor  = collection[i].name;
      if (groups[vendor]) {
        groups[vendor].push(collection[i])
      }else{
        groups[vendor] = [collection[i]]
      }
    }
    groups = Object.keys(groups).map(k => {
      if (groups[k].length === 1) {
        return groups[k][0]
      } else {
        return groups[k]
      }
    })
    return groups
  }

  handleSearch(s,delay=100){
    this.setState({search:s},()=>{      
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
  
        this.searchTimeout = setTimeout(()=>{
          searchStock(s).then((data) => {
            this.setState({results:data.data.results}) 
            // this.setState({results:this.groupByVendor(data.data.results)}) 
          })
        },delay)  
    }) 
  }

  render() {
    return (
      <div>
        <Form autoComplete="off">
        <FormGroup>
          <Label for="search">Search</Label>
          <Input autoFocus={true} type="text" name="search" value={this.state.search} id="search" placeholder="" onChange={(e)=>{this.handleSearch(e.target.value)}}/>
        </FormGroup>
      </Form>
      {(this.state.results === undefined || this.state.search.length === 0) ? null : 
        (this.state.results.length === 0) ? 
          <Alert color="danger">
            {this.state.search} not found :(
          </Alert>
        :
        <Table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Vendor</th>
            <th>Storage</th>
            <th>Qty.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {this.state.results.map(r => {
          r.tooltipOpen = false
          return <tr key={r.id}>
                    <td style={{maxHeight:"100px",maxWidth:"100px"}} ><img src={"images/" + ((r.image) ? r.image : "notfound.png")} className="img-fluid"></img></td>
                    <th style={{"width": "30%"}} className="align-middle" scope="row">{r.name}<br/><small><i>({r.manufacturer})</i></small><br/><small>{r.description}</small></th>
                    <td className="align-middle">{r.vendorname} <br/>  <a href={r.url} target="_blank"><small>{(r.vendorreference) ? r.vendorreference :null}</small></a></td>
                    <td className="align-middle" id={"result"+r.id}>{r.storagename}</td>
                    {(r.storagedescription) ? 
                      <UncontrolledTooltip placement="right" target={"result"+r.id}>
                      {r.storagedescription} <br/> 
                      <img style={{maxHeight:"150px",maxWidth:"150px"}} src={"images/" + ((r.storageimage) ? r.storageimage : "notfound.png")} className="img-fluid"></img>
                    </UncontrolledTooltip>
                    :null}
                    <td className="align-middle">{r.quantity}</td>
                    <td style={{"width": "10%"}} className="align-middle">
                      <Row>
                        <Col sm="4"><a href="#" onClick={() => {this.setState({showTransactionModal:true,transactionstock:r})}}><FontAwesomeIcon icon={faHandRock} /></a></Col>
                        <Col sm="4"><a href="#" onClick={() => {this.setState({showModifyModal:true,transactionstock:r,modifypart:{id:r.idpart,manufacturer:r.manufacturer,name:r.name,description:r.description}})}}><FontAwesomeIcon icon={faCog} /></a></Col>
                        <Col sm="4"><a href="#" onClick={() => {this.setState({showTransactionListModal:true,transactionstock:r})}}><FontAwesomeIcon icon={faCalendar} /></a></Col>
                      </Row>
                      <Row>
                        <Col sm="4"><a href="#" onClick={() => {this.setState({showFilesModal:true,transactionstock:r})}}><FontAwesomeIcon icon={faFolder} /></a></Col>
                        <Col sm="4">{(r.datasheet) ? <a href={"files/" + r.idpart + "/" + r.datasheet} target="_blank" ><FontAwesomeIcon icon={faFilePdf} /></a> : null }</Col>
                      </Row>
                      
                      </td>

                  </tr>
                  // # id, name, description, manufacturer, altiumfiles, datasheet, storagename, storagedescription, storageimage, vendorname, vendorreference, quantity, url
                  // '12', 'NCV5700DR2G', 'Gate Drivers HIGH CURRENT IGBT GATE DR', 'ON Semiconductor', NULL, NULL, 'Caja Pablo 2', NULL, NULL, 'Mouser', NULL, '0', 'https://www.mouser.es/ProductDetail/?qs=HXFqYaX1Q2wg2xost4dN2w%3d%3d'
                  
        })}
        </tbody>

         {/* {this.state.results.map((r,i) => {
          return <SearchStockItem key={"ssi" + i} item={r} setParentState={ps => {
            console.log(ps)
            this.setState(ps)}}></SearchStockItem>        
        })} */}

      </Table>
      }
      
      {(this.state.showTransactionModal) ? 
        <TransactionModal stock={this.state.transactionstock} onDone={()=>{
          this.setState({showTransactionModal:false})
          this.handleSearch(this.state.search,0)
        }}></TransactionModal>
      : null}
      {(this.state.showTransactionListModal) ? 
        <ShowTransactionsModal stock={this.state.transactionstock} onDone={()=>{
          this.setState({showTransactionListModal:false})
        }}></ShowTransactionsModal>
      : null}
      {(this.state.showModifyModal) ? 
        <PartModifyModal part={this.state.modifypart} stock={this.state.transactionstock} onDone={()=>{
          this.setState({showModifyModal:false})
          this.handleSearch(this.state.search,0)
        }}></PartModifyModal>
      : null}
      {(this.state.showFilesModal) ? 
        <FilesModal part={this.state.transactionstock} onDone={()=>{
          this.setState({showFilesModal:false})
        }}></FilesModal>
      : null}
      
      </div>
      
    );
  }
}
export default SearchStock;