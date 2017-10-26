import React, { Component } from 'react';
import ethorsejson from './ETHorse.json';
import AlertMsg from './AlertMsg'
import './App.css';
import ETHRadio from './ETHRadio'
import Amount from './Amount.js'
import {Jumbotron, Container, Button, InputGroup, InputGroupButton, InputGroupAddon, Input} from 'reactstrap'
var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);
myContract.setProvider(web3.currentProvider);

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
                value: null,
                transactionid:null,
                d:null,
                h:null,
                m:null,
                s:null,
                coinChoice:'',
                coinChosen:false,
                reward:0
                };
    this.invokeContract=this.invokeContract.bind(this);
    this.convertMS=this.convertMS.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.checkRewards=this.checkRewards.bind(this);
    this.claim=this.claim.bind(this);
    }


  componentWillMount()
    {
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
    this.setState({value:null},function(){
      myContract.at(ethorsejson.address).then(function(instance){
        var ethAccount='';
        web3.eth.getAccounts(function(err, accounts){
          ethAccount=accounts[0]
          }).then(function()
                  {
                  const txo = {
                    from: ethAccount,
                    value: web3.utils.toWei(self.state.amount),
                    data:self.state.coin
                  };
                  if(txo.data!==null)
                    {
                    self.setState({transactionid:'Placing Bet...'},function(){
                    instance.placeBet(self.state.coin,txo).then(function(res,error){
                      console.log(res)
                      self.setState({transactionid:res.tx,value:self.state.coin});
                    }).catch(function(e){
                      if(e.message==="MetaMask Tx Signature: User denied transaction signature.")
                      {
                        self.setState({value:null,transactionid:null})

                      }
                    })})
                    }
                  else
                    {
                      self.setState({coinChosen:true});
                    }
                  /*instance.Deposit({}, {fromBlock: 0, toBlock: 'latest'}).get(function(error,result){
                  //console.log(result)
                });*/

              });
          })
    })


    }


  onValueSubmit(amount)
    {
    this.setState({amount:amount});
    }


  coinValue(coin)
    {
    this.setState({coin:coin,value:coin});
    }

  onDismiss(err) {
      if(err==="Error")
        {
        this.setState({ visible: true });
        }
      else {
        this.setState({ visible: false });
      }
    }

  checkRewards()
    {
    var self=this;
    myContract.at(ethorsejson.address).then(function(instance)
          {
            var ethAccount;
            web3.eth.getAccounts(function(err, accounts){
              ethAccount=accounts[0]
            }).then(function(){
                const txo = {
                  from: ethAccount
                };
            instance.check_reward.call(txo).then(function(reward)
              {
              reward=web3.utils.fromWei(reward,"ether");
              self.setState({reward});
              });
              });
        });
    }
  claim()
    {

    myContract.at(ethorsejson.address).then(function(instance)
          {

            var ethAccount;
            web3.eth.getAccounts(function(err, accounts){
              ethAccount=accounts[0]
            }).then(function(){
              const txo = {
                from: ethAccount
              };
                instance.claim_reward.estimateGas(txo).then(function(gas)
              {
                txo.gas=gas;
                instance.claim_reward(txo).then(function(res,error)
                  {
                    console.log(res,error)
                  });
              })

                /**/

              });

          });
    }
  render()
    {
    return (
            <div>
            <Jumbotron style={{ 'textAlign': 'center'}} fluid>
            <Container>
              <ETHRadio onSubmit={this.coinValue.bind(this)} name="Radio"/>
              <InputGroup>
                <InputGroupAddon>&Xi;</InputGroupAddon>
                <Amount field="Amount" onValueSubmit={this.onValueSubmit.bind(this)}/>
                <InputGroupButton>
                <Button type="button" onClick={this.invokeContract.bind(this)} color="primary" disabled={!this.state.value} size="lg">Place bet</Button>
                </InputGroupButton>
              </InputGroup>
              <br/>
              <InputGroup >
              <InputGroupButton>
              <Button type="button"  color="info" size="lg" onClick={this.checkRewards}>Check result</Button>
              </InputGroupButton>
              <Input disabled={true} value={this.state.reward}/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="button"  color="danger" size="lg" onClick={this.claim}>Claim</Button>
              </InputGroup>
              <AlertMsg visible={this.state.coinChosen} onSubmit={this.onDismiss} msg='Please choose a coin'/>
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
