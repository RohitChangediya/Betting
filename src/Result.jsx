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
    this.state={contract:this.props.contract,winner:"",start_time:""}
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
                    self.setState({winner:web3.utils.toAscii(winner).replace(/\u0000/g,'')})
                });
                instance.starting_time().then(function(start_time){
                  start_time=parseInt(start_time,10)
                  self.setState({start_time:(moment(parseInt(start_time,10) * 1000).format('dddd, MMM YYYY')).toString()});
                })
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
                    self.setState({winner:web3.utils.toAscii(winner).replace(/\u0000/g,'')})
                  instance.starting_time().then(function(start_time){
                    start_time=parseInt(start_time,10)
                    start_time=parseInt(start_time,10)
                    self.setState({start_time:(moment(parseInt(start_time,10) * 1000).format('dddd, MMM YYYY')).toString()});
                  })

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
              <div className="race-status-value text-center"><img alt="" src="https://png.icons8.com/windows/40/ffffff/planner.png"/>
                {this.state.start_time}</div>
        </div>
        );
    }
  }
}
