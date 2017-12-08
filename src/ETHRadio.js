import React from 'react';
import {  Table, Button} from 'reactstrap';
import ethorsejson from './ETHorse.json';
var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);
var myContract = contract(ethorsejson);
if(web3.currentProvider!=null)
{
  myContract.setProvider(web3.currentProvider);
}





export default class ETHRadio extends React.Component{
  constructor(props)
  {
    super(props);
    this.handleChange=this.handleChange.bind(this);
    this.getCoinDetails=this.getCoinDetails.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.checkValue=this.checkValue.bind(this);
    this.getOddsDetails=this.getOddsDetails.bind(this);
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
  onDismiss(err)
    {
    if(err==="Error")
      {
      this.setState({ visible: true });
      }
    else
      {
      this.setState({ visible: false });
      }
    }
  checkValue(value)
    {
    if(value===0)
      {
        return 'TBC';
      }
      else
        {
        return '$ '+value;
        }
    }
  getOddsDetails(value,reward)
    {
    //getCoinIndex result is an array
    //0:pool_total 1:pre_price(Bet open price) 2:post_price(Bet closing price) 3:Bet_lock(Open price set(boolean)) 4:Number of voters of coin
    //Input parameter coin type ETH,BTC,LTC
    var profit=0
    var coin_bet=parseFloat(web3.utils.fromWei(value[0],"ether"))
    if(coin_bet>0)
      profit= Math.round((reward/coin_bet)*100-100)/100;
    var coin_details={pool_total:web3.utils.fromWei(value[0].toString(),"ether"),pre_price:(value[1]/100),post_price:(value[2]/100),odds:(profit),number_of_bets:value[4].toString()}
    coin_details.pre_price=this.checkValue(coin_details.pre_price);
    coin_details.post_price=this.checkValue(coin_details.post_price);
    return coin_details;
    }
  getCoinDetails()
    {
    var self=this;
    myContract.at(ethorsejson.address).then(function(instance)
          {
          instance.reward_total().then(function(reward){
                reward=web3.utils.fromWei(reward,"ether")
                instance.getCoinIndex("ETH").then(function(value){
                  var eth=self.getOddsDetails(value,reward);
                  self.setState({eth_pool:eth});
                });
                instance.getCoinIndex("LTC").then(function(value){
                  var ltc=self.getOddsDetails(value,reward);
                  self.setState({ltc_pool:ltc});
                });
                instance.getCoinIndex("BTC").then(function(value){
                  var btc=self.getOddsDetails(value,reward);
                  self.setState({btc_pool:btc});
                });
              });
          });

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
      <Table inverse striped hover size="md">

        <thead>
          <tr>
            <th>Select a coin</th>
            <th><center>Pool Total</center></th>
            <th><center>Odds(Profit for 1 ETH)</center></th>
            <th><center>Number of bets</center></th>
            <th><center>Bet Lock Price</center></th>
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
