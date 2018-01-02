import React, { Component } from 'react';

import ethorsejson from './ETHorse.json';



var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);

if(web3.currentProvider!=null)
{
  myContract.setProvider(web3.currentProvider);
}

export default class Result extends Component{
  constructor(props){
    super(props);
    this.state={contract:this.props.contract,winner:""}
  this.checkWinner=this.checkWinner.bind(this);

  }
  checkWinner()
  {
     let self=this;
    myContract.at(this.props.contract).then(function(instance)
          {
            instance.race_end().then(function(state){
              if(state===false)
              {
              self.setState({winner:""})
              }
              else{
                instance.winner_horse().then(function(winner){
                    self.setState({winner:web3.utils.toAscii(winner)})
                });
              }
            });
          });
  }
  componentWillMount()
  {
    this.checkWinner();
  }
  componentDidUpdate()
  {
    if(this.props.contract!==this.state.contract)
    {
      let self=this;
    myContract.at(this.props.contract).then(function(instance)
          {
            instance.race_end().then(function(state){
              if(state===false)
              {
              self.setState({winner:""})
              }
              else{
                instance.winner_horse().then(function(winner){
                    self.setState({winner:web3.utils.toAscii(winner)})
                });
              }
            });

          });
    this.setState({contract:this.props.contract})
    }
  }
  render()
  {
    if(this.state.winner==="")
    return(
      <span style={{position:'relative',fontSize:'30px'}} className="float-left">
          Live&nbsp;
        <sup ><i className="fa fa-circle" aria-hidden="true" style={{"color":"green","fontSize":"15px"}}></i></sup>
      </span>
    );
    else {
      return(<span style={{fontSize:'30px','position':'relative'}} className="float-left"><span style={{"font-size":"30px"}}>The winner is {this.state.winner}</span></span>);
    }
  }
}
