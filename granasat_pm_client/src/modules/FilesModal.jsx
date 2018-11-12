import React, { Component } from 'react';
import {Input, Modal,ModalHeader,ModalBody,Table ,ModalFooter,Button} from 'reactstrap';
import {postFiles} from '../utils/apiUtilities'

import Dropzone from 'react-dropzone'

class FilesModal extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] }
  
  }

  uploadFiles(){
    postFiles(this.props.part.idpart,this.state.files).then(response => {
      console.log(response)
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
          {/* <ModalHeader toggle={this.toggle}>{this.props.stock.name} <small>({this.props.stock.vendorname})</small></ModalHeader> */}
          <ModalBody>
            <section>
              <div>
                <Dropzone
                  onDrop={this.onDrop.bind(this)}
                  onFileDialogCancel={this.onCancel.bind(this)}>

                  <p>Try dropping some files here, or click to select files to upload.</p>
                </Dropzone>
              </div>
              <aside>
                <h2>Dropped files</h2>
                <ul>
                  {
                    this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                  }
                </ul>
              </aside>
            </section>
          </ModalBody>
          <ModalFooter className="d-flex justify-content-center">
              <Button style={this.buttonStyle} className="w-100" size="lg" color="danger" onClick={e => this.uploadFiles()}>Upload</Button>
          </ModalFooter>
        </Modal>
      
    );
  }
}

export default FilesModal;
