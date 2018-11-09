import React from 'react';
import { UncontrolledTooltip, Form, FormGroup, Label, Input, Table} from 'reactstrap';
import {searchStock} from '../utils/apiUtilities' 


class SearchStock extends React.Component {
constructor(props) {
    super(props);
      this.state = {
        search: "",
        results: []
      };

      this.searchTimeout = null
  }

  handleSearch(s){
    this.setState({search:s})
    if (this.state.search.length) {
      
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(()=>{
        searchStock(s).then((data) => {
          console.log(data.data)
          this.setState({results:data.data.results}) 
        })
      },500)  
    }
    
  }

  render() {
    return (
      <div>
        <Form autoComplete="off">
        <FormGroup>
          <Label for="search">Search</Label>
          <Input type="text" name="search" value={this.state.search} id="search" placeholder="" onChange={(e)=>{this.handleSearch(e.target.value)}}/>
        </FormGroup>
      </Form>

      <Table>
        <thead>
          <tr>
            <th>Part Name</th>
            <th>Description</th>
            <th>Manufacturer</th>
            <th>Vendor</th>
            <th>Storage</th>
            <th>Qty.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {this.state.results.map(r => {
          r.tooltipOpen = false
          return <tr key={r.id}>
                    <th scope="row">{r.name}</th>
                    <td className="align-middle"><small>{r.description}</small></td>
                    <td className="align-middle">{r.manufacturer}</td>
                    <td className="align-middle">{r.vendorname} <small>{(r.vendorreference) ? "("+r.vendorreference+")" :null}</small></td>
                    <td className="align-middle" id={"result"+r.id}>{r.storagename}</td>
                    {(r.storagedescription) ? 
                      <UncontrolledTooltip placement="right" target={"result"+r.id}>
                      {r.storagedescription}
                    </UncontrolledTooltip>
                    :null}
                    <td className="align-middle">{r.quantity}</td>
                    <td className="align-middle"><a href={r.url}>Link</a></td>

                  </tr>
                  // # id, name, description, manufacturer, altiumfiles, datasheet, storagename, storagedescription, storageimage, vendorname, vendorreference, quantity, url
                  // '12', 'NCV5700DR2G', 'Gate Drivers HIGH CURRENT IGBT GATE DR', 'ON Semiconductor', NULL, NULL, 'Caja Pablo 2', NULL, NULL, 'Mouser', NULL, '0', 'https://www.mouser.es/ProductDetail/?qs=HXFqYaX1Q2wg2xost4dN2w%3d%3d'
                  
        })}
        </tbody>
      </Table>
      </div>
      
    );
  }
}
export default SearchStock;