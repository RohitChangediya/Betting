import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap'
import React, {Component} from 'react';
// import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    componentWillMount() {
        var val = localStorage.getItem('accessed');
        if (val == null) {
            localStorage.setItem('accessed', true);
            this.setState({modal: true})
        }

    }
    onContractSubmit(contract) {
        this.props.contractUpdate(contract)
    }
    render() {
        var address_link = "https://kovan.etherscan.io/address/" + this.props.contract + "#code";
        return (<div>

            <div class="container-fluid top-bar">
            	<a className="logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<div class="versionNumber">v0.12</div>
            	<ul class="topBarRightSection">
                    <li class="demo-video">
                        <a href="https://www.youtube.com/watch?v=JS2uo7pSkn4" target="_blank" rel="noopener noreferrer"><i className="fa fa-film"></i>Demo Video</a>
                    </li>
                    <li class="help"><a href="#" onClick={this.toggle}><i className="fa fa-slack"></i>Help</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://telegram.me/ethorse" ><img alt="" src={require("./assets/telegram.png")} class="telegram"/></a></li>
                    <li><a href="https://discord.gg/vdTXRmT" target="_blank" rel="noopener noreferrer"><img class="discord" src={require("./assets/discord.png")} alt="Discord"/></a></li>
                    <li><a href="https://www.reddit.com/r/Ethorse/" target="_blank" rel="noopener noreferrer" ><img alt="" src={require("./assets/reddit.png")} class="reddit"/></a></li>
                    <li><a href="https://github.com/ethorse" target="_blank" rel="noopener noreferrer" ><img alt="" src={require("./assets/github.png")} class="github"/></a></li>
            	</ul>
            </div>

            <div class="container-fluid alternate-bar">
            	<a className="logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<div class="versionNumber-alternateBar">v0.12</div>
            	<ul class="topBarRightSection">
                    <li class="demo-video">
                        <a href="https://www.youtube.com/watch?v=JS2uo7pSkn4" target="_blank" rel="noopener noreferrer"><i className="fa fa-film"></i>Demo Video</a>
                    </li>
                    <li class="help"><a href="#" onClick={this.toggle}><i className="fa fa-slack"></i>Help</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://telegram.me/ethorse" ><img alt="Telegram" src={require("./assets/telegram.png")}/></a></li>
                    <li><a href="https://discord.gg/vdTXRmT" target="_blank" rel="noopener noreferrer"><img class="discord" src={require("./assets/discord.png")} alt="Discord"/></a></li>
                    <li><a href="https://www.reddit.com/r/Ethorse/" target="_blank" rel="noopener noreferrer" ><img alt="Reddit" src={require("./assets/reddit.png")}/></a></li>
                    <li><a href="https://github.com/ethorse" target="_blank" rel="noopener noreferrer" ><img alt="Github" src={require("./assets/github.png")}/></a></li>
            	</ul>
            </div>



            <Modal isOpen={this.state.modal} toggle={this.toggle} size="lg" style={{
                    textAlign: 'left'
                }}>
                <ModalHeader toggle={this.toggle}>
                    <h4>Help</h4>
                </ModalHeader>
                <ModalBody>
                    Bet on a cryptocurrency and win against other bettors with Ethorse Smart Contract
                    <ul>
                        <li>Simply choose a winner among BTC, ETH and LTC for a fixed time period.</li>
                        <li>"Place bet" after entering an amount you are willing to bet (0.1-1 Ropsten ETH) from a browser with Metamask extension, or Mist.</li>
                        <li>A deployed open source Ethereum smart contract will control the funds, calculate the best performing Cryptocurrency (with displayed bet lock and bet close prices from Coinmarketcap API) and prepare reward for the winning users to collect WITHOUT OUR INPUT or CONTROL</li>
                        <li>Parimutuel Betting: Winner takes all (HORSE holders takeout 5%)</li>
                        <li>Price pulled from
                            <a href="https://coinmarketcap.com/api/" rel="noopener noreferrer" target="_blank">Coinmarketcap.com API</a>
                            through
                            <a href="http://www.oraclize.it/" rel="noopener noreferrer" target="_blank">Oraclize.it</a>
                            at the beginning and end of the bet period</li>
                        <li>After race ends, refresh “Result” to see your winnings and “Claim” to submit a 0 ETH transaction that in turn sends your winnings.</li>
                    </ul>
                    Bet on a favorite to easily win a small payout because it only needs to beat lesser opponents. Alternatively, bet on an underdog and win a huge payout. Tip: Use the Odds. Questions and feedback are welcome.
                    <br/>
                    Link to open source smart contract code:
                    <a href={address_link} rel="noopener noreferrer" target="_blank">{this.props.contract}</a>
                    <br/>
                    Code Audit:
                    <a href="https://www.reddit.com/r/ethdev/comments/7asfml/bounty_open_for_ethorse_dapp_smart_contract/" rel="noopener noreferrer" target="_blank">Public Developer Bug Bounty</a>
                    <br/><br/>
                    <p style={{
                            fontSize: '12px',
                            color: 'gray'
                        }}>By clicking OK or interacting with Ethorse beyond these terms of use, you confirm that you are at least 18 years of age and you represent, warrant and agree to ensure that your use of our services will comply with all applicable laws, statutes and regulations. Ethorse does not intend to enable you to contravene applicable law. Ethorse is not responsible for any illegal or unauthorized use of our services by you.</p>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}
