import React from 'react';
import { Row, Col, Alert,Form, FormGroup, Label, Input, Table} from 'reactstrap';

import { UncontrolledTooltip} from 'reactstrap';

import {getProjects} from '../utils/apiUtilities'

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
      this.state = {results:[]};
  }

  componentDidMount(){
    getProjects().then(res => {
      this.setState({results:res.data.results})
    })
  }

  render() {
    return (
      <div>
        <h4>Projects</h4>
        <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Creator</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {this.state.results.map(r => {
          r.tooltipOpen = false
          return <tr onClick={e => {this.props.onProjectSelect(r)}} key={r.id}>
                    <th>{r.name}</th>
                    <td>{r.description}</td>
                    <td>{r.user}</td>
                    <td>{r.datetime}</td>
                    <td></td>
                  </tr>
        })}
        </tbody>
      </Table>
      </div>
      
    );
  }
}

export default ProjectsList;