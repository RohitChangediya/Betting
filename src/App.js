import React, { Component } from 'react';
import logo from './logo.svg';
import krakenjson from './KrakenTracker.json';
import './App.css';
import ETHDropdown from './ETHDropdown.js'
import Amount from './Amount.js'
import {Jumbotron, Container, Button, InputGroup, InputGroupButton, Input, Collapse, Navbar, CardFooter, NavbarBrand, Nav, NavItem, NavLink} from 'reactstrap'
var Web3 = require('web3');
var contract = require("truffle-contract");


class App extends Component {
  constructor(props)
  {
    super(props);
    this.state={contractState:null,
                contractJSON:krakenjson,
                price:null,
                invokePrice:null,
                amount:null,
                coin:null,
                value: 'value'
                };
    this.invokeContract=this.invokeContract.bind(this);

  }
  invokeContract()
    {
      var self=this;
      var web3 = new Web3(Web3.givenProvider);
      var contractDetails={"abi":[{"constant":true,"inputs":[],"name":"BTC_pre","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getVoterHorse","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ETH_post","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price_check_eth","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ETH_pre","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price_check_btc","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pointer_check","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winner_reward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"BTC_post","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winner_horse","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"betting_duration","type":"uint256"}],"name":"update","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"s","type":"string"}],"name":"stringToUintNormalize","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"horse","type":"string"}],"name":"placeBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"other_price_check","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winner_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"voter_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"suicide","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getVoterAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"winner_factor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"description","type":"string"}],"name":"newOraclizeQuery","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"price","type":"string"}],"name":"newPriceTicker","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Withdraw","type":"event"}],
      "address":"0x524487E72e0dD214dAAC9B864e0C6462F3a5290B",

    }
      var myContract = contract(contractDetails);
      myContract.setProvider(web3.currentProvider);
      /*self.setState({value:''},function()
      {
        myContract.deployed().then(function(instance) {
        //instance.newKrakenPriceTicker({}, { fromBlock: 0, toBlock: 'latest' }).get((error, results) => {console.log(results)});
        //instance.newOraclizeQuery({}, { fromBlock: 0, toBlock: 'latest' }).get((error, results) => {console.log(results)});
        var ethAccount='';
        web3.eth.getAccounts(function(err, accounts){
          ethAccount=accounts+'';
        }).then(function()
      {
        const txo = {
          from: ethAccount,
          value: web3.utils.toWei(self.state.amount),
          data:self.state.coin
      };
      instance.update(txo);

      var delayMillis=5000;
setTimeout(function() {
  //your code to be executed after 1 second
  self.setState({value:'value'});
}, delayMillis);

      });
      });
      }
    );*/
    myContract.at("0x524487E72e0dD214dAAC9B864e0C6462F3a5290B").then(function(instance){
      console.log(instance)
      var ethAccount='';
      web3.eth.getAccounts(function(err, accounts){
        ethAccount=accounts+'';
      }).then(function()
    {
      const txo = {
        from: ethAccount,
        value: web3.utils.toWei(self.state.amount),
        data:self.state.coin
    };
    instance.placeBet(self.state.coin,txo);

    /*var delayMillis=5000;
setTimeout(function() {
//your code to be executed after 1 second
self.setState({value:'value'});
}, delayMillis);*/

    });
    //instance.price_check_eth().then(function(price){
        //console.log(price);
      //})
    })

    }
  onValueSubmit(amount)
  {
    console.log('Inside onValueSubmit',amount)
    this.setState({amount:amount});
  }
  onDropdownSubmit(coin)
  {
    this.setState({coin:coin});
  }
  render() {
    /*if(this.state.invokePrice==null)
      {
        this.updateContract();
      }*/
    return (
      <div>
      <Jumbotron style={{ 'textAlign': 'center','backgroundColor': 'white' }}>
      <Container >
        <InputGroup>
        <InputGroupButton><ETHDropdown onSubmit={this.onDropdownSubmit.bind(this)}/></InputGroupButton>
        <Amount field="Amount" opt="div" onValueSubmit={this.onValueSubmit.bind(this)}/>
        <InputGroupButton><Button type="button" onClick={this.invokeContract.bind(this)} color="primary" disabled={!this.state.value} size="lg">Place bet</Button></InputGroupButton>
        </InputGroup>
      </Container>
      </Jumbotron>
      </div>
    );
  }
}

export default App;
