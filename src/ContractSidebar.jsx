import React, { Component } from 'react';

import ethorsejson from './ETHorse.json';
import addressjson from './Address.json';
import WeekList from './WeekList'
import {Accordion} from 'semantic-ui-react'

var moment = require('moment');

var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);


if(web3.currentProvider!=null)
{
  myContract.setProvider(web3.currentProvider);
}


export default class ContractSidebar extends Component {
  constructor(props)
    {
    super(props);
    this.state={timejson:[],currentTime:"Change Races",duplicatejson:{},prevActive:null,classActive:false,activeIndex:0};
    this.handleChange=this.handleChange.bind(this);
    // this.initiate=this.initiate.bind(this);
    this.updateContract=this.updateContract.bind(this);
    }
  // componentWillMount()
  //   {
  //   if(this.state.timejson.length!==addressjson.addresses.length)
  //     this.initiate(addressjson.addresses[0].address)
  //   }
  componentDidMount()
    {
    addressjson.addresses.map(row => this.getDate(row.address))
    }
  componentDidUpdate()
    {
    if(this.state.classActive===false && this.state.timejson.length===addressjson.addresses.length)
      {
      // document.getElementById(addressjson.addresses[0].address).classList.add('active');
      }
    }


  getDate(address)
    {
    let self=this;
    var start_time_utc = null;
    var result_time_utc=null;

    myContract.at(address).then(function(instance){
      instance.starting_time().then(function(start_time){
        start_time=parseInt(start_time,10)
            start_time_utc=new Date(start_time*1000);
                instance.race_duration().then(function(race_duration){
                  race_duration=parseInt(race_duration,10)
                  result_time_utc=new Date((start_time+race_duration)*1000)
                  let start_time_utc_display=moment(start_time_utc).format('ddd, DD MMM YYYY, HH:SS')
                  var temp_json={"address":address,"start_time":start_time_utc_display,"start_time_sort":start_time_utc,"end_time":result_time_utc}
                  self.state.timejson.push(temp_json)
                  self.state.duplicatejson[address]=start_time_utc.toString()
                })
        if(address===addressjson.addresses[0].address)
        {
          self.setState({ currentTime:start_time_utc.toString() });
        }
      })
    })
    }

  handleChange(event)
  {
    if(this.state.prevActive!=null)
      {
      this.state.prevActive.className="list-group-item";
      }
    if(this.state.classActive===false)
    {
      // document.getElementById(addressjson.addresses[0].address).classList.remove('active');
      this.setState({classActive:true});
    }
    // console.log(this.state.prevActive);
    // console.log('Event:',event.target);
    // console.log('Event Name:',event.target.name);
    this.setState({prevActive:event.target});
    event.target.className="list-group-item active";
    this.setState({ currentTime:this.state.duplicatejson[event.target.id] });
     this.props.onContractSubmit(event.target.id);
  }

  initiate(rSelected)
  {
    this.props.onContractSubmit(rSelected);
  }

  updateContract(contract)
  {
      console.log('Contract')
      console.log(contract);
  }


  render() {


    return (
      <div style={{ height:'100%',overflow:'scroll'}}>
          <span style={{color:'#868e96'}}><h3>Change Race</h3></span>
          <Accordion style={{ marginTop:'20%'}}>
              <WeekList title="Week 1" number={0} date={parseInt((new Date).getTime()/1000)} contractUpdate={(event) => this.handleChange(event)} parentState={this} initiate={this.initiate.bind(this)}/>
              <WeekList title="Week 2" number={1} date={parseInt((new Date).getTime()/1000)-604800} contractUpdate={(event) => this.handleChange(event)} parentState={this}/>
              <WeekList title="Week 3" number={2} date={parseInt((new Date).getTime()/1000)-604800*2} contractUpdate={(event) => this.handleChange(event)} parentState={this}/>
              <WeekList title="Week 4" number={3} date={parseInt((new Date).getTime()/1000)-604800*3} contractUpdate={(event) => this.handleChange(event)} parentState={this}/>
          </Accordion>
      </div>
      )

  }
}
