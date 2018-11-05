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
import cfg from './config.json';

var Web3 = require('web3');
var contract = require("truffle-contract");

if (!process.env.REACT_APP_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT === 'dev') {
    // dev code
    var ip=cfg.testingIP;
} else {
    // production code
    ip=cfg.productionIP;
}

// web3resolver();

if (window.ethereum) {
    var web3 = new Web3(window.ethereum);

    try {
        // Request account access if needed
        window.ethereum.enable();
    } catch (error) {
        console.log(error);
        // User denied account access...
    }
} else {
    var web3 = new Web3(Web3.givenProvider);
}

var myContract = contract(ethorsejson);
if (web3.currentProvider != null) {
    myContract.setProvider(web3.currentProvider);
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
            targetNetwork: cfg.network,
            targetDate: '0',
            race_end: false,
            bet_phase: "",
            hidePlacingBet: true,
            hideBetPlaced: true,
            version: "",
            voided_bet: false,
            raceContentUpdate:0,
            raceTimerUpdate:0,
            controllerContentUpdate:0,
            dappLiveStatus: false,
            raceNumber:-1
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
    startFlipClock(time, timerStart) {
        this.setState({targetDate: time, timerStart})
    }
    updateRace = () => {
        this.setState({race_end:true,raceContentUpdate:Math.random()});
    }
    componentLoad() {
        var placeBetListener = myContract.at(this.state.contract);
        placeBetListener.Deposit().watch(function (error, result) {
            if(!error) {
                self.setState({raceContentUpdate:Math.random()});
            }
        });
        placeBetListener.PriceCallback().watch(function (error, result) {
            if(!error) {
                self.setState({raceContentUpdate:Math.random()});
            }
        });

        var currentTime = new Date()
        this.checkNetwork()
        currentTime = currentTime.getTime()/1000
        var self = this;
        if (web3.currentProvider != null) {

            myContract.at(this.state.contract).then(function(instance) {
                instance.chronus().then(function(info) {
                    let betting_open = info[0];
                    let race_start = info[1];
                    var race_end = false;
                    let voided_bet = info[3];
                    let starting_time = info[4].toNumber();
                    let betting_duration = info[5].toNumber();
                    let race_duration = info[6].toNumber();
                    // console.log(betting_open,race_start,race_end,voided_bet,starting_time,betting_duration,race_duration);
                    let bet_phase = ""
                    if (currentTime >= starting_time && currentTime < (starting_time + betting_duration)) {
                        self.startFlipClock(starting_time + betting_duration - 90, starting_time);
                        bet_phase = "Betting closes in";
                    } else if (currentTime < (starting_time + race_duration) && currentTime >= (starting_time + betting_duration)) {
                        let time = parseInt(starting_time, 10) + parseInt(race_duration, 10);
                        self.startFlipClock(time, starting_time + betting_duration);
                        bet_phase = "Race ends in";
                    } else if (starting_time > 0) {
                        self.startFlipClock(0, 0);
                        bet_phase = "Race complete";
                        race_end = true;
                    }
                    let ms = (race_duration - betting_duration) * 1000
                    let h,m,s;
                    s = Math.floor(ms / 1000);
                    m = Math.floor(s / 60);
                    s = s % 60;
                    h = Math.floor(m / 60);
                    m = m % 60;

                    var race_duration_utc;
                    console.log("hour: ", h);
                    if (h == 0) {
                        race_duration_utc = (m/60).toFixed(1) + ' hour';
                    } else if (h <= 1) {
                        race_duration_utc = h + ' hour';
                    } else {
                        race_duration_utc = h + ' hours';
                    }

                    console.log("Race Duration: ", race_duration_utc);
                    self.setState({betting_open,race_start,race_end,voided_bet,starting_time,betting_duration,race_duration,duration: race_duration_utc,claim: race_end,bet_phase
                    });
                })

            })
        }
    }

    componentDidMount() {
        if (this.state.contract !== null)
        this.checkRewards();
    }

    invokeContract() {
        if (this.state.amount < 0.01) {
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
                    ethAccount = accounts[0];

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
                                fetch(ip+"/bridge/detect", {
                                    method: 'GET',
                                }).then(function(ipinfo) {
                                    ipinfo.json().then(function(ipcountry) {
                                        if (ipcountry.country !== "US") {
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
                                        } else {
                                            self.setState({value: null, transactionid: null, hidePlacingBet: true});
                                            alert("Platform not available in your country");
                                        }
                                    });

                                });

                            })
                        } else if (ethAccount === undefined) {
                            alert('Your Metamask seems to be locked. Please unlock.')
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
                            reward = 'You have ' + web3.utils.fromWei(reward, "ether") + ' ETH to claim.';
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
                ethAccount = accounts[0];
            }).then(function() {
                // console.log(ethAccount)
                if (ethAccount === undefined) {
                    alert('Your Metamask seems to be locked. Please unlock to place a bet.')
                } else {
                    const txo = {
                        from: ethAccount
                    };
                    instance.claim_reward.estimateGas(txo).then(function(gas) {
                        txo.gas = gas;
                        instance.claim_reward(txo).then(function(res, error) {});
                    })
                }

            });

        });
    }
    setRaceNumber(raceNumber) {
        console.log("entering set race number");
        this.setState({raceNumber});
    }
    contractUpdate(contract) {
        let self = this;
        console.log(contract);
        this.setState({
            contract,
            coin: null
        }, function() {
            self.componentLoad();
            self.checkRewards();
            self.getVersion();
        })
    }
    getVersion() {
        let self = this;
        if (this.state.contract !== null)
        myContract.at(this.state.contract).then(function(instance) {
            instance.version().then(function(version) {
                if (version !== "") {
                    version = 'v'+version;
                    self.setState({version});
                }
            })
        })
    }

    totalBets(bets) {
        this.setState({t_bets: bets})
    }
    render() {
        if (web3.currentProvider != null && this.state.network === this.state.targetNetwork && this.state.contract !== null) {
            var renderContent = (<div>
                <div>
                    <Header contract={this.state.contract} version={this.state.version} rendered={true}/>
                    <div >
                        <div className="row">
                            <div className="col-md-2 mx-auto col-sm-1"></div>
                            <div className="col-md-10 mx-auto col-sm-11" style={{
                                'marginTop' : '30px'
                            }}>
                            <div className="row">
                                <div className="container header-wrapper">
                                    <header className="header">
                                        <div className="row">
                                            <Result contract={this.state.contract} race_end={this.state.race_end} starting_time={this.state.starting_time} voided_bet={this.state.voided_bet}
                                                bet_phase={this.state.bet_phase}/>
                                                <div className="volume header-item col-sm-4 col-md-4 col-lg-4" key={this.state.raceContentUpdate}>
                                                    <img alt="" className="header-item-img" src={require("./assets/Orion_storage-box.png")}/>
                                                    <div className="header-item-title text-center">Pool</div>
                                                    <div className="header-item-value text-center">{this.state.t_bets}
                                                        &nbsp;ETH</div>
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

                                                <Timer key={this.state.raceTimerUpdate} updateRace={this.updateRace} targetDate={this.state.targetDate} bet_phase={this.state.bet_phase} timerStart={this.state.timerStart} raceNumber={this.state.raceNumber} contract_id={this.state.contract}/>
                                                <div className="col-sm-6 col-md-4 col-lg-4">
                                                    <img alt="" className="header-item-img" src={require("./assets/Orion_sales-up.png")}/>
                                                    <div className="cb-title crypto-bet text-center">Crypto to Bet On</div>
                                                    <SelectedCoin coin={this.state.coin} betting_open={this.state.betting_open} voided_bet={this.state.voided_bet}/>
                                                </div>
                                                <div className="col-md-4">
                                                    <Amount onValueSubmit={this.onValueSubmit.bind(this)}/>
                                                    <div className="btn-container text-center"><button type="button" onClick={this.invokeContract.bind(this)} className="btn place-bet-button center-block text-center" disabled={!this.state.betting_open || this.state.coin === null} hidden={!this.state.hidePlacingBet} value="Place Bet"><img class="place-bet-icon" src={require("./assets/Orion_online-payment.png")}/> Place Bet</button></div>
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
                                            <ETHRadio key={this.state.raceContentUpdate} onSubmit={this.coinValue.bind(this)} name="Radio" currentContract={this.state.contract} totalBets={this.totalBets.bind(this)} betting_open={this.state.betting_open} voided_bet={this.state.voided_bet} race_end={this.state.race_end}/>
                                            <br/>

                                            <div className="text-center"><img alt="" className="img-responsive speaker-icon" src={require("./assets/Orion_champion.png")}/><span>{this.state.reward.toString()}</span></div>

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
                                <div className="col-md-2 mx-auto" style={{
                                    'marginTop' : '5vh',
                                    position: 'fixed'
                                }}>
                                <ContractSidebar onContractSubmit={this.contractUpdate.bind(this)} setRaceNumber={this.setRaceNumber.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>);

            return (renderContent);
        } else if (web3.currentProvider == null ) {
            return (<div>
                        <Header contractUpdate={this.contractUpdate.bind(this)}/>
                        <div className="row">
                            <div className="col-md-2 mx-auto col-sm-1"></div>
                            <div className="col-md-10 mx-auto col-sm-11">
                                <h3 className="header" style={{textAlign:'center', display:'table',margin:'0 auto', marginTop:'30vh'}}>
                                    Ethorse runs on the Ethereum Blockchain. To view its awesome web page, it requires a compatible browser and plug-in. <br/>
                                    A popular choice is installing <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" >Metamask</a> plug-in on Chrome or Firefox browsers.<br/>
                                </h3>
                            </div>
                        </div>
                        <div style={{pointerEvents: 'none'}}>
                            <ContractSidebar />
                        </div>
                    </div>)
        }else if (this.state.contract === null) {
            return (<div>
                <Header contractUpdate={this.contractUpdate.bind(this)}/>
                <div className="row">
                    <div className="col-md-2 mx-auto col-sm-1"></div>
                    <div className="col-md-10 mx-auto col-sm-11">
                        <h3 className="header" style={{textAlign:'center', display:'table',margin:'0 auto', marginTop:'30vh'}}>
                            Races will be launched soon. Please check back later.
                        </h3>
                    </div>
                </div>
                <ContractSidebar onContractSubmit={this.contractUpdate.bind(this)} setRaceNumber={this.setRaceNumber.bind(this)}/>
            </div>)
        } else if (web3.currentProvider != null && this.state.network !== this.state.targetNetwork) {
            return (
                <div>
                    <Header contractUpdate={this.contractUpdate.bind(this)}/>
                    <div className="row">
                        <div className="col-md-2 mx-auto col-sm-1"></div>
                        <div className="col-md-10 mx-auto col-sm-11">
                            <Jumbotron style={{
                                        'textAlign' : 'center',
                                        'backgroundColor' : '#262f4a'
                                    }} fluid={true}>
                                <Container>
                                    <h3>Your Metamask is on {this.state.network} network.<br/>Please switch to {this.state.targetNetwork} network on Metamask as shown below.</h3>
                                    <br/>
                                    <img src={require('./assets/'+this.state.targetNetwork.toLowerCase()+'_switch.png')} target="_blank" width="30%" alt={"switch to " + this.state.targetNetwork}/>
                                </Container>
                            </Jumbotron>
                        </div>
                    </div>
                    <ContractSidebar onContractSubmit={this.contractUpdate.bind(this)} setRaceNumber={this.setRaceNumber.bind(this)}/>
                </div>)
    }  else {
        return (<div/>);
    }
}
}

export default App;
