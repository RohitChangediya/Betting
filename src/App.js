import React, {Component} from 'react';
// import ethorsejson from './ETHorse.json';
import ethorsejson from './ETHorse.json';
// import configjson from './config.json'
import './App.css';
import ETHRadio from './ETHRadio'
import Amount from './Amount.js'
import Header from './Header'
import Result from './Result'
import ContractSidebar from './ContractSidebar'
import {Jumbotron, Container} from 'reactstrap'
// import { Message, Icon } from 'semantic-ui-react'
import SelectedCoin from './SelectedCoin';
import Timer from './Timer';

var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);
if (web3.currentProvider != null) {
    myContract.setProvider(web3.currentProvider);

} else {
    // var isChrome = !!window.chrome && !!window.chrome.webstore;
    // console.log(isChrome)
    // if(isChrome){
    // alert("Compatible only with Chrome browser (with Metamask extension), Mist or Geth")
    // }else{
    //   alert("Compatible only with Metamask browser extension for Chrome or Mist browser from Ethereum")
    // }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contractState: null,
            network: null,
            price: null,
            invokePrice: null,
            amount: 0.1,
            coin: null,
            value: null,
            coinChoice: '',
            coinChosen: false,
            reward: '',
            starting_time: 0,
            claim: false,
            contract: null,
            duration: "",
            t_bets: 0,
            nextRace: '',
            targetNetwork: 'Kovan',
            targetDate: '0',
            race_end: false,
            bet_phase: "",
            hidePlacingBet: true,
            hideBetPlaced:true,
            version:""
        };
        this.invokeContract = this.invokeContract.bind(this);
        this.checkRewards = this.checkRewards.bind(this);
        this.claim = this.claim.bind(this);
        this.componentLoad = this.componentLoad.bind(this);
        this.startFlipClock = this.startFlipClock.bind(this);

    }

    checkNetwork() {
        var self = this;
        web3.eth.net.getNetworkType((err, netId) => {
            netId = netId[0].toUpperCase() + netId.substring(1);
            self.setState({network: netId})
        })

    }
    startFlipClock(time,timerStart) {
        this.setState({targetDate: time,timerStart})
    }
    componentLoad() {
        var currentTime = new Date()
        this.checkNetwork()
        currentTime = currentTime.getTime()
        var self = this;
        if (web3.currentProvider != null) {

            myContract.at(this.state.contract).then(function(instance) {
                instance.chronus().then(function(info) {
                    let betting_open = info[0];
                    let race_start = info[1];
                    let race_end = info[2];
                    let voided_bet = info[3];
                    let starting_time = info[4].toNumber();
                    let betting_duration = info[5].toNumber();
                    let race_duration = info[6].toNumber();
                    // console.log(betting_open,race_start,race_end,voided_bet,starting_time,betting_duration,race_duration);
                    let bet_phase = ""
                        if (currentTime >= (starting_time * 1000) && currentTime < ((starting_time + betting_duration) * 1000)) {
                            self.startFlipClock(starting_time + betting_duration,starting_time);
                            bet_phase = "Betting closes in";
                        } else if (currentTime < ((starting_time + race_duration) * 1000) && currentTime >= ((starting_time + betting_duration) * 1000)) {
                            let time = parseInt(starting_time, 10) + parseInt(race_duration, 10);
                            self.startFlipClock(time,starting_time + betting_duration);
                            bet_phase = "Race ends in";
                        } else if (starting_time > 0) {
                            self.startFlipClock(0,0);
                            bet_phase = "Race complete";
                        }
                        let ms = (race_duration - betting_duration) * 1000
                            let h,m,s;
                            s = Math.floor(ms / 1000);
                            m = Math.floor(s / 60);
                            s = s % 60;
                            h = Math.floor(m / 60);
                            m = m % 60;
                            h = h + ' hours'
                            var race_duration_utc = h;
                            self.setState({betting_open,race_start,race_end,voided_bet,starting_time,betting_duration,race_duration,duration: race_duration_utc,claim: race_end,bet_phase});
                        })

                    })
                }
            }

            componentDidMount() {
                if (this.state.contract !== null)
                    this.checkRewards();

                }

            invokeContract() {
                if (this.state.amount < 0.01 ) {
                    alert('Bet minimum 0.01 ETH');
                    return;
                }
                var self = this;
                this.setState({
                    value: null
                }, function() {
                    myContract.at(this.state.contract).then(function(instance) {
                        var ethAccount = '';
                        web3.eth.getAccounts(function(err, accounts) {
                            ethAccount = accounts[0]
                        }).then(function() {
                            if (self.state.race_end === false) {
                                const txo = {
                                    from: ethAccount,
                                    value: web3.utils.toWei(self.state.amount),
                                    data: self.state.coin
                                };
                                if (txo.data !== null && ethAccount !== undefined) {
                                    self.setState({
                                        transactionid: 'Placing Bet...',
                                        hidePlacingBet: false
                                    }, function() {
                                        instance.placeBet(self.state.coin, txo).then(function(res, error) {

                                            self.setState({
                                                transactionid: ('Transaction ID: ' + res.tx + '. '),
                                                transactionidmsg: "Good luck. You can use \"Check result\" and \"Claim\" after the race is over.",
                                                value: self.state.coin,
                                                hidePlacingBet: true
                                            });
                                        }).catch(function(e) {
                                            self.setState({hidePlacingBet: true})
                                            if (e.message === "MetaMask Tx Signature: User denied transaction signature.") {
                                                self.setState({value: null, transactionid: null, hidePlacingBet: true})
                                            }
                                        })
                                    })
                                } else if (ethAccount === undefined) {
                                    alert('Your Metamask seems to be locked. Please unlock to place a bet.')
                                } else {
                                    self.setState({coinChosen: true});
                                }
                            }
                        });
                    })
                })

            }

            onValueSubmit(amount) {
                this.setState({amount: amount});
            }

            coinValue(coin) {
                var self = this;
                if (!this.state.race_end) {
                    self.setState({coin: coin, value: coin});
                }
            }

            checkRewards() {
                var self = this;
                myContract.at(this.state.contract).then(function(instance) {
                    var ethAccount;
                    web3.eth.getAccounts(function(err, accounts) {
                        ethAccount = accounts[0]
                    }).then(function() {
                        const txo = {
                            from: ethAccount
                        };
                        instance.checkReward.call(txo).then(function(reward) {
                            if (self.state.race_end) {
                                if (self.state.voided_bet) {
                                    reward = 'Refund amount: ' + web3.utils.fromWei(reward, "ether") + ' ETH';
                                    self.setState({reward});
                                    self.setState({claim: true});
                                } else {
                                    reward = 'You have won ' + web3.utils.fromWei(reward, "ether") + ' ETH';
                                    self.setState({reward});
                                }

                            } else if (!self.state.race_end) {
                                let starting_time = self.state.starting_time;
                                let race_duration = self.state.race_duration;
                                if (starting_time + race_duration + self.state.betting_duration < (Math.round((new Date()).getTime() / 1000))) {
                                    reward = 'Refund amount: ' + web3.utils.fromWei(reward, "ether") + ' ETH';
                                    self.setState({reward});
                                    self.setState({claim: true});
                                } else {
                                    reward = 'Available after race ends';
                                    self.setState({reward});
                                }

                            } else {
                                reward = ''
                                self.setState({reward});
                            }
                            self.setState({reward});
                        });
                    });
                });
            }
            claim() {
                myContract.at(this.state.contract).then(function(instance) {

                    var ethAccount;
                    web3.eth.getAccounts(function(err, accounts) {
                        ethAccount = accounts[0]
                    }).then(function() {
                        // console.log(ethAccount)
                        if (ethAccount === undefined) {
                            alert('Your Metamask seems to be locked. Please unlock to place a bet.')
                        } else {
                            const txo = {from: ethAccount};
                            instance.claim_reward.estimateGas(txo).then(function(gas) {
                                txo.gas = gas;
                                instance.claim_reward(txo).then(function(res, error) {});
                            })
                        }

                    });

                });
            }
            contractUpdate(contract) {
                let self = this;

                this.setState({contract,coin:null}, function() {
                    self.componentLoad();
                    self.checkRewards();
                    self.getVersion();
                })
            }
            getVersion(){
                let self=this;
                if(this.state.contract!==null)
                    myContract.at(this.state.contract).then(function(instance){
                        instance.version().then(function(version){
                            self.setState({version});
                        })
                    })
            }

            totalBets(bets) {
                this.setState({t_bets: bets})
            }
            render() {
                if (web3.currentProvider != null && this.state.network === this.state.targetNetwork && this.state.contract !== null) {
                    var renderContent = (<div className="full-height">
                        <div className="full-height">
                            <Header contract={this.state.contract} version={this.state.version}/>
                            <div >
                                <div className="row">
                                    <div className="col-md-2 mx-auto col-sm-1"></div>
                                    <div className="col-md-10 mx-auto col-sm-11">
                                        <div className="row">
                                            <div className="container header-wrapper">
                                                <header className="header">
                                                    <div className="row">
                                                        <Result contract={this.state.contract} race_end={this.state.race_end} starting_time={this.state.starting_time}/>
                                                        <div className="volume header-item col-sm-4 col-md-4 col-lg-4">
                                                            <img alt="" className="header-item-img" src={require("./assets/Orion_storage-box.png")}/>
                                                            <div className="header-item-title text-center">Pool</div>
                                                            <div className="header-item-value text-center">{this.state.t_bets}</div>
                                                        </div>
                                                        <div className="race_duration header-item col-sm-4 col-md-4 col-lg-4">
                                                            <div className="center-block"><img alt="" className="header-item-img img-responsive center-block" src={require("./assets/Orion_timing.png")}/></div>
                                                            <div className="header-item-title text-center">Race Duration</div>
                                                            <div className="header-item-value text-center">{this.state.duration}</div>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{
                                                            marginTop: '5%'
                                                        }}>

                                                        <Timer targetDate={this.state.targetDate} bet_phase={this.state.bet_phase} timerStart={this.state.timerStart}/>
                                                        <div className="col-sm-6 col-md-4 col-lg-4">
                                                            <img alt="" className="header-item-img" src={require("./assets/Orion_sales-up.png")}/>
                                                            <div className="cb-title crypto-bet text-center">Crypto to Bet On</div>
                                                            <SelectedCoin coin={this.state.coin}/>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <Amount onValueSubmit={this.onValueSubmit.bind(this)}/>
                                                            <div className="btn-container text-center"><input type="button" onClick={this.invokeContract.bind(this)} className="btn place-bet-button center-block text-center" disabled={!this.state.betting_open || this.state.coin===null} hidden={!this.state.hidePlacingBet} value="Place Bet"/></div>
                                                            <div className="placingBet text-center" hidden={this.state.hidePlacingBet}>
                                                                <i className="fa fa-circle-o-notch fa-spin"></i>
                                                                Placing Bet...</div>
                                                            {/* <div className="betPlaced text-center" hidden={this.state.hideBetPlaced}><img src={require("./assets/Orion_currency.png")}/> Bet Placed !</div> */}
                                                        </div>
                                                    </div>
                                                </header>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 mx-auto">
                                                {this.state.flashmessage}
                                                <ETHRadio onSubmit={this.coinValue.bind(this)} name="Radio" currentContract={this.state.contract} totalBets={this.totalBets.bind(this)}/>
                                                <br/>

                                                <div className="text-center"><img alt="" className="img-responsive speaker-icon" src={require("./assets/Orion_champion.png")}/>{this.state.reward.toString()}</div>

                                                <div className="text-center">
                                                    <button type="button" className="btn check-result-button text-center" onClick={this.checkRewards} disabled={!this.state.claim}><img alt="" className="refresh img-responsive" src={require("./assets/Orion_restart.png")}/>Check Results</button>
                                                    <button type="button" className="btn claim-button" onClick={this.claim} disabled={!this.state.claim}><img alt="" className="megaphone img-responsive" src={require("./assets/Orion_megaphone.png")}/>Claim</button>
                                                </div>
                                                <br/>
                                                <br/>
                                                <div>
                                                    <br/>
                                                </div>
                                                <br/>
                                                <br/>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-2 mx-auto" style={{'marginTop' : '5vh',position: 'fixed'}}>
                                        <ContractSidebar onContractSubmit={this.contractUpdate.bind(this)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>);

                    return (renderContent);
                } else if (this.state.contract === null) {
                    return (<div>
                        <Header contractUpdate={this.contractUpdate.bind(this)}/>
                        <ContractSidebar onContractSubmit={this.contractUpdate.bind(this)}/>
                    </div>)
                } else if (this.state.network !== this.state.targetNetwork) {
                    return (<Jumbotron style={{'textAlign' : 'center','backgroundColor' : '#262f4a'}} fluid={true}>
                        <Container>
                            <h3>Your Metamask is on {this.state.network} network.<br/>Please switch to {this.state.targetNetwork} as shown below.</h3>
                            <br/>
                            <img src="https://github.com/MetaMask/faq/raw/master/images/click-the-test-network.png" target="_blank" alt={"switch to " + this.state.targetNetwork}/>
                        </Container>
                    </Jumbotron>)
                } else {
                    return (<div/>);
                }
            }
        }

        export default App;
