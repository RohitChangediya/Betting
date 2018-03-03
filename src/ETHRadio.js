import React from 'react';
import ethorsejson from './ETHorse.json';
var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);
if (web3.currentProvider != null) {
    myContract.setProvider(web3.currentProvider);
}

export default class ETHRadio extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.getCoinDetails = this.getCoinDetails.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.checkValue = this.checkValue.bind(this);
        this.getOddsDetails = this.getOddsDetails.bind(this);
        this.coinRadio=this.coinRadio.bind(this);
        var eth = {pool_total: null,odds: null,number_of_bets: null,pre_price: 'TBC',post_price: 'TBC',gain: 'TBC',name: 'ethereum',percentage: 'TBC',post_price_title:'Current Price'}
        var btc = {pool_total: null,odds: null,number_of_bets: null,pre_price: 'TBC',post_price: 'TBC',gain: 'TBC',name: 'bitcoin',percentage: 'TBC',post_price_title:'Current Price'}
        var ltc = {pool_total: null,odds: null,number_of_bets: null,pre_price: 'TBC',post_price: 'TBC',gain: 'TBC',name: 'litecoin',percentage: 'TBC',post_price_title:'Current Price'}
        this.state = {
            rSelected: '',
            eth: 'primary',
            btc: 'primary',
            metal: 'primary',
            eth_pool: eth,
            btc_pool: btc,
            ltc_pool: ltc,
            visible: false,
            contract: this.props.currentContract,
            totalAmountBet: 0,
            totalCoins: 0,
            ethHTML: '<i class="fa fa-circle-o" aria-hidden="true"></i>',
            btcHTML: '<i class="fa fa-circle-o" aria-hidden="true"></i>',
            ltcHTML: '<i class="fa fa-circle-o" aria-hidden="true"></i>'
        };

    }
    onDismiss(err) {
        if (err === "Error") {
            this.setState({visible: true});
        } else {
            this.setState({visible: false});
        }
    }
    checkValue(value) {
        if (value === 0) {
            return 'TBC';
        } else {
            return value;
        }
    }
    getOddsDetails(value, reward) {
        //getCoinIndex result is an array
        //0:pool_total 1:pre_price(Bet open price) 2:post_price(Bet closing price) 3:Bet_lock(Open price set(boolean)) 4:Number of voters of coin
        //Input parameter coin type ETH,BTC,LTC
        var profit = 0
        var coin_bet = parseFloat(web3.utils.fromWei(value[0], "ether"))
        if (coin_bet > 0)
            profit = Math.round((reward / coin_bet) * 95) / 100;
        var coin_details = {
            pool_total: parseInt(web3.utils.fromWei(value[0].toString(), "ether"))*100/100,
            pre_price: (value[1] / 100),
            post_price: (value[2] / 100),
            odds: (profit),
            number_of_bets: value[4].toString(),
            post_price_title:'Current Price'
        }
        coin_details.pre_price = this.checkValue(coin_details.pre_price);
        if (coin_details.pre_price === 'TBC') {
            coin_details.percentage = 'TBC';
        }
        coin_details.post_price = this.checkValue(coin_details.post_price);
        let bets = parseFloat(this.state.totalAmountBet) + parseFloat(web3.utils.fromWei(value[0].toString(), "ether"))
        bets = Math.round(bets * 100) / 100;
        let coins = parseInt(this.state.totalCoins,10)
        coins = coins + 1;
        this.setState({totalAmountBet: bets, totalCoins: coins})
        return coin_details;
    }
    getCoinDetails() {
        var self = this;
        myContract.at(this.props.currentContract).then(function(instance) {
            instance.reward_total().then(function(reward) {
                reward = web3.utils.fromWei(reward, "ether")
                instance.getCoinIndex("ETH").then(function(value) {
                    console.log('ETH ',value);
                    var eth = self.getOddsDetails(value, reward);
                    if (eth.pre_price !== "TBC") {
                        fetch("https://api.coinmarketcap.com/v1/ticker/ethereum/").then(function(details) {
                            // console.log(details.json().then());
                            return details.json().then(function(value) {
                                let inc = Math.round(((value[0].price_usd - eth.pre_price) / eth.pre_price) * 100000) / 1000;
                                eth['percentage'] = inc + " %";
                                if (eth["post_price"] !== "TBC") {
                                    inc = Math.round(((eth.post_price - eth.pre_price) / eth.pre_price) * 100000) / 1000;
                                    eth['percentage'] = inc + " %";
                                    eth["post_price"] = "$ " + eth["post_price"];
                                    eth.post_price_title="End Price"
                                }
                                else{
                                  eth["post_price"] = "$ " + value[0].price_usd;
                                }
                                eth["pre_price"] = "$ " + eth["pre_price"];
                                self.setState({eth_pool: eth});
                            })
                        })
                    } else {
                        self.setState({eth_pool: eth});
                    }
                });
                instance.getCoinIndex("LTC").then(function(value) {
                    console.log('LTC ',value);
                    var ltc = self.getOddsDetails(value, reward);
                    if (ltc.pre_price !== "TBC") {
                        fetch("https://api.coinmarketcap.com/v1/ticker/litecoin/").then(function(details) {
                            // console.log(details.json().then());
                            return details.json().then(function(value) {
                                let inc = Math.round(((value[0].price_usd - ltc.pre_price) / ltc.pre_price) * 100000) / 1000;
                                ltc['percentage'] = inc + " %";
                                if (ltc["post_price"] !== "TBC") {
                                    inc = Math.round(((ltc.post_price - ltc.pre_price) / ltc.pre_price) * 100000) / 1000;
                                    ltc['percentage'] = inc + " %";
                                    ltc["post_price"] = "$ " + ltc["post_price"];
                                    ltc.post_price_title="End Price"
                                }
                                else{
                                  ltc["post_price"] = "$ " + value[0].price_usd;
                                }
                                ltc["pre_price"] = "$ " + ltc["pre_price"];
                                // console.log(ltc)
                                self.setState({ltc_pool: ltc});
                            })
                        })
                    } else {
                        self.setState({ltc_pool: ltc});
                    }
                });
                instance.getCoinIndex("BTC").then(function(value) {
                    console.log('BTC ',value);
                    var btc = self.getOddsDetails(value, reward);
                    if (btc.pre_price !== "TBC") {
                        fetch("https://api.coinmarketcap.com/v1/ticker/bitcoin/").then(function(details) {
                            // console.log(details.json().then());
                            return details.json().then(function(value) {
                                let inc = Math.round(((value[0].price_usd - btc.pre_price) / btc.pre_price) * 100000) / 1000;
                                btc['percentage'] = inc + " %";
                                if (btc["post_price"] !== "TBC") {
                                    inc = Math.round(((btc.post_price - btc.pre_price) / btc.pre_price) * 100000) / 1000;
                                    btc['percentage'] = inc + " %";
                                    btc["post_price"] = "$ " + btc["post_price"];
                                    btc.post_price_title="End Price"
                                }
                                else{
                                  btc["post_price"] = "$ " + value[0].price_usd;
                                }
                                btc["pre_price"] = "$ " + btc["pre_price"];
                                // console.log(btc)
                                self.setState({btc_pool: btc});
                            })
                        })
                    } else {
                        self.setState({btc_pool: btc});
                    }
                });
            });
        });
        this.contractChange(this.props.currentContract);

    }
    coinRadio(rSelected) {
        let ethHTML,
            btcHTML,
            ltcHTML;
        ethHTML = btcHTML = ltcHTML = '<i class="fa fa-circle-o" aria-hidden="true"></i>';
        switch (rSelected) {
            case 'ETH':
                ethHTML = '<i class="fa fa-dot-circle-o" aria-hidden="true"></i>';
                break;
            case 'BTC':
                btcHTML = '<i class="fa fa-dot-circle-o" aria-hidden="true"></i>';
                break;
            case 'LTC':
                ltcHTML = '<i class="fa fa-dot-circle-o" aria-hidden="true"></i>';
                break;
            default:
                break;
        }
        return [btcHTML,ethHTML,ltcHTML];
    }
    handleChange(rSelected) {
      if(this.props.betting_open && !this.props.voided_bet){
          let coinHTML=this.coinRadio(rSelected);
        // console.log(coinHTML);
        this.setState({rSelected, value: rSelected, btcHTML:coinHTML[0], ethHTML:coinHTML[1], ltcHTML:coinHTML[2]});
        this.props.onSubmit(rSelected);
      }
    }
    componentWillMount() {
        var self = this;
        var web3 = new Web3(Web3.givenProvider);
        web3.eth.net.getNetworkType(function(err, netId) {
            if (err !== null) {
                self.onDismiss('Error')
            } else {
                self.onDismiss('No_Error')
            }

        })
        this.getCoinDetails();

    }
    contractChange(contract) {
        this.setState({contract,ethHTML: '<i class="fa fa-circle-o" aria-hidden="true"></i>',
        btcHTML: '<i class="fa fa-circle-o" aria-hidden="true"></i>',
        ltcHTML: '<i class="fa fa-circle-o" aria-hidden="true"></i>'})
    }
    componentDidUpdate() {
        if (this.state.contract !== this.props.currentContract) {
            this.setState({totalCoins: 0, totalAmountBet: 0})
            this.getCoinDetails();
        }
        if (this.state.totalCoins === 3) {
            // console.log('Accesed')
            this.props.totalBets(this.state.totalAmountBet);
            this.setState({totalCoins: 4})
        }
    }
    render() {

        return (<div>
            <div className="container crypto-container btc-container" onClick={() => this.handleChange("BTC")}>
                <div className="row">
                    <div className="col-lg-12 col-xl-5">
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 select-crypto">
                                <div className="select_coin text-left">Select a Coin</div>
                                <div className="btc-radio-button text-center"  dangerouslySetInnerHTML={{__html: this.state.btcHTML}}></div>
                                <img alt="" className="img-responsive crypto-logo text-center" src={require("./assets/bitcoin.png")}/>
                                <div className="crypto_name">BTC</div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <div className="pool_total text-center">Pool Total (ETH)</div>
                                <div className="pool_total_value text-center">{this.state.btc_pool.pool_total}</div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <div className="odds text-center">Odds</div>
                                <div className="odds_value text-center">{this.state.btc_pool.odds}</div>
                            </div>
                        </div>
                        </div>

                    <div className="col-lg-12 col-xl-7">
                        <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="bets_number text-center">Number of Bets</div>
                                <div className="bets_number_value text-center">{this.state.btc_pool.number_of_bets}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_start_price text-center">Start Price</div>
                                <div className="race_start_price_value text-center">{this.state.btc_pool.pre_price}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_end_price text-center">{this.state.btc_pool.post_price_title}</div>
                                <div className="race_start_price_value text-center">{this.state.btc_pool.post_price}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_end_price text-center">Price Change %</div>
                                <div className="race_start_price_value text-center">{this.state.btc_pool.percentage}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container crypto-container eth-container" onClick={() => this.handleChange("ETH")}>
                <div className="row">

                    <div className="col-lg-12 col-xl-5">
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 select-crypto">
                                <div className="select_coin text-left">Select a Coin</div>
                                <div className="eth-radio-button text-center"  dangerouslySetInnerHTML={{__html: this.state.ethHTML}}></div>
                                <img alt="" className="img-responsive crypto-logo text-center" src={require('./assets/ethereum.png')}/>
                                <div className="crypto_name">ETH</div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <div className="pool_total text-center">Pool Total (ETH)</div>
                                <div className="pool_total_value text-center">{this.state.eth_pool.pool_total}</div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <div className="odds text-center">Odds</div>
                                <div className="odds_value text-center">{this.state.eth_pool.odds}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-xl-7">

	                    <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="bets_number text-center">Number of Bets</div>
                                <div className="bets_number_value text-center">{this.state.eth_pool.number_of_bets}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_start_price text-center">Start Price</div>
                                <div className="race_start_price_value text-center">{this.state.eth_pool.pre_price}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_end_price text-center">{this.state.eth_pool.post_price_title}</div>
                                <div className="race_start_price_value text-center">{this.state.eth_pool.post_price}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_end_price text-center">Price Change %</div>
                                <div className="race_start_price_value text-center">{this.state.eth_pool.percentage}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container crypto-container ltc-container" onClick={() => this.handleChange("LTC")}>
                <div className="row">

                    <div className="col-lg-12 col-xl-5">
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4 select-crypto">
                                <div className="select_coin text-left">Select a Coin</div>
                                <div className="ltc-radio-button text-center"  dangerouslySetInnerHTML={{__html: this.state.ltcHTML}}></div>
                                <img alt="" className="img-responsive crypto-logo text-center" src={require("./assets/litecoin.png")}/>
                                <div className="crypto_name">LTC</div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <div className="pool_total text-center">Pool Total (ETH)</div>
                                <div className="pool_total_value text-center">{this.state.ltc_pool.pool_total}</div>
                            </div>
                            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                                <div className="odds text-center">Odds</div>
                                <div className="odds_value text-center">{this.state.ltc_pool.odds}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12 col-xl-7">
	                   <div className="row">
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="bets_number text-center">Number of Bets</div>
                                <div className="bets_number_value text-center">{this.state.ltc_pool.number_of_bets}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_start_price text-center">Start Price</div>
                                <div className="race_start_price_value text-center">{this.state.ltc_pool.pre_price}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_end_price text-center">{this.state.ltc_pool.post_price_title}</div>
                                <div className="race_start_price_value text-center">{this.state.ltc_pool.post_price}</div>
                            </div>
                            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                                <div className="race_end_price text-center">Price Change %</div>
                                <div className="race_start_price_value text-center">{this.state.ltc_pool.percentage}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}
