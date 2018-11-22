import React from 'react';
import { Row, Col, Alert,Form, FormGroup, Label, Input, Table} from 'reactstrap';

import { UncontrolledTooltip} from 'reactstrap';

import {searchPart,addPartProject,getProjectParts} from '../utils/apiUtilities'


class ProjectsParts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: [],
                  units: 0,
                  searchName:null,
                  searchResult: []};

    this.partFinderTimeout = null
  }

  componentDidMount(){
    this.retrieveProjectParts()
  }

  retrieveProjectParts(){
    getProjectParts(this.props.project).then(res => {
      var units = Math.min(...res.data.results.map(e => Math.floor(e.available/e.quantity)))
      this.setState({results:res.data.results,units:units})
      
    })
  }

  partFinder(e){
    this.setState({searchName:e})

    if (this.partFinderTimeout) {
      clearTimeout(this.partFinderTimeout)
    }

    this.partFinderTimeout = setTimeout(()=>{
      searchPart(e).then((data) => {
          this.setState({searchResult:data.data.results})
      })
    },400)
  }

  addPart(p){
    var qty = parseInt(prompt("Quantity", "1"));
    addPartProject(this.props.project,p,qty).then(res => {
      this.setState({searchName: "",searchResult: []})
      this.retrieveProjectParts()
    })
  }

  render() {
    return (
      <div>
        <h4>{this.props.project.name}</h4>
        <p>{this.props.project.description}</p>
        <p><b>Available stock for {this.state.units} units</b></p>


        <Form autoComplete="off">
            <FormGroup>
              <Label for="partName">Search, add or modify parts:</Label>
              <Input type="text" name="partName" value={(this.state.searchName) ? this.state.searchName : ""} id="partName" onChange={e => this.partFinder(e.target.value)}/>
            </FormGroup>
        </Form>

        {(this.state.searchResult.length) ?  
          <Table size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Manufacturer</th>
            </tr>
          </thead>
          <tbody>
          {this.state.searchResult.map(r => {
            return <tr onClick={e => this.addPart(r)} key={r.id}>
                      <th>{r.name}</th>
                      <td>{r.description}</td>
                      <td>{r.manufacturer}</td>
                    </tr>
          })}
          </tbody>
        </Table>
        : null}


        <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Available</th>

          </tr>
        </thead>
        <tbody>
        {this.state.results.map(r => {
          return <tr key={r.id}>
                    <th>{r.name}</th>
                    <td>{r.description}</td>
                    <td>{r.quantity}</td>
                    <td className={(r.quantity < r.available) ? "text-success" : "text-danger"}><b>{r.available}</b></td>
                  </tr>
        })}
        </tbody>
      </Table>
      </div>
      
    );
  }
}

export default ProjectsParts;