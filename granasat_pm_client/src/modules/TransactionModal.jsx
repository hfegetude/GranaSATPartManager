import React, { Component } from 'react';
import {Input, Modal,ModalHeader,ModalBody,ModalFooter,Button,ButtonGroup } from 'reactstrap';

import {modifyStock} from '../utils/apiUtilities' 



class TransactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1
    };

    this.numberStyle = {
      fontSize: "5rem",
      height: "100%",
      // border: "white",
      // borderColor: "white",
      textAlign: "center",
    }

    this.buttonStyle = {
      fontWeight: "500",
      fontSize: "2rem",
    }

    this.toggle = this.props.onDone;
    console.log(this.props.stock)

  }

  handleTransaction(p){
    modifyStock(this.props.stock,p*this.state.quantity).then(()=>{
      this.props.onDone()
    })
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.stock.name} <small>({this.props.stock.vendorname})</small></ModalHeader>
          <ModalBody>
            <Input autoFocus={true} style={this.numberStyle} type="number" step="1" value={this.state.quantity} onChange={e => this.setState({quantity:e.target.value})}/>
          </ModalBody>
        
          <ModalFooter className="d-flex justify-content-center">
          
              <ButtonGroup className="w-100">
                  <Button style={this.buttonStyle} className="w-100" size="lg" color="success" onClick={e => this.handleTransaction(1)}>Add</Button>
                  <Button style={this.buttonStyle} className="w-100" size="lg" color="danger" onClick={e => this.handleTransaction(-1)}>Pick</Button>
              </ButtonGroup>
            
          </ModalFooter>

          
        </Modal>
    );
  }
}

export default TransactionModal;
