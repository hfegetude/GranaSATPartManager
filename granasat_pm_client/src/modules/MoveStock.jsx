import React from 'react';
import axios from 'axios'

import { Col, Row, Button, Form, FormGroup, Label, Input, FormText , Alert} from 'reactstrap';
import Select from 'react-select'
import {modifyStockStorage} from '../utils/apiUtilities'

class MoveStock extends React.Component {
constructor(props) {
    super(props);
    this.state = {
      storageplace: null,
      storageplaces: [],
    };
  }
  moveStock(s){
    this.setState({storageplace:s})
    modifyStockStorage(this.props.stock, s.value )
  }

  componentDidMount(){
    axios.get('/api/storageplaces').then((data) => {
      data = data.data.results.map(e => {
        const p = {value : e, label: e.name}
        return p
      })
      var defstorage =(this.props.stock.storagename) 
                    ? data.filter(e => e.label === this.props.stock.storagename) 
                    : data[0]
      this.setState({storageplaces:data,storageplace:defstorage})
    })
    
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="storageplaces">Storage Place</Label>
          <Select name="storageplaces" selectProps="name" value={this.state.storageplace} options={this.state.storageplaces} onChange={s => {
          this.moveStock(s)
          }}></Select>
        </FormGroup>
      </Form>
    );
  }
}
export default MoveStock;
