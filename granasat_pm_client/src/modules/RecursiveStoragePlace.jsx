import React from 'react';
import { Form, FormGroup, Label} from 'reactstrap';

import {getStorage,getStorageHierachy} from '../utils/apiUtilities'

import Select from 'react-select'
import {Treebeard} from 'react-treebeard';

class RecursiveStoragePlace extends React.Component {
constructor(props) {
    super(props);
    this.state = {
      showingStoragePlace: this.props.initial,
      parents: null,
      childs:null,
      selfstorage:null,
      tree: null,
      cursor: null,
      loading:true
    }
  }

  treeify = (list) => {
    var idAttr = 'id';
    var parentAttr = 'parent';
    var childrenAttr = 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function(obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });
    list.forEach(function(obj) {
        if (obj[parentAttr] != null) {
            lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            treeList.push(obj);
        }
    });
    return treeList;
  }

  componentDidMount = () => {
    getStorage().then(res => {
      console.log(res.data.results)
      console.log(this.treeify(res.data.results))
      this.setState({tree:this.treeify(res.data.results)})
    })
    
    // getStorageHierachy(42).then(res => {
    //   var selfstorage = res.results.parents.shift()
    //   this.setState({parents:res.results.parents,childs:res.results.childs,selfstorage:selfstorage})
    //   console.log(res)
    // })
  }

  onToggle = (node, toggled) => {
    console.log(node)
    console.log(toggled)
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){ node.toggled = toggled; }
    this.setState({ cursor: node });
}

  render() {
    return (
      <Form autoComplete="off">
        {(this.state.tree) ? 
          <Treebeard
            data={this.state.tree}
            onToggle={this.onToggle}
          />: null}
        
        <FormGroup>
          <Label for="storageplaces">Storage Place</Label>
          <Select name="storageplaces" selectProps="name" value={this.state.storageplace} options={this.state.storageplaces} onChange={s => {
          this.setState({storageplace:s})
          localStorage.setItem('storageplace', JSON.stringify(s));
          }}></Select>
        </FormGroup>
      </Form>
    );
  }
}
export default RecursiveStoragePlace;
