import React from 'react';
import { SideNav, Nav } from 'react-sidenav' ;
import {FaWrench, FaUsers, FaMicrochip, FaSearch} from 'react-icons/fa';
 const titleStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px',
    fontSize: "1.5em"
 }
 
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
export default class Home extends React.Component {
    state = { selectedPath: '' }
 
    onItemSelection = (arg) => {
        this.setState({ selectedPath: arg.path })
    }
 
    render() {
 
        return (
            <div style={navStyle}>
                <SideNav defaultSelectedPath="1">
                    <Nav style={titleStyle}> Home </Nav>
                    <Nav id="1" style={navEntryStyle}>
                        <FaSearch></FaSearch> &emsp; Search part
                    </Nav>
                    <Nav id="2" style={navEntryStyle}>
                        <FaMicrochip></FaMicrochip> &emsp; Add part
                    </Nav>
                    <Nav id="3" style={navEntryStyle} >
                        <FaUsers></FaUsers> &emsp; Groups
                    </Nav>
                    <Nav id="4" style={navEntryStyle}>
                        <FaWrench></FaWrench> &emsp; Admin 
                    </Nav>
                </SideNav>
            </div>
            
        
        )
    }
}
