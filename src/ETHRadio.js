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
    var eth={pool_total:null,odds:null,number_of_bets:null,pre_price:'TBC',post_price:'TBC',gain:'TBC',name:'ethereum',percentage:'TBC'}
    var btc={pool_total:null,odds:null,number_of_bets:null,pre_price:'TBC',post_price:'TBC',gain:'TBC',name:'bitcoin',percentage:'TBC'}
    var ltc={pool_total:null,odds:null,number_of_bets:null,pre_price:'TBC',post_price:'TBC',gain:'TBC',name:'litecoin',percentage:'TBC'}
    this.state={rSelected:'',
                eth:'primary',
                btc:'primary',
                metal:'primary',
                eth_pool:eth,
                btc_pool:btc,
                ltc_pool:ltc,
                visible:false,
                contract:this.props.currentContract,
                totalAmountBet:0,
                totalCoins:0
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
        return value;
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
    // let name=this.state
    var coin_details={pool_total:web3.utils.fromWei(value[0].toString(),"ether"),pre_price:(value[1]/100),post_price:(value[2]/100),odds:(profit),number_of_bets:value[4].toString()}
    coin_details.pre_price=this.checkValue(coin_details.pre_price);
    coin_details.post_price=this.checkValue(coin_details.post_price);
    let bets=parseFloat(this.state.totalAmountBet)+parseFloat(web3.utils.fromWei(value[0].toString(),"ether"))
    bets=Math.round(bets*100)/100;
    let coins=parseInt(this.state.totalCoins)
    coins=coins+1;
    this.setState({totalAmountBet:bets,totalCoins:coins})
    // console.log(this.state.totalAmountBet)
    return coin_details;
    }
  getCoinDetails()
    {
    var self=this;
    myContract.at(this.props.currentContract).then(function(instance)
          {
          instance.reward_total().then(function(reward){
                reward=web3.utils.fromWei(reward,"ether")
                instance.getCoinIndex("ETH").then(function(value){
                  var eth=self.getOddsDetails(value,reward);
                  if(eth.pre_price!=="TBC")
                      {
                      fetch("https://api.coinmarketcap.com/v1/ticker/ethereum/")
                      .then(function(details){
                        // console.log(details.json().then());
                        return details.json().then(
                          function(value){
                            let inc=Math.round(((value[0].price_usd-eth.pre_price)/eth.pre_price)*10000)/100;
                            eth['percentage']=inc+" %";
                            if(eth["post_price"]!=="TBC")
                              {
                              inc=Math.round(((eth.post_price-eth.pre_price)/eth.pre_price)*10000)/100;
                              eth['percentage']=inc+" %";
                              eth["post_price"]="$ "+eth["post_price"];
                              }
                            eth["pre_price"]="$ "+eth["pre_price"];
                            // console.log(eth)
                            self.setState({eth_pool:eth});
                          })
                      })
                      // console.log(val)
                      }
                  else {
                    self.setState({eth_pool:eth});
                  }
                });
                instance.getCoinIndex("LTC").then(function(value){
                  var ltc=self.getOddsDetails(value,reward);
                  if(ltc.pre_price!=="TBC")
                    {
                    fetch("https://api.coinmarketcap.com/v1/ticker/litecoin/")
                    .then(function(details){
                      // console.log(details.json().then());
                      return details.json()
                        .then(function(value){
                          let inc=Math.round(((value[0].price_usd-ltc.pre_price)/ltc.pre_price)*10000)/100;
                          ltc['percentage']=inc+" %";
                          if(ltc["post_price"]!=="TBC")
                            {
                            inc=Math.round(((ltc.post_price-ltc.pre_price)/ltc.pre_price)*10000)/100;
                            ltc['percentage']=inc+" %";
                            ltc["post_price"]="$ "+ltc["post_price"];
                            }
                          ltc["pre_price"]="$ "+ltc["pre_price"];
                          // console.log(ltc)
                          self.setState({ltc_pool:ltc});
                        })
                    })
                  }
                  else{
                    self.setState({ltc_pool:ltc});
                  }
                });
                instance.getCoinIndex("BTC").then(function(value){
                  var btc=self.getOddsDetails(value,reward);
                  if(btc.pre_price!=="TBC")
                    {
                  fetch("https://api.coinmarketcap.com/v1/ticker/bitcoin/")
                  .then(function(details){
                    // console.log(details.json().then());
                    return details.json()
                    .then(function(value){
                      let inc=Math.round(((value[0].price_usd-btc.pre_price)/btc.pre_price)*10000)/100;
                      btc['percentage']=inc+" %";
                      if(btc["post_price"]!=="TBC")
                        {
                        inc=Math.round(((btc.post_price-btc.pre_price)/btc.pre_price)*10000)/100;
                        btc['percentage']=inc+" %";
                        btc["post_price"]="$ "+btc["post_price"];
                        }
                      btc["pre_price"]="$ "+btc["pre_price"];
                      // console.log(btc)
                      self.setState({btc_pool:btc});
                    })
                  })
                }
                else {
                  self.setState({btc_pool:btc});
                }
                });
              });
          });
    this.contractChange(this.props.currentContract);

    }
  handleChange(rSelected)
  {
    this.setState({ rSelected });
    this.props.onSubmit(rSelected);
    // this.props.totalBets(this.state.totalBets);
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
  contractChange(contract){
    this.setState({contract})
  }
  componentDidUpdate(){
    if(this.state.contract!==this.props.currentContract)
    {
    this.setState({totalCoins:0,totalAmountBet:0})
    this.getCoinDetails();
    }
    if(this.state.totalCoins===3)
      {
      // console.log('Accesed')
      this.props.totalBets(this.state.totalAmountBet);
      this.setState({totalCoins:4})
      }
  }
  render()
  {

    return(
      <div>
      <Table inverse striped hover size="md" className="bet-components">

        <thead>
          <tr>
            <th>Select a coin</th>
            <th><center>Pool Total (ETH)</center></th>
            <th><center>Odds (Profit for 1 ETH)</center></th>
            <th><center>Number of bets</center></th>
            <th><center>Race start price</center></th>
            <th><center>Race end price</center></th>
            <th><center>Percentage Gain</center></th>
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
            <td>{this.state.btc_pool.percentage}</td>
          </tr>
          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("ETH")} active={this.state.rSelected === "ETH"} type="radio" name={this.props.name}>ETH</Button></th>
            <td>{this.state.eth_pool.pool_total}</td>
            <td>{this.state.eth_pool.odds}</td>
            <td>{this.state.eth_pool.number_of_bets}</td>
            <td>{this.state.eth_pool.pre_price}</td>
            <td>{this.state.eth_pool.post_price}</td>
            <td>{this.state.eth_pool.percentage}</td>
          </tr>

          <tr>
            <th scope="row"> <Button className="betlist" onClick={() => this.handleChange("LTC")} active={this.state.rSelected === "LTC"} name={this.props.name}>LTC</Button></th>
            <td>{this.state.ltc_pool.pool_total}</td>
            <td>{this.state.ltc_pool.odds}</td>
            <td>{this.state.ltc_pool.number_of_bets}</td>
            <td>{this.state.ltc_pool.pre_price}</td>
            <td>{this.state.ltc_pool.post_price}</td>
            <td>{this.state.ltc_pool.percentage}</td>
          </tr>

        </tbody>

      </Table>
      </div>
    );
  }
}
