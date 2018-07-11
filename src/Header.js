import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';
import React, {Component} from 'react';
import $ from 'jquery';
// import './App.css';
import cfg from './config.json';
import 'bootstrap/dist/css/bootstrap.css';

var network = cfg.network;
var link_to_mainnet = true;
if (network !== "Main") {
    network = network+".";
    link_to_mainnet = false;
} else {
    network = "";
}

console.log(link_to_mainnet);
export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            termsModal:false
        };

        this.toggle = this.toggle.bind(this);
        this.termstoggle=this.termstoggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    termstoggle(){
        this.setState({
            termsModal: !this.state.termsModal
        });
    }
    componentWillMount() {
        var val = localStorage.getItem('accessed');
        if (val == null && this.props.rendered===true) {
            localStorage.setItem('accessed', true);
            this.setState({termsModal: true})
        }

    }
    componentDidMount(){
        $(".hamburger-icon").click(function(){
        	$(".left-panel").addClass("left-panel-slide");
          $(".fadingBackground").addClass("fadingBackground-toggle");
        	$(this).addClass("hamburger-icon-off");
        	$(".close-icon").addClass("close-icon-on");
        });

        $(".close-icon").click(function(){
            $(".fadingBackground").removeClass("fadingBackground-toggle");
        	$(".left-panel").removeClass("left-panel-slide")
        	$(this).removeClass("close-icon-on");
        	$(".hamburger-icon").removeClass("hamburger-icon-off");
        });

        $(".fadingBackground").click(function(){
            $(this).removeClass("fadingBackground-toggle");
            $(".left-panel").removeClass("left-panel-slide");
            $(".close-icon").removeClass("close-icon-on");
            $(".hamburger-icon").removeClass("hamburger-icon-off");
        });
   }

    onContractSubmit(contract) {
        this.props.contractUpdate(contract)
    }
    render() {
        var address_link = "https://"+network+"etherscan.io/address/" + this.props.contract + "#code";
        return (<div>

            <div className="container-fluid top-bar">
            	<a className="logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<div className="versionNumber">{this.props.version}</div>
            	<ul className="topBarRightSection">
                    <li className="help"><a href="#" onClick={this.toggle}><i className="fa fa-slack"></i>Help</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://telegram.me/ethorse" ><img alt="" src={require("./assets/telegram.png")} className="telegram"/></a></li>
                    <li><a href="https://discord.gg/WKEZKvu" target="_blank" rel="noopener noreferrer"><img className="discord" src={require("./assets/discord.png")} alt="Discord"/></a></li>
                    <li><a href="https://www.reddit.com/r/Ethorse/" target="_blank" rel="noopener noreferrer" ><img alt="" src={require("./assets/reddit.png")} className="reddit"/></a></li>
                    <li><a href="https://github.com/ethorse" target="_blank" rel="noopener noreferrer" ><img alt="" src={require("./assets/github.png")} className="github"/></a></li>
            	</ul>
            </div>

            <div className="container-fluid alternate-bar">
              <img class="hamburger-icon" alt="Burger" src={require("./assets/Orion_menu-hamburger.png")}/>
            	<img class="close-icon" alt="Close Burger" src={require("./assets/Orion_close.png")}/>
            	<a class="alternate-bar-logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<a className="alternate-bar-logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<div className="versionNumber-alternateBar">{this.props.version}</div>
            	<ul className="topBarRightSection">
                    <li className="help"><a href="#" onClick={this.toggle}><i className="fa fa-slack"></i>Help</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://telegram.me/ethorse" ><img alt="Telegram" className="telegram" src={require("./assets/telegram.png")}/></a></li>
                    <li><a href="https://discord.gg/WKEZKvu" target="_blank" rel="noopener noreferrer"><img className="discord" src={require("./assets/discord.png")} alt="Discord"/></a></li>
                    <li><a href="https://www.reddit.com/r/Ethorse/" target="_blank" rel="noopener noreferrer" ><img alt="Reddit" className="reddit" src={require("./assets/reddit.png")}/></a></li>
                    <li><a href="https://github.com/ethorse" target="_blank" rel="noopener noreferrer" ><img alt="Github" className="github" src={require("./assets/github.png")}/></a></li>
            	</ul>
            </div>


            <Modal isOpen={this.state.termsModal} toggle={this.termstoggle} size="lg" style={{
                    textAlign: 'left'
                }}>
                <ModalHeader toggle={this.toggle}>
                    <h4>Terms</h4>
                </ModalHeader>
                <ModalBody>
                    <p style={{
                            fontSize: '15px',
                            color: 'black'
                        }}>By clicking OK or interacting with Ethorse website or application beyond these terms of use, you confirm that you are at least 18 years of age and you represent, warrant and agree to ensure that your use of the application will comply with all applicable laws, statutes and regulations. Ethorse does not intend to enable you to contravene applicable law. Ethorse is not responsible for any illegal or unauthorized use of our services by you. Ethorse is neither a game of chances nor a gambling application. It is a skill based (Cryptocurrency Trading) decentralized application that runs on the Ethereum Blockchain.</p>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.termstoggle}>OK</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" style={{
                    textAlign: 'left'
                }}>
                <ModalHeader toggle={this.toggle}>
                    <h4>Help</h4>
                </ModalHeader>
                <ModalBody>
                    Bet on a cryptocurrency and win against other users based on the price performance in a given period (1 hr).
                    <br/>
                    <h5>How to use</h5>
                    <ul class="help-text">
                        <li>Choose a race from the sidebar with the status "Betting open"</li>
                        <li>Select a coin to bet on - BTC, ETH or LTC</li>
                        <li>Enter the amount you are willing to bet (Min 0.01 ETH)</li>
                        <li>Click “Place Bet”, verify and submit the auto-filled Metamask transaction</li>
                        <li>Betting is locked once the race starts</li>
                        <li>Track the winning coin using the % value under "Price change %"</li>
                        <li>After the race ends, check bet results and claim winnings using the buttons at the bottom of the page</li>
                        <li>Odds shows the potential winning for 1 ETH bet, includes the 1 ETH</li>
                    </ul>
                    <h5>About the race</h5>
                    <ul class="help-text">
                        {/* <li>There are two different races, differentiated by a race period of 24 hrs and 1 hr</li> */}
                        {/* <li>There are six 1hr races and one 24hr race every day. Upcoming races are shown on the sidebar</li> */}
                        {/* <li>Betting is open for 4 hours for 1 hour races and 6 hrs for 24 hour race</li> */}
                        <li>There are five 1 hr races everyday</li>
                        <li>If the coin start or end prices are not received on Blockchain from Oraclize in 30 minutes, Ethorse fallback Oracle kicks in to put the price (from the same start/end time) on the Blockchain.</li>
                        <li>If there are no prices recorded for an hour hour, the contract automatically enables refund the bettor, no winners/losers will be decided.</li>
                        <li>Our price source is Coinmarketcap API [ <a href="https://api.coinmarketcap.com/v2/ticker/?start=1&limit=10" rel="noopener noreferrer" target="_blank">https://api.coinmarketcap.com/v2/ticker/?start=1&limit=10</a> ]</li>
                        <li>Users must claim their winnings within 30 days after the race ends</li>
                    </ul>
                    <h5>About the HORSE Token</h5>
                    <ul class="help-text">
                        <li>A takeout of 5% from each race pool goes to the Reward pool. HORSE token holders can earn this reward pool by staking the tokens in their wallet during a fixed time using our dApp smart contract</li>
                        <li>HORSE tokens are traded on <a href="https://yobit.net/en/trade/HORSE/ETH" rel="noopener noreferrer" target="_blank">YoBit</a> and <a href="https://forkdelta.github.io/#!/trade/HORSE-ETH" rel="noopener noreferrer" target="_blank">ForkDelta</a></li>
                    </ul>
                    More details on <a href="https://ethorse.com" rel="noopener noreferrer" target="_blank">Ethorse.com</a><br/>
                    <span hidden={link_to_mainnet} style={{color:'black'}}>Bet with real ether at <a href="https://bet.ethorse.com" target="_blank" >bet.ethorse.com</a></span>
                    <br/>Contract address of the current highlighted race: <a href={address_link} rel="noopener noreferrer" target="_blank">{this.props.contract}</a>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}
