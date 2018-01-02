import React, { Component } from 'react';

import ethorsejson from './ETHorse.json';
import {Card} from 'reactstrap' ;


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
    this.state={timejson:[]}
  this.checkWinner=this.checkWinner.bind(this);

  }
  checkWinner()
  {
    // let self=this;
  }
  render()
  {
    return(
      <span style={{position:'relative',fontSize:'20px'}} className="float-left">
          Live&nbsp;
        <i class="fa fa-circle" aria-hidden="true" style={{"color":"green"}}></i>
      </span>
    );
  }
}
