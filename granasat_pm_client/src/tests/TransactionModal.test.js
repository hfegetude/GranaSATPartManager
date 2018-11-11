import React from 'react'
import TransactionModal from '../modules/TransactionModal'
import { Input, Modal,ModalHeader,ModalBody,ModalFooter,Button,ButtonGroup } from 'reactstrap';
import "../setupTests"
import { shallow } from 'enzyme';

describe("<TransactionModal />", ()=>{
  it('Renders part name and vendor name',() => {
    const testStock = {
      name: "Test Name",
      vendorname: "Test Vendor",
    }
    const wrapper = shallow(<TransactionModal stock={testStock} />);
    expect(wrapper.find(ModalHeader).shallow().text())
                  .toEqual(testStock.name+' ('+testStock.vendorname+')')
  });
  it('Saves input quatity', ()=>{
    const inputValue = 12;
    const testStock = {
      name: "Test Name",
      vendorname: "Test Vendor",
    }
    const wrapper = shallow(<TransactionModal stock={testStock} />);
    wrapper.find(Input).simulate('change', {target: {value: inputValue}});
    expect(wrapper.instance().state.quantity).toEqual(inputValue)
  });
});
