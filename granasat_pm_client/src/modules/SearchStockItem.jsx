import React from 'react';
import { UncontrolledTooltip} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf,faLink, faFileArchive, faCog, faHandRock, faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons'


class SearchStock extends React.Component {
constructor(props) {
    super(props);
    this.state = {
      item : this.props.item,
      collapse: true
    };
  }

  createMultiRow(collapse){
    if (collapse) {
      return <tr key={this.state.item.id}>
                          <td className="align-middle">{(this.state.item[0].image) ? <img style={{maxWidth:"70px"}} className="img-thumbnail" src={"images/" + this.state.item[0].image} className="img-fluid"></img>: null}</td>
                          <th className="align-middle" scope="row">{this.state.item[0].name}</th>
                          <td className="align-middle"><small>{this.state.item[0].description}</small></td>
                          <td className="align-middle">{this.state.item[0].manufacturer}</td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle"></td>
                          <td className="align-middle" onClick={_ => this.setState({collapse:!this.state.collapse})}><FontAwesomeIcon icon={faArrowRight} /></td>
                      </tr>
    } else {
      var elements = [
        <tr key={this.state.item.id}>
          <td className="align-middle"></td>
          <th className="align-middle" scope="row">{this.state.item[0].name}</th>
          <td className="align-middle"><small>{this.state.item[0].description}</small></td>
          <td className="align-middle">{this.state.item[0].manufacturer}</td>
          <td className="align-middle"></td>
          <td className="align-middle"></td>
          <td className="align-middle"></td>
          <td className="align-middle" onClick={_ => this.setState({collapse:!this.state.collapse})}><FontAwesomeIcon icon={faArrowDown} /></td>
        </tr>]
      elements = elements.concat(this.state.item.map(e => {
        return <tr key={e.id}>
        <td className="align-middle"><img style={{maxWidth:"70px"}} className="img-thumbnail" src={"images/" + ((e.image) ? e.image : "notfound.png")} className="img-fluid"></img></td>
        <th className="align-middle" scope="row"></th>
        <td className="align-middle"></td>
        <td className="align-middle"></td>
          <td className="align-middle">{e.vendorname} <small>{(e.vendorreference) ? "("+e.vendorreference+")" :null}</small></td>
          <td className="align-middle" id={"result"+e.id}>{e.storagename}</td>
          {(e.storagedescription) ? 
            <UncontrolledTooltip placement="right" target={"result"+e.id}>
            {e.storagedescription}
          </UncontrolledTooltip>
          :null}
          <td className="align-middle">{e.quantity}</td>
          <td className="align-middle">
            {(e.datasheet) ? <a href={"datasheets/" + e.datasheet}><FontAwesomeIcon icon={faFilePdf} /></a> : null }
            {(e.altiumfiles) ? <a href={"altiumfiles/" + e.altiumfiles}><FontAwesomeIcon icon={faFileArchive} /></a>: null}
            {(e.url) ? <a href={e.url}><FontAwesomeIcon icon={faLink} /></a> : null }
            <a href="#" onClick={() => {this.props.setParentState({showTransactionModal:true,transactionstock:e})}}><FontAwesomeIcon icon={faHandRock} /></a>
            <a href="#" onClick={() => {this.props.setParentState({showModifyModal:true,modifypart:{id:e.idpart,manufacturer:e.manufacturer,name:e.name,description:e.description}})}}><FontAwesomeIcon icon={faCog} /></a>
            </td>
        </tr>
      }))
      return elements
    }              
  }

  render() {
    return (
      (Array.isArray(this.state.item)) ? 
        this.createMultiRow(this.state.collapse)
      :
      <tr key={this.state.item.id}>
            <td className="align-middle">{(this.state.item.image) ? <img style={{maxWidth:"70px"}} className="img-thumbnail" src={"images/" + this.state.item.image} className="img-fluid"></img>: null}</td>
            <th className="align-middle" scope="row">{this.state.item.name}</th>
            <td className="align-middle"><small>{this.state.item.description}</small></td>
            <td className="align-middle">{this.state.item.manufacturer}</td>
            <td className="align-middle">{this.state.item.vendorname} <small>{(this.state.item.vendorreference) ? "("+this.state.item.vendorreference+")" :null}</small></td>
            <td className="align-middle" id={"result"+this.state.item.id}>{this.state.item.storagename}</td>
            {(this.state.item.storagedescription) ? 
              <UncontrolledTooltip placement="right" target={"result"+this.state.item.id}>
              {this.state.item.storagedescription}
            </UncontrolledTooltip>
            :null}
            <td className="align-middle">{this.state.item.quantity}</td>
            <td className="align-middle">
              {(this.state.item.datasheet) ? <a href={"datasheets/" + this.state.item.datasheet}><FontAwesomeIcon icon={faFilePdf} /></a> : null }
              {(this.state.item.altiumfiles) ? <a href={"altiumfiles/" + this.state.item.altiumfiles}><FontAwesomeIcon icon={faFileArchive} /></a>: null}
              {(this.state.item.url) ? <a href={this.state.item.url}><FontAwesomeIcon icon={faLink} /></a> : null }
              <a href="#" onClick={() => {this.props.setParentState({showTransactionModal:true,transactionstock:this.state.item})}}><FontAwesomeIcon icon={faHandRock} /></a>
              <a href="#" onClick={() => {this.props.setParentState({showModifyModal:true,modifypart:{id:this.state.item.idpart,manufacturer:this.state.item.manufacturer,name:this.state.item.name,description:this.state.item.description}})}}><FontAwesomeIcon icon={faCog} /></a>
              </td>
      </tr>
    );
  }
}
export default SearchStock;