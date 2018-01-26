import React, { Component } from 'react';

import ethorsejson from './ETHorse.json';
import controllerjson from './BettingControllerABI.json'
import addressjson from './Address.json';

import {ListGroup, ListGroupItem} from 'reactstrap';
import Moment from 'react-moment';
var moment = require('moment');

var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);

var bettingController = contract(controllerjson);

if(web3.currentProvider!=null)
{
  myContract.setProvider(web3.currentProvider);
}


export default class ContractSidebar extends Component {
  constructor(props)
    {
    super(props);
    this.state={timejson:[],currentTime:"Change Races",duplicatejson:{},prevActive:null,classActive:false};
    this.handleChange=this.handleChange.bind(this);
    this.initiate=this.initiate.bind(this);
    this.contractList=this.contractList.bind(this);
    }
  componentWillMount()
    {
    if(this.state.timejson.length!==addressjson.addresses.length)
      this.initiate(addressjson.addresses[0].address)
    }
  componentDidMount()
    {
    addressjson.addresses.map(row => this.getDate(row.address))
    let self=this;
    }
  componentDidUpdate(){
    // console.log('Change');
    if(this.state.classActive===false && this.state.timejson.length===addressjson.addresses.length)
    {
      document.getElementById(addressjson.addresses[0].address).classList.add('active');
    }
  }
  getDate(address)
    {
    let self=this;
    var start_time_utc = null;
    var result_time_utc=null;

    myContract.at(address).then(function(instance){
      // self.setState({contractInstance:instance})
      instance.starting_time().then(function(start_time){
        //Check if the bet has started
        start_time=parseInt(start_time,10)
            start_time_utc=new Date(start_time*1000);
            //Check if the bet has locked
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
      document.getElementById(addressjson.addresses[0].address).classList.remove('active');
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
    // console.log(this.refs[rSelected])

    // this.refs[rSelected].className="list-group-item active";
    this.props.onContractSubmit(rSelected);
  }


  render() {

    if(this.state.timejson.length===addressjson.addresses.length)
    {

      this.state.timejson.sort(function (x,y) {
        return ((x.start_time_sort === y.start_time_sort) ? 0 : ((x.start_time_sort < y.start_time_sort) ? 1 : -1 ));
      })
      let timejson=this.state.timejson;
    return (
      <div style={{ height:'100%',overflow:'scroll'}}>

          <ListGroup className="top" >
            <span style={{color:'#868e96'}}><h3>Change Race</h3></span>
          <br></br>
            {timejson.map(row =>
            <ListGroupItem tag="button" onClick={(event) => this.handleChange(event)} key={row.address} id={row.address}>
              {/* <Moment format="ddd, DD MMM YYYY, HH:SS" name={row.address}>{row.start_time.toString()}</Moment> */}
              {row.start_time.toString()}
            </ListGroupItem>
          )}
          </ListGroup>

      </div>
      )

        }
        return(<div/>)
  }
}
