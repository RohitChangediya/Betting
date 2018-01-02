import React, { Component } from 'react';
import {DropdownToggle,
  DropdownMenu,
  DropdownItem,
UncontrolledDropdown,  Button } from 'reactstrap';
import ethorsejson from './ETHorse.json';
import addressjson from './Address.json'

var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);

if(web3.currentProvider!=null)
{
  myContract.setProvider(web3.currentProvider);
}


export default class Contract extends Component{
  constructor(props){
    super(props);
    this.state={timejson:[]}
    this.handleChange=this.handleChange.bind(this);
    this.getDate=this.getDate.bind(this)

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
                  var temp_json={"address":address,"start_time":start_time_utc.toString(),"end_time":result_time_utc.toString()}
                  self.state.timejson.push(temp_json)
                })
      })
    })


  }
  componentDidMount()
  {
    {addressjson.addresses.map(row => this.getDate(row.address))}
  }
  handleChange(rSelected)
  {
    console.log(rSelected,' ',addressjson.addresses[0].address)
    // this.setState({ rSelected });
     this.props.onContractSubmit(rSelected);
  }
  render()
  {
    if(this.state.timejson.length===addressjson.addresses.length)
    {
      let timejson=this.state.timejson;

      return(
        <UncontrolledDropdown className="dropdown-controller float-right" style={{'position': 'relative', 'right': '0', 'fontSize':'20px' }}>
                  <Button>
                    <DropdownToggle nav caret style={{'color':'white','textDecoration':'none'}}>
                      View Races
                    </DropdownToggle>
                  </Button>
                  <DropdownMenu className="contract" right>
                    {timejson.map(row =>
                    <DropdownItem onClick={() => this.handleChange(row.address)} key={row.address}>

                      {row.start_time}
                    </DropdownItem>
                  )}

                  </DropdownMenu>
                </UncontrolledDropdown>
      );



    }
    return(<div/>)

  }
}
