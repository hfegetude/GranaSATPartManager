import React from 'react';

import ProjectsList from './ProjectsList'
import ProjectsParts from './ProjectsParts'

class Projects extends React.Component {
  constructor(props) {
    super(props);
      this.state = {selected:null};
  }

  componentDidMount(){
    console.log(this.state.selected)
  }

  render() {
    return (
      (this.state.selected === null) ? 
        <ProjectsList onProjectSelect={p => {console.log(p);this.setState({selected:p})}}></ProjectsList>
      :
        <ProjectsParts project={this.state.selected} onClose={_ => {this.setState({selected:null})}}></ProjectsParts>

    );
  }
}
export default Projects;