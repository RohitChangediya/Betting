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
            <NavbarBrand href="/"><h3 className="header-font"><img width="10%" height="auto" src={"https://ethorse.com/images/ethorse-logo.png"} alt="ETHorse icon"/>&nbsp;ethorse</h3></NavbarBrand>
              <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink><Button color="link" style={{textDecoration:'none', color:'black'}} onClick={this.toggle}><h5>Info</h5></Button></NavLink>
              </NavItem>
              </Nav>
          </Navbar>

        <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg">
          <ModalHeader toggle={this.toggle}><h4>Information</h4></ModalHeader>
          <ModalBody>
              Bet on a cryptocurrency and win against other bettors with Ethorse Smart Contract
              <ul>
                <li>Simply choose a winner among BTC, ETH and LTC for a fixed 24 hour period -09:00 Nov 5 to 09:00 Nov 6, 2017 UTC.</li>
                <li>"Place bet" after entering an amount you are willing to bet (0.1-1 Ropsten ETH) from a browser with Metamask extension, or Mist.</li>
                <li>A deployed open source Ethereum smart contract will control the funds, calculate the best performing Cryptocurrency (with displayed bet lock and bet close prices from Coinmarketcap API) and prepare reward for the winning users to collect WITHOUT OUR INPUT or CONTROL</li>
                <li>Parimutuel Betting: Winner takes all (Ethorse takeout 5%)</li>
                <li>Price pulled from <a href="https://coinmarketcap.com/api/" rel="noopener noreferrer" target="_blank">Coinmarketcap.com API</a> through <a href="http://www.oraclize.it/" rel="noopener noreferrer" target="_blank">Oraclize.it</a> at the beginning and end of the bet period</li>
                <li>After bet closes, click “Check result” to see your winnings and “Claim” to submit a 0 ETH transaction that in turn sends your winnings.</li>
              </ul>
              Bet on a favorite to easily win a small payout because it only needs to beat lesser opponents. Alternatively, bet on an underdog and win a huge payout. Tip: Use the Odds.
              Questions and feedback are welcome.
              <br/>
              Link to open source smart contract code: <a href={address_link} rel="noopener noreferrer" target="_blank">{ethorsejson.address}</a>
              <br/>
              Reddit Link: <a href="https://www.reddit.com/r/Ethorse/" rel="noopener noreferrer" target="_blank">https://www.reddit.com/r/Ethorse/</a>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Ok</Button>
          </ModalFooter>
        </Modal>
        </div>
      );
    }
}
