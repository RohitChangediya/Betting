import React, { Component } from 'react';

import { Sidebar, Segment, Button, Menu, Image, Icon, Header, List } from 'semantic-ui-react'
import ethorsejson from './ETHorse.json';
import addressjson from './Address.json';
import {ListGroup, ListGroupItem} from 'reactstrap';

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
    this.state={timejson:[],currentTime:"Change Races",duplicatejson:{},visible: true};
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(rSelected)
  {

    // console.log(rSelected);
    this.setState({ currentTime:this.state.duplicatejson[rSelected] });
     this.props.onContractSubmit(rSelected);
  }

  componentWillMount()
  {
    if(this.state.timejson.length!==addressjson.addresses.length)
      this.handleChange(addressjson.addresses[0].address)

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
                  var temp_json={"address":address,"start_time":start_time_utc,"end_time":result_time_utc}
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

  componentDidMount()
  {

    addressjson.addresses.map(row => this.getDate(row.address))
    let self=this;

//     setTimeout(function(){
//       self.state.timejson.sort(function (x,y) {
//         return ((x.start_time === y.start_time) ? 0 : ((x.start_time < y.start_time) ? 1 : -1 ));
//       })
//
//
//       // self.setState({'timejson':res})
// },3000)

  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  render() {
    if(this.state.timejson.length===addressjson.addresses.length)
    {
      this.state.timejson.sort(function (x,y) {
        console.log("sort");
        return ((x.start_time === y.start_time) ? 0 : ((x.start_time < y.start_time) ? 1 : -1 ));
      })
      let timejson=this.state.timejson;
    return (
      <div>

          <ListGroup className="top" striped>
            {timejson.map(row =>
            <ListGroupItem tag="button" onClick={() => this.handleChange(row.address)} key={row.address} name={row.address}>

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
