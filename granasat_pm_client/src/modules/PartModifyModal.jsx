import React, { Component } from 'react';
import {Modal,ModalHeader,ModalBody,ModalFooter,Button,ButtonGroup } from 'reactstrap';

import {modifyStock} from '../utils/apiUtilities' 
import AddPart from './AddPart'



class PartModifyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.toggle = this.props.onDone;
    console.log(this.props.part)

  }

  handleTransaction(p){
    modifyStock(this.props.stock,p*this.state.quantity).then(()=>{
      this.props.onDone()
    })
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modify {this.props.part.name}</ModalHeader>
          <ModalBody>
            <AddPart part={this.props.part} onDone={this.props.onDone}></AddPart>
          </ModalBody>  
        </Modal>
    );
  }
}

export default PartModifyModal;
