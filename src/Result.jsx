import React, { Component } from 'react';
import ethorsejson from './ETHorse.json';

var Web3 = require('web3');
var contract = require("truffle-contract");
var moment = require('moment');
var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);

if(web3.currentProvider!=null)
{
  myContract.setProvider(web3.currentProvider);
}

export default class Result extends Component{
  constructor(props){
    super(props);
    this.state={contract:this.props.contract,winner:"",start_time:"",coinList:ethorsejson.coinList}
  this.checkWinner=this.checkWinner.bind(this);

  }

  componentDidMount()
  {
      for(let i=0;i<ethorsejson.coinList.length;i++){
          this.checkWinner(ethorsejson.coinList[i]);
      }
  }
  checkWinner(coin){
    let self=this;
    myContract.at(this.props.contract).then(function(instance){

        instance.winner_horse(coin).then(function(winner){
        let starting_time=parseInt(self.props.starting_time,10)
        if(winner)
            self.setState({winner:coin,start_time:(moment(parseInt(starting_time,10) * 1000).format('dddd, MMM YYYY')).toString()})
        });
    });
  }
  componentDidUpdate(){
      // this.checkWinner();
    if(this.props.contract!==this.state.contract || this.props.race_end!==this.state.race_end){
        if(this.props.race_end===false){
            this.setState({winner:""})
            }
        else{
            for(let i=0;i<ethorsejson.coinList.length;i++){
                this.checkWinner(ethorsejson.coinList[i]);
        }
    }
    this.setState({contract:this.props.contract,race_end:this.props.race_end})
    }
  }
  render()
  {
    if(this.state.winner==="")
    return(
        <div className="race_status header-item col-sm-4 col-md-4 col-lg-4">
            <img alt="" className="header-item-img" src={require("./assets/Orion_flag.png")}/>
            <div className="header-item-title text-center">Race Status</div>
            <div className="race-status-value text-center"><i className="fa fa-circle" aria-hidden="true"></i> Live</div>
        </div>
    );
    else {
      return(
          <div className="race_status header-item col-sm-4 col-md-4 col-lg-4">
              <img alt="" className="header-item-img" src={require("./assets/Orion_flag.png")}/>
              <div className="header-item-title text-center">Race Status</div>
              <div className="race-status-value text-center"><img alt="" src="https://png.icons8.com/ios-glyphs/40/ffffff/trophy.png"/>
                {this.state.winner}</div>
        </div>
        );
    }
  }
}
