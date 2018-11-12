import React from 'react'
import PartSearchBar from '../modules/PartSearchBar'
import "../setupTests"
import { shallow } from 'enzyme';

describe("<PartSearchBar />", ()=>{
  it('Renders part name and vendor name',() => {
    const data = Array.apply(null, {length: 20}).map(()=>{
      return {  name:"a",
                description:"a",
                manufacturer:"a"
              };
    })
    const wrapper = shallow(<PartSearchBar />);
    wrapper.instance().state.searchName = "AA"
    wrapper.instance().state.nameCoincidences = data;
    wrapper.setProps({}) //update
    wrapper.find('p').forEach((p)=>{
      expect(p.shallow().text()).toEqual("a a a")
    })
    //console.log(wrapper.debug())



  });

});
