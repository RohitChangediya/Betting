import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import configjson from './config.json'
var moment = require('moment');

export default class WeekList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: null
        };
        this.getContract = this.getContract.bind(this);
        this.updateContract = this.updateContract.bind(this);
    }
    getContract() {
        let self = this;
        // console.log("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract")
        let val = fetch("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract", {
            method: 'GET',
            headers: {
                to: this.props.date,
                from: this.props.date - 604800,
                currentTime: this.props.currentTime
            }
        }).then(function(contracts) {
            if(contracts.status===204){
                self.setState({contract: []})
            }
            else{
            contracts.json().then(function(value) {
                self.setState({contract: value})
                if (value.length > 0 && self.props.number === 0) {
                    document.getElementById(value[0].contractid).classList='bettingOpen '+document.getElementById(value[0].contractid).classList;
                    // console.log(value[0].contractid)
                    self.props.initiate(value[0].contractid)
                }
            })
        }
        })
        return val;
    }
    componentWillMount() {
        this.getContract();
    }
    handleClick = (e, titleProps) => {
        const {index} = titleProps
        // const {activeIndex} = this.props.parentState
        const newIndex = this.props.parentState.state.activeIndex === index? -1: index
        this.props.parentState.setState({activeIndex: newIndex})
    }
    updateContract = (contract)=> {
        this.props.contractUpdate(contract);
    }
    render() {

        if (this.state.contract !== null && this.state.contract.length !== 0) {
            var contractjson = this.state.contract;
            const Buttons = (contractjson.map((row) => {if(row.active==="Active"){
                return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left'}} number={this.props.number}>
                <ul className={row.contractid} number={this.props.number}>
                    <li className={"days_number " + row.contractid} number={this.props.number}>
                        <span className={row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('DD')).toString()}</span>
                    </li>
                    <li className={"date " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('dddd, MMM YYYY')).toString()}
                        <br/>
                        <span className={"hour  " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                    </li>
                </ul>
                <div className={"status-race-sidebar " + row.contractid} number={this.props.number}>Status
                    <span className={"status_race_value live " + row.contractid} number={this.props.number}>{row.active}</span>
                </div>
                <div class="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} class="duration_icon_sidebar" alt=""/>Duration : <span class="duration_race_value">{row.race_duration/3600} hours</span></div>
            </div>)
            }
            else if(row.active==="Betting Open"){
                return (<div className={"race live_race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left'}} number={this.props.number}>
                <ul className={row.contractid} number={this.props.number}>
                    <li className={"days_number " + row.contractid} number={this.props.number}>
                        <span className={row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('DD')).toString()}</span>
                    </li>
                    <li className={"date " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('dddd, MMM YYYY')).toString()}
                        <br/>
                        <span className={"hour  " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                    </li>
                </ul>
                <div className={"status-race-sidebar " + row.contractid} number={this.props.number}>Status
                    <span className={"status_race_value open " + row.contractid} number={this.props.number}>{row.active}</span>
                </div>
                <div class="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} class="duration_icon_sidebar" alt=""/>Duration : <span class="duration_race_value">{row.race_duration/3600} hours</span></div>
            </div>)
            }
            else if(row.active==="Closed"){
                return (<div className={"race closed-race " + row.contractid} id={row.contractid} key={row.contractid} onClick={ this.updateContract} style={{textAlign:'left'}} number={this.props.number}>
                <ul className={row.contractid} number={this.props.number}>
                    <li className={"days_number " + row.contractid} number={this.props.number}>
                        <span className={row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('DD')).toString()}</span>
                    </li>
                    <li className={"date " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('dddd, MMM YYYY')).toString()}
                        <br/>
                        <span className={"hour  " + row.contractid} number={this.props.number}>{(moment(parseInt(row.date,10) * 1000).format('HH:mm')).toString()}</span>
                    </li>
                </ul>
                <div className={"status-race-sidebar " + row.contractid} number={this.props.number}>Status
                    <span className={"status_race_value closed " + row.contractid} number={this.props.number}>{row.active}</span>
                </div>
                <div class="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} class="duration_icon_sidebar" alt=""/>Duration : <span class="duration_race_value">{row.race_duration/3600} hours</span></div>
            </div>)
            }
            else{
                return <div/>;
            }
        }))

            return (<div>
                <Accordion.Title active={this.props.parentState.state.activeIndex === this.props.number} number={this.props.number} index={this.props.number}  onClick={this.handleClick} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                    <span style={{textAlign:'left'}} number={this.props.number}><Icon name='dropdown'/> {this.props.title}</span>
                </Accordion.Title>
                <Accordion.Content active={this.props.parentState.state.activeIndex === this.props.number} number={this.props.number} content={Buttons}/>
            </div>);
        }
        return (<div/>)
    }
}
