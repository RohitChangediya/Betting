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
                <NavLink><Button color="link" style={{textDecoration:'none', color:'black'}} onClick={this.toggle}><h5>Information</h5></Button></NavLink>
              </NavItem>
              </Nav>
          </Navbar>

        <Modal isOpen={this.state.modal} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}><h4>Information</h4></ModalHeader>
          <ModalBody>
              Bet on a cryptocurrency and win against other bettors with Ethorse Smart Contract
              <ul>
                <li>Simply choose a winner among BTC, ETH and LTC for a fixed 24 hour period.</li>
                <li>Enter the amount you are willing to bet (only Ether) from a browser with Metamask extension, Geth or Mist.</li>
                <li>A deployed open source Ethereum smart contract will control the funds, calculate the best performing Cryptocurrency (with bet open and bet close prices) and prepare reward for the winning users to collect.</li>
                <li>Parimutuel Betting: Winning pool takes everything from the total pool after a fee (5%)</li>
                <li>Price pulled from <a href="https://coinmarketcap.com/" rel="noopener noreferrer" target="_blank">Coinmarketcap.com API</a> through <a href="http://www.oraclize.it/" rel="noopener noreferrer" target="_blank">Oraclize.it</a> at the beginning and end of the bet period</li>
              </ul>
              Bet on a favorite to easily win a small payout because it only needs to beat lesser opponents. Alternatively, bet on an underdog and win a huge payout. Tip: Use the Odds.
              Questions and feedback are welcome.
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
