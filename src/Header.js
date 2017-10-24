import {Navbar,  NavbarBrand, Nav, NavLink, NavItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import ethorsejson from './ETHorse.json';
import {makeHref} from 'react-router';




export default class Header extends Component {

    constructor(props) {
      super(props);
      this.state = {
        modal: false
      };

      this.toggle = this.toggle.bind(this);
    }

    toggle() {
      this.setState({
        modal: !this.state.modal
      });
    }
    componentWillMount()
    {
      var val=localStorage.getItem('accessed');
      if(val==null)
      {
      localStorage.setItem('accessed',true);
      this.setState({modal:true})
      }

    }
    render()
    {
      var address_link="https://kovan.etherscan.io/address/"+ethorsejson.address;
      return(
        <div>
          <Navbar light expand="md">
            <NavbarBrand href="/"><h3>Ethorse</h3></NavbarBrand>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink>
                    <Button color="link"><a href={address_link} rel="noopener noreferrer" target="_blank">{ethorsejson.address}</a></Button>
                  </NavLink>
                </NavItem>
              <NavItem>
                <NavLink><Button color="link" onClick={this.toggle}>Information</Button></NavLink>
              </NavItem>
              </Nav>
          </Navbar>

        <Modal isOpen={this.state.modal} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Information</ModalHeader>
          <ModalBody>
              Bet on a coin and win against other bettors with ETHORSE Smart Contract
              <ul>
                <li>Simply choose a winner for the next three days among BTC, ETH and LTC.</li>
                <li>Enter the amount you are willing to bet (only Ether) from a browser with Metamask extension, Geth or Mist.</li>
                <li>An open source Ethereum smart contract will control the funds and settle payout automatically. We never have control to your funds.</li>
                <li>Winning pool takes everything from total pool after fee (15%)</li>
                <li>Price pulled from Coinmarketcap.com API through Oraclize.it at the beginning and end of the bet period</li>
                <li>Maximum bet amount 1 ETH and minimum 0.1 ETH Questions and Feedback welcome</li>
              </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Ok</Button>
          </ModalFooter>
        </Modal>
        </div>
      );
    }
}
