import React, { Component } from 'react';
import {Modal,ModalHeader,ModalBody,ModalFooter,Button,ButtonGroup } from 'reactstrap';

import {modifyStock} from '../utils/apiUtilities' 
import AddPart from './AddPart'
import MoveStock from './MoveStock';
import { timingSafeEqual } from 'crypto';



class PartModifyModal extends Component {
  constructor(props) {
    super(props);
    this.movePart = React.createRef();
    this.state = {};
    this.toggle = this.props.onDone;
  }
  doSubmit(){
    this.props.onDone()
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Modify {this.props.part.name}</ModalHeader>
          <ModalBody>
            <MoveStock ref={this.movePart} stock = {this.props.stock}></MoveStock>
            <AddPart part={this.props.part} onDone={this.props.onDone}></AddPart>
          </ModalBody>  
        </Modal>
    );
  }
}

export default PartModifyModal;
