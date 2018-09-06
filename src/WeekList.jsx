import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import configjson from './config.json'
var Web3 = require('web3');

var web3 = new Web3(Web3.givenProvider);
var moment = require('moment');
if (!process.env.REACT_APP_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT === 'dev') {
    // dev code
    var ip=configjson.testingIP;
} else {
    // production code
    ip=configjson.productionIP;
}
export default class WeekList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active_contract: [],
            participated_contracts:[],
            non_participated_contracts:[],
            activeIndex:0
        };
        this.getContract = this.getContract.bind(this);
        this.updateContract = this.updateContract.bind(this);
    }
    getContract() {
        let self = this;
        // console.log("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract")
        //getActiveRaces
        fetch(ip+"/bridge/getActiveRaces", {
            method: 'GET',
            headers: {
                to: this.props.date,
                from: this.props.date - 604800,
                currentTime: this.props.currentTime
            }
        }).then(function(contracts) {
            if(contracts.status===204){
                self.setState({active_contract: []})
            }
            else if(contracts.status===200){
                contracts.json().then(function(value) {
                    self.setState({active_contract: value})
                    if (value.length > 0) {
                        if(document.getElementById(value[0].contractid)!==null && document.getElementById(value[0].contractid)!==undefined)
                        document.getElementById(value[0].contractid).classList='bettingOpen '+document.getElementById(value[0].contractid).classList;
                        // console.log(value[0].contractid)
                        self.props.initiate(value[0].contractid)
                    }
                })
            }
        })

        var ethAccount=null;
        web3.eth.getAccounts(function(err, accounts) {
            if(err){
                ethAccount = "0x0000000000000000000000000000000000000000";
            }
            else if(accounts!==null && accounts[0]!=undefined){
                ethAccount = accounts[0].toLowerCase();
            }
            else if (accounts[0]===undefined) {
                ethAccount = "0x0000000000000000000000000000000000000000";
            }
        }).then(function(){
            if(ethAccount!==null){
                //getParticipatedRaces
                fetch(ip+"/bridge/getParticipatedRaces", {
                    method: 'GET',
                    headers: {
                        userid:ethAccount
                    }
                }).then(function(contracts) {
                    if(contracts.status===204){
                        self.setState({participated_contracts: []})
                    }
                    else if(contracts.status===200){
                        contracts.json().then(function(value) {
                            // console.log('Participated '+value+' '+ethAccount);
                            self.setState({participated_contracts: value})
                        })
                    }
                })
                //getNonParticipatedRaces
                fetch(ip+"/bridge/getNonParticipatedRaces", {
                    method: 'GET',
                    headers: {
                        userid:ethAccount
                    }
                }).then(function(contracts) {
                    if(contracts.status===204){
                        self.setState({non_participated_contracts: []})
                    }
                    else if(contracts.status===200){
                        contracts.json().then(function(value) {
                            // console.log('Non Participated '+value+' '+ethAccount);
                            self.setState({non_participated_contracts: value})
                        })
                    }
                })
            }});
        }
        componentWillMount() {
            this.getContract();
        }
        handleClick = (e, titleProps) => {
            // console.log("Participated e: ",e);
            // console.log("Participated title: ",titleProps);
            if (titleProps.number == 0) {
                var self = this;
                web3.eth.getAccounts(function(err, accounts) {
                    if (err) {
                    }
                    else if(accounts[0]===undefined){
                        alert('Your Metamask seems to be locked. Please unlock and refresh.');
                    } else {
                        const {index} = titleProps;
                        // const {activeIndex} = this.props.parentState
                        const newIndex = self.state.activeIndex === index? -1: index;
                        self.setState({activeIndex: newIndex});
                    }
                });
            } else {
                const {index} = titleProps
                // const {activeIndex} = this.props.parentState
                const newIndex = this.state.activeIndex === index? -1: index
                this.setState({activeIndex: newIndex})
            }
        }
        updateContract = (contract)=> {
            this.props.contractUpdate(contract);
        }
        render() {
            if ((this.state.active_contract !== null && this.state.active_contract.length !== 0) ||  (this.state.participated_contracts !== null && this.state.participated_contracts.length !== 0) || (this.state.non_participated_contracts !== null && this.state.non_participated_contracts.length !== 0)) {
                let active_contract = this.state.active_contract;
                let participated_contracts = this.state.participated_contracts;
                let non_participated_contracts = this.state.non_participated_contracts;

                const ActiveButtons = (active_contract.map((row) => {

                    if(row.active==="Race in progress"){
                        return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left','paddingBottom':'3%'}} number={this.props.number}>
                            <div class={"raceId "+ row.contractid}><img class={"flag-icon-sidebar "+ row.contractid} src={require("./assets/flag_icon_sidebar.png")} alt=""/>Race #{row.race_number}</div>
                            <div className={"date " + row.contractid} number={0}>{(moment(parseInt(row.date,10) * 1000).format('DD MMM YYYY')).toString()}
                                <br/>
                                <span className={"hour  " + row.contractid} number={0}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                            </div>
                            <div className={"status-race-sidebar " + row.contractid} number={0}>Status
                                <span className={"status_race_value live " + row.contractid} number={0}>{row.active}</span>
                            </div>
                            <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600}{ row.race_duration/3600>1 ? <span className="duration_race_value">hours</span> : <span className="duration_race_value">hour</span> }</span></div>
                        </div>)
                    }
                    else if(row.active==="Open for bets"){
                        return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left','paddingBottom':'3%'}} number={0}>
                            <div class={"raceId "+ row.contractid}><img class={"flag-icon-sidebar "+ row.contractid} src={require("./assets/flag_icon_sidebar.png")} alt=""/>Race #{row.race_number}</div>
                            <div className={"date " + row.contractid} number={0}>{(moment(parseInt(row.date,10) * 1000).format('DD MMM YYYY')).toString()}
                                <br/>
                                <span className={"hour  " + row.contractid} number={0}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                            </div>
                            <div className={"status-race-sidebar " + row.contractid} number={0}>Status
                                <span className={"status_race_value open " + row.contractid} number={0}>{row.active}</span>
                            </div>
                            <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600}{ row.race_duration/3600>1 ? <span className="duration_race_value">hours</span> : <span className="duration_race_value">hour</span> }</span></div>
                        </div>)
                    }
                    else{
                        return <div/>;
                    }
                }))
                const ParticipatedButtons = (participated_contracts.map((row) => {

                    return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left','paddingBottom':'3%'}} number={1}>
                        <div class={"raceId "+ row.contractid}><img class={"flag-icon-sidebar "+ row.contractid} src={require("./assets/flag_icon_sidebar.png")} alt=""/>Race #{row.race_number}</div>
                        <div className={"date " + row.contractid} number={1}>{(moment(parseInt(row.date,10) * 1000).format('DD MMM YYYY')).toString()}
                            <br/>
                            <span className={"hour  " + row.contractid} number={1}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                        </div>
                        <div className={"status-race-sidebar " + row.contractid} number={1}>Status
                            <span className={"status_race_value closed " + row.contractid} number={1}>{row.active}</span>
                        </div>
                        <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600}{ row.race_duration/3600>1 ? <span className="duration_race_value">hours</span> : <span className="duration_race_value">hour</span> }</span></div>
                    </div>)
                }))

                const NonParticipatedButtons = (non_participated_contracts.map((row) => {
                    return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left','paddingBottom':'3%'}} number={2}>
                        <div class={"raceId "+ row.contractid}><img class={"flag-icon-sidebar "+ row.contractid} src={require("./assets/flag_icon_sidebar.png")} alt=""/>Race #{row.race_number}</div>
                        <div className={"date " + row.contractid} number={2}>{(moment(parseInt(row.date,10) * 1000).format('DD MMM YYYY')).toString()}
                            <br/>
                            <span className={"hour  " + row.contractid} number={2}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                        </div>
                        <div className={"status-race-sidebar " + row.contractid} number={2}>Status
                            <span className={"status_race_value closed " + row.contractid} number={2}>{row.active}</span>
                        </div>
                        <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} className="duration_icon_sidebar" alt=""/>Duration : <span className="duration_race_value">{row.race_duration/3600}{ row.race_duration/3600>1 ? <span className="duration_race_value">hours</span> : <span className="duration_race_value">hour</span> }</span></div>
                    </div>)
                }))

                return (<div>
                    <Accordion.Title active={true} number={0} index={0}  style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                        <span style={{textAlign:'left'}} number={0}>&nbsp;&nbsp;&nbsp;Active Races</span>
                    </Accordion.Title>
                    <Accordion.Content active={true} number={0} content={ActiveButtons}/>

                    <Accordion.Title active={this.state.activeIndex === 0} number={0} index={0}  onClick={this.handleClick} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                        <span style={{textAlign:'left'}} number={0}><Icon name='dropdown'/> Participated Races</span>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 0} number={0} content={ParticipatedButtons}/>

                    <Accordion.Title active={this.state.activeIndex === 1} number={1} index={1}  onClick={this.handleClick} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                        <span style={{textAlign:'left'}} number={1}><Icon name='dropdown'/> Non Participated Races</span>
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === 1} number={1} content={NonParticipatedButtons}/>
                </div>);
            }
            return (<div/>)
        }
    }
