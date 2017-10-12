import {Jumbotron, Container, Button, InputGroup, InputGroupButton, Input, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap'
import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


export default class Header extends Component {
    render()
    {
      return(
        <div>
          <nav>
          <Navbar light expand="md">
            <NavbarBrand href="/"><h3>Ethorse</h3></NavbarBrand>
              <Nav className="ml-auto" navbar>
              </Nav>
          </Navbar>
          </nav>
        </div>
      );
    }
}
