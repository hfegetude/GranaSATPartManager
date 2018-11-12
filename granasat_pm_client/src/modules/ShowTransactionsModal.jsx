import React, { Component } from 'react';
import {Input, Modal,ModalHeader,ModalBody,Table } from 'reactstrap';

import {getTransactions} from '../utils/apiUtilities' 



class TransactionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.toggle = this.props.onDone;
    console.log(this.props.stock)

  }

  componentDidMount(){
    getTransactions(this.props.stock).then(res => {
      console.log(res.data)
    })
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.stock.name} <small>({this.props.stock.vendorname})</small></ModalHeader>
          <ModalBody>
             <Table>
             <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Larry</td>
                  <td>the Bird</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
             </Table>
          </ModalBody>
        </Modal>
    );
  }
}

export default TransactionModal;
