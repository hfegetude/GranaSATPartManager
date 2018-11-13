import React, { Component } from 'react';
import {Row, Col, Input, Modal,ModalHeader,ModalBody,Table ,ModalFooter,Button} from 'reactstrap';
import {getFiles,postFiles} from '../utils/apiUtilities'

import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons'

import Dropzone from 'react-dropzone'

class FilesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {  files: [],
                    uploading:false,
                    availablefiles: [] }
    this.toggle = this.props.onDone;

  }
  retrieveAvailableFiles(){
    getFiles(this.props.part.idpart).then(response =>{
      this.setState({availablefiles:response.data.results})
    })
  }
  componentDidMount(){
    this.retrieveAvailableFiles()
  }

  uploadFiles(){
    this.setState({uploading:true})
    postFiles(this.props.part.idpart,this.state.files).then(response => {
      this.setState({uploading:false,files:[]})
      this.retrieveAvailableFiles()
    })
  }

  onDrop(files) {
    this.setState({
      files: this.state.files.concat(files)
    });
  }

  onCancel() {
    this.setState({
      files: []
    });
  }
  
  render() {
    return (
      <Modal isOpen={true} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.part.name} <small>({this.props.part.vendorname})</small></ModalHeader>
          <ModalBody>

            <Table size="sm">
             <tbody>
               {this.state.availablefiles.map((e,i) => {
                return <tr key={i}>
                          <td>{moment(e.datetime).format("DD/MM/YY HH:mm")}</td>
                          <td>{e.name}</td>
                          <td><a href={"files/"+this.props.part.idpart+"/"+e.file}><FontAwesomeIcon icon={faDownload} /></a></td>
                        </tr>
               })}
              </tbody>
             </Table>

              {(this.state.uploading) ? 
                null
              : 
              <section>
              <Row>
                <Col sm="12"><Dropzone
                  className=""
                  style={{width: "100%",borderWidth: "2px",borderColor: "rgb(102, 102, 102)",borderStyle: "dashed"}}

                  onDrop={this.onDrop.bind(this)}
                  onFileDialogCancel={this.onCancel.bind(this)}>
                  <p style={{margin:"17px"}}>Drop new files here or click to select.</p>
                </Dropzone>
                </Col>
              </Row>
              <aside style={{marginTop:"17px"}}>
                <ul>
                  {
                    this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                  }
                </ul>
              </aside>
            </section>}
            
          </ModalBody>
          <ModalFooter className="d-flex justify-content-center">

          {(this.state.uploading) ? <FontAwesomeIcon icon={faSpinner} spin/> :
           <Button className="w-100" size="lg" color="success" onClick={e => this.uploadFiles()}>Upload</Button>
          }

          </ModalFooter>
        </Modal>
      
    );
  }
}

export default FilesModal;
