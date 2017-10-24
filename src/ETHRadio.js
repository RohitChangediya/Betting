import React from 'react';
import {  Table, Button} from 'reactstrap';
import ethorsejson from './ETHorse.json';
var Web3 = require('web3');
var contract = require("truffle-contract");
var Fraction = require('fractional').Fraction


export default class ETHRadio extends React.Component{
  constructor(props)
  {
    super(props);
    this.handleChange=this.handleChange.bind(this);
    this.getCoinDetails=this.getCoinDetails.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.checkValue=this.checkValue.bind(this);
    var eth={pool_total:null,odds:null,number_of_bets:null,pre_price:'TBC',post_price:'TBC'}
    var btc={pool_total:null,odds:null,number_of_bets:null,pre_price:'TBC',post_price:'TBC'}
    var ltc={pool_total:null,odds:null,number_of_bets:null,pre_price:'TBC',post_price:'TBC'}
    this.state={rSelected:'',
                eth:'primary',
                btc:'primary',
                metal:'primary',
                eth_pool:eth,
                btc_pool:btc,
                ltc_pool:ltc,
                visible:false
                };

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
  checkValue(value)
  {
  if(value===0)
  {
    return 'TBC';
  }
  else {
    return '$ '+value;
  }
  }
  getCoinDetails()
  {
    var self=this;
    var web3 = new Web3(Web3.givenProvider);

    var myContract = contract(ethorsejson);
    myContract.setProvider(web3.currentProvider);
    web3.eth.getBalance(ethorsejson.address).then(function(balance){
      balance=parseFloat(web3.utils.fromWei(balance.toString(),"ether"))

        myContract.at(ethorsejson.address).then(function(instance)
        {
          //getCoinIndex result is an array
          //0:pool_total 1:pre_price(Bet open price) 2:post_price(Bet closing price) 3:Bet_lock(Open price set(boolean)) 4:Number of voters of coin
          //Input parameter coin type ETH,BTC,LTC
        instance.getCoinIndex("ETH").then(function(value){
          var f = new Fraction(parseFloat(web3.utils.fromWei(value[0].toString(),"ether")),balance)
          var profit=0
          if(f.numerator>0)
            profit= Math.round((f.denominator/f.numerator)*100-100)/100;
          var eth={pool_total:web3.utils.fromWei(value[0].toString(),"ether"),pre_price:(value[1]/100),post_price:(value[2]/100),odds:(profit),number_of_bets:value[4].toString()}
          eth.pre_price=self.checkValue(eth.pre_price);
          eth.post_price=self.checkValue(eth.post_price);
          self.setState({eth_pool:eth});
        });
        instance.getCoinIndex("LTC").then(function(value){
          var f = new Fraction(parseFloat(web3.utils.fromWei(value[0].toString(),"ether")),balance)
          var profit=0
          if(f.numerator>0)
            profit= Math.round((f.denominator/f.numerator)*100-100)/100;
          var ltc={pool_total:web3.utils.fromWei(value[0].toString(),"ether"),pre_price:(value[1]/100),post_price:(value[2]/100),odds:(profit),number_of_bets:value[4].toString()}
          ltc.pre_price=self.checkValue(ltc.pre_price);
          ltc.post_price=self.checkValue(ltc.post_price);
          self.setState({ltc_pool:ltc});
        });
        instance.getCoinIndex("BTC").then(function(value){
          var f = new Fraction(parseFloat(web3.utils.fromWei(value[0].toString(),"ether")),balance)
          var profit=0
          //Math.round to round to 2 decimal place
          if(f.numerator>0)
            profit= Math.round((f.denominator/f.numerator)*100-100)/100;
          var btc={pool_total:web3.utils.fromWei(value[0].toString(),"ether"),pre_price:(value[1]/100),post_price:(value[2]/100),odds:(profit),number_of_bets:value[4].toString()}
          btc.pre_price=self.checkValue(btc.pre_price);
          btc.post_price=self.checkValue(btc.post_price);
          self.setState({btc_pool:btc});
        });
        });
      }
    )



  }
  handleChange(rSelected)
  {
    this.setState({ rSelected });
    this.props.onSubmit(rSelected);
  }
  componentWillMount()
  {
    var self=this;
    var web3 = new Web3(Web3.givenProvider);
    web3.eth.net.getNetworkType(function(err, netId){
      if(err!==null)
      {
        self.onDismiss('Error')
      }
      else
        {
          self.onDismiss('No_Error')
        }

    })
      this.getCoinDetails();

  }
  render()
  {
    return(
      <div>
      <Table bordered>

        <thead>
          <tr>
            <th>Select a coin</th>
            <th><center>Pool Total</center></th>
            <th><center>Odds(Profit per Ether)</center></th>
            <th><center>Number of bets</center></th>
            <th><center>Bet Open Price</center></th>
            <th><center>Bet Close Price</center></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("BTC")} active={this.state.rSelected === "BTC"} type="radio" name={this.props.name}>BTC</Button></th>
            <td>{this.state.btc_pool.pool_total}</td>
            <td>{this.state.btc_pool.odds}</td>
            <td>{this.state.btc_pool.number_of_bets}</td>
            <td>{this.state.btc_pool.pre_price}</td>
            <td>{this.state.btc_pool.post_price}</td>
          </tr>
          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("ETH")} active={this.state.rSelected === "ETH"} type="radio" name={this.props.name}>ETH</Button></th>
            <td>{this.state.eth_pool.pool_total}</td>
            <td>{this.state.eth_pool.odds}</td>
            <td>{this.state.eth_pool.number_of_bets}</td>
            <td>{this.state.eth_pool.pre_price}</td>
            <td>{this.state.eth_pool.post_price}</td>
          </tr>

          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("LTC")} active={this.state.rSelected === "LTC"} name={this.props.name}>LTC</Button></th>
            <td>{this.state.ltc_pool.pool_total}</td>
            <td>{this.state.ltc_pool.odds}</td>
            <td>{this.state.ltc_pool.number_of_bets}</td>
            <td>{this.state.ltc_pool.pre_price}</td>
            <td>{this.state.ltc_pool.post_price}</td>
          </tr>

        </tbody>

      </Table>
      </div>
    );
  }
}
