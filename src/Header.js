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
            modal: false,
            termsModal:true
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
        if (val == null) {
            localStorage.setItem('accessed', true);
            this.setState({termsModal: true})
        }

    }
    onContractSubmit(contract) {
        this.props.contractUpdate(contract)
    }
    render() {
        var address_link = "https://kovan.etherscan.io/address/" + this.props.contract + "#code";
        return (<div>

            <div className="container-fluid top-bar">
            	<a className="logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<div className="versionNumber">v{this.props.version}</div>
            	<ul className="topBarRightSection">
                    <li className="help"><a href="#" onClick={this.toggle}><i className="fa fa-slack"></i>Help</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://telegram.me/ethorse" ><img alt="" src={require("./assets/telegram.png")} className="telegram"/></a></li>
                    <li><a href="https://discord.gg/vdTXRmT" target="_blank" rel="noopener noreferrer"><img className="discord" src={require("./assets/discord.png")} alt="Discord"/></a></li>
                    <li><a href="https://www.reddit.com/r/Ethorse/" target="_blank" rel="noopener noreferrer" ><img alt="" src={require("./assets/reddit.png")} className="reddit"/></a></li>
                    <li><a href="https://github.com/ethorse" target="_blank" rel="noopener noreferrer" ><img alt="" src={require("./assets/github.png")} className="github"/></a></li>
            	</ul>
            </div>

            <div className="container-fluid alternate-bar">
            	<a className="logo" href="#"><img alt="" className="logo-img" src={require("./assets/logo.png")}/></a>
            	<div className="versionNumber-alternateBar">v{this.props.version}</div>
            	<ul className="topBarRightSection">
                    <li className="help"><a href="#" onClick={this.toggle}><i className="fa fa-slack"></i>Help</a></li>
                    <li><a target="_blank" rel="noopener noreferrer" href="https://telegram.me/ethorse" ><img alt="Telegram" src={require("./assets/telegram.png")}/></a></li>
                    <li><a href="https://discord.gg/vdTXRmT" target="_blank" rel="noopener noreferrer"><img className="discord" src={require("./assets/discord.png")} alt="Discord"/></a></li>
                    <li><a href="https://www.reddit.com/r/Ethorse/" target="_blank" rel="noopener noreferrer" ><img alt="Reddit" src={require("./assets/reddit.png")}/></a></li>
                    <li><a href="https://github.com/ethorse" target="_blank" rel="noopener noreferrer" ><img alt="Github" src={require("./assets/github.png")}/></a></li>
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
                    Bet on a cryptocurrency and win against other users based on the price performance in a given period (24hr / 1hr).
                    <br/>
                    <h5>How to use</h5>
                    <ul class="help-text">
                        <li >Choose a race from the sidebar with the status "Betting open" </li>
                        <li>Select a coin to bet on - BTC, ETH and LTC</li>
                        <li>Enter the amount you are willing to bet (Min 0.01 Kovan ETH)</li>
                        <li>Click “Place Bet”, verify and submit the auto-filled Metamask transaction</li>
                        <li>Betting is locked once the race starts</li>
                        <li >Track the winning coin using the % value under “Leading”</li>
                        <li >After the race ends, users can check their bet results and claim winnings by using the “Claim” button at the bottom of the page</li>
                    </ul>
                    <h5>About the race</h5>
                    <ul class="help-text">
                        <li>There is an 1 hr betting period for all races</li>
                        <li>There are two different races, differentiated by a race period of 24 hr and 1 hr</li>
                        <li>New races are available every 6 six hours. Upcoming races are shown on the side bar</li>
                        <li>Users must claim their winnings within 30 days after the race ends</li>
                    </ul>
                    <br/>
                    Contract Address:<a href={address_link} rel="noopener noreferrer" target="_blank">{this.props.contract}</a>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>OK</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}
