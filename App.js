import React, { Component } from 'react';
import ethorsejson from './ETHorse.json';
import './App.css';
import ETHRadio from './ETHRadio'
import Amount from './Amount.js'
import {Jumbotron, Container, Button, InputGroup, InputGroupButton} from 'reactstrap'
var Web3 = require('web3');
var contract = require("truffle-contract");




class App extends Component {

  constructor(props)
    {
    super(props);
    this.state={contractState:null,
                contractJSON:ethorsejson,
                price:null,
                invokePrice:null,
                amount:0.05,
                coin:null,
                value: 'value',
                transactionid:null,
                d:null,
                h:null,
                m:null,
                s:null,
                coinChoice:''
                };
    this.invokeContract=this.invokeContract.bind(this);
    this.convertMS=this.convertMS.bind(this);


    }


  componentWillMount()
    {
      /*var self=this;
      var web3 = new Web3(Web3.givenProvider);
      */
    var sec=5000000;
    this.convertMS(sec);
    }


  convertMS(ms)
    {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    this.setState({ d: d, h: h, m: m, s: s });
    }


  invokeContract()
    {
    var self=this;
    var web3 = new Web3(Web3.givenProvider);

    var myContract = contract(ethorsejson);
    myContract.setProvider(web3.currentProvider);

    myContract.at(ethorsejson.address).then(function(instance){
      var ethAccount='';
      /*instance.getUserCount("ETH").then(function(response){
        console.log(response);
      });
      instance.userCountUpdate().watch(
        function(response){
          console.log(response);
        }
      )*/
      web3.eth.getAccounts(function(err, accounts){
        ethAccount=accounts[0]
        }).then(function()
                {
                console.log(ethAccount)
                const txo = {
                  from: ethAccount,
                  value: web3.utils.toWei(self.state.amount),
                  data:self.state.coin
                };

                instance.placeBet(self.state.coin,txo).then(function(res){
                  self.setState({transactionid:res.tx});
                });
                instance.Deposit({}, {fromBlock: 0, toBlock: 'latest'}).get(function(error,result){
                console.log(result)
              });

            });
        })

    }


  onValueSubmit(amount)
    {
    this.setState({amount:amount});
    }


  coinValue(coin)
    {
    console.log(coin);
    this.setState({coin:coin});
    }

  render()
    {
    return (
            <div>
            <Jumbotron style={{ 'textAlign': 'center','backgroundColor': 'white' }}>
            <Container >
              <ETHRadio onSubmit={this.coinValue.bind(this)}/>
              <InputGroup>
              <Amount field="Amount" onValueSubmit={this.onValueSubmit.bind(this)}/>
              <InputGroupButton><Button type="button" onClick={this.invokeContract.bind(this)} color="primary" disabled={!this.state.value} size="lg">Place bet</Button></InputGroupButton>
              </InputGroup>
              <br/>
              <br/>
              <br/>
              {this.state.transactionid}
              <br/>
              <br/>
              <br/>
              {this.state.d} days, {this.state.h} hours , {this.state.m} minutes, {this.state.s} seconds left.
            </Container>
            </Jumbotron>
            </div>
            );
    }
}

export default App;
