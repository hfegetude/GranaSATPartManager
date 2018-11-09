import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import {Fragment,Typeahead,Control} from 'react-bootstrap-typeahead'
import AddStockAddPart from './AddStockAddPart'
import clipboardPasteProxy from '../utils/PasteProxy'
 

class AddStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          currentScreen: "partselection",
          partName: null,
          provider: null,
          };
    }
  render() {
    return (
      <AddStockAddPart></AddStockAddPart>
    );
  }
}
export default AddStock;