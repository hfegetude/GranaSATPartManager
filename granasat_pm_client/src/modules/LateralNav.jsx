import React , { Component } from 'react';
import { SideNav, Nav } from 'react-sidenav' ;
import {FaWrench, FaUsers, FaMicrochip, FaSearch} from 'react-icons/fa';

 
const navStyle ={
    background: "#303641",
    color: "#8d97ad",
    fontSize: "1em",
    letterSpacing: "2px",
    width: "240px",
    height:"100vh",
    lineHeight: "22px"
}

const navEntryStyle={
    fontWeight: "bold",
    fontSize: "1.2em"
}
const theme = {
    selectionColor: "#C51162",
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
  };
const titleStyle= {
    textAlign: "center"
}
class LateralNav extends Component {
    constructor(props) {
        super(props);
    }
    render() {
 
        return (
            <div  style={navStyle}>
                <h2 style={titleStyle}>Home</h2>
                <SideNav    defaultSelectedPath="1" 
                            onItemSelection={this.props.onItemSelection}
                            theme={theme}>
                    <Nav id="searchpart" style={navEntryStyle} >
                        <FaSearch></FaSearch> &emsp; Search part
                    </Nav>
                    <Nav id="addpart" style={navEntryStyle}>
                        <FaMicrochip></FaMicrochip> &emsp; Add part
                    </Nav>
                    <Nav id="groups" style={navEntryStyle} >
                        <FaUsers></FaUsers> &emsp; Groups
                    </Nav>
                    <Nav id="admin" style={navEntryStyle}>
                        <FaWrench></FaWrench> &emsp; Admin 
                    </Nav>
                </SideNav>
            </div>
        )
    }
}
export default LateralNav