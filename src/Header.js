import {Navbar,  NavbarBrand, Nav, NavLink, NavItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import ethorsejson from './ETHorse.json';





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
      var address_link="https://ropsten.etherscan.io/address/"+ethorsejson.address+"#code";
      return(
        <div>
          <Navbar light expand="md">
            <NavbarBrand href="/"><h3 className="header-font"><img width="10%" height="auto" src={"https://raw.githubusercontent.com/ethorse/Betting/gh-pages/horse.ico"} alt="ETHorse icon"/>&nbsp;ethorse</h3></NavbarBrand>
              <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink><Button color="link" style={{textDecoration:'none'}} onClick={this.toggle}><h4>Information</h4></Button></NavLink>
              </NavItem>
              </Nav>
          </Navbar>

        <Modal isOpen={this.state.modal} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}><h4>Information</h4></ModalHeader>
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
              Link to open source smart contract code: <a href={address_link} rel="noopener noreferrer" target="_blank">{ethorsejson.address}</a>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Ok</Button>
          </ModalFooter>
        </Modal>
        </div>
      );
    }
}
