import React, { Component } from 'react';
import {Input, Modal,ModalHeader,ModalBody,Table } from 'reactstrap';

import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'


import {getTransactions} from '../utils/apiUtilities' 



class ShowTransactionsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: []
    };

    this.toggle = this.props.onDone;

  }

  componentDidMount(){
    getTransactions(this.props.stock).then(res => {
      this.setState({transactions:res.data.results})
    })
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.stock.name} <small>({this.props.stock.vendorname})</small></ModalHeader>
          <ModalBody>
             <Table size="sm">
             <tbody>

               {this.state.transactions.map((e,i) => {
                return <tr key={i}>
                          <td>{moment(e.datetime).format("DD/MM/YY HH:mm")}</td>
                          <td>{e.user}</td>
                          <td className={(e.quantity > 0) ? "text-success" : "text-danger"}><FontAwesomeIcon icon={(e.quantity > 0) ? faCaretUp : faCaretDown} /> <b>{(e.quantity > 0) ? e.quantity : -1*e.quantity}</b></td>
                        </tr>
               })}
              </tbody>
             </Table>
          </ModalBody>
        </Modal>
    );
  }
}

export default ShowTransactionsModal;
