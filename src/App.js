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
                amount:0.1,
                coin:null,
                value: null,
                transactionid:null,
                d:null,
                h:null,
                m:null,
                s:null,
                coinChoice:'',
                coinChosen:false,
                reward:'',
                stopTime:1509007840000,
                resultTime:null,
                timeInterval:null,
                clearTimeInterval:null,
                resultTimeInterval:null,
                claim:false
                };
    this.invokeContract=this.invokeContract.bind(this);
    this.convertMS=this.convertMS.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.checkRewards=this.checkRewards.bind(this);
    this.claim=this.claim.bind(this);
    this.findTime=this.findTime.bind(this);
    this.resetTimer=this.resetTimer.bind(this);
    this.findResultTime=this.findResultTime.bind(this);
    }

  findTime()
    {
    var milliseconds = (new Date()).getTime();
    this.convertMS(this.state.stopTime-milliseconds);
    }
  resetTimer()
    {
      var milliseconds = (new Date()).getTime();
      if(parseInt(this.state.stopTime-milliseconds,10)<=0)
        {
        var new_time=this.state.stopTime+86400000;
        clearInterval(this.state.timeInterval)
        clearInterval(this.state.clearTimeInterval)
        this.setState({stopTime:new_time});
        }
    }
  findResultTime()
    {
      var milliseconds = (new Date()).getTime();
      this.convertMS(this.state.resultTime-milliseconds);
    }
  componentWillMount()
    {
      //var ft = setInterval(this.findTime, 1000)
      //var ct =setInterval(this.resetTimer, 10000)
      var rt = setInterval(this.findResultTime,950)
      var resultTime = new Date()
      if(resultTime.getHours()>=5)
        resultTime.setDate(new Date().getDate()+1)
      resultTime.setHours(5);
      resultTime.setMinutes(0);
      resultTime.setSeconds(0);
      var stopTime = new Date();
      if(stopTime.getHours()>=17)
        stopTime.setDate(new Date().getDate()+1)
      stopTime.setHours(17)
      stopTime.setMinutes(0);
      stopTime.setSeconds(0);
      var self=this;
      myContract.at(ethorsejson.address).then(function(instance){
        instance.race_end().then(function(state){
            self.setState({claim:state})
        })
      })
      //this.setState({timeInterval:ft,clearTimeInterval:ct,stopTime:Date.parse(stopTime),resultTime:resultTime,resultTimeInterval:rt})
      this.setState({stopTime:Date.parse(stopTime),resultTime:resultTime,resultTimeInterval:rt})
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
    if(this.state.amount<0.1)
    {
      alert('Please bet a larger amount');
      return;
    }
    else if(this.state.amount>1)
    {
      alert('Please bet a smaller amount');
      return;
    }
    var self=this;
    this.setState({value:null},function(){
      myContract.at(ethorsejson.address).then(function(instance){
        var ethAccount='';
        web3.eth.getAccounts(function(err, accounts){
          ethAccount=accounts[0]
          }).then(function()
                  {
                    instance.race_end().then(function(state){
                        if(state===false)
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

                              self.setState({transactionid:('Transaction ID: '+res.tx),value:self.state.coin});
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
                        }
                    })

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
      var self=this;
      myContract.at(ethorsejson.address).then(function(instance){
        instance.race_end().then(function(state){
          if(state===false)
          {
          self.setState({coin:coin,value:coin});
          }
        });
      })
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
              reward='You have won '+web3.utils.fromWei(reward,"ether")+' ETH';

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

                  });
              })

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
              <Button type="button"  color="info" size="lg" onClick={this.checkRewards} disabled={!this.state.claim}>Check result</Button>
              </InputGroupButton>
              <Input disabled={true} value={this.state.reward}/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="button" size="lg" onClick={this.claim} id="claim" disabled={!this.state.claim}>Claim</Button>
              </InputGroup>
              <AlertMsg visible={this.state.coinChosen} onSubmit={this.onDismiss} msg='Please choose a coin'/>
              <br/>
              <br/>
              {this.state.transactionid}
              <br/>
              <br/>
              <br/>
              Result in {this.state.d} days, {this.state.h} hours , {this.state.m} minutes, {this.state.s} seconds.
            </Container>
            </Jumbotron>
            </div>
            );
    }
}

export default App;
