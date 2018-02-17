import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import {Button} from 'reactstrap';
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
        console.log("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract")
        let val = fetch("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract", {
            method: 'GET',
            headers: {
                to: this.props.date,
                from: this.props.date - 604800,
                currentTime: this.props.currentTime
            }
        }).then(function(contracts) {
            contracts.json().then(function(value) {
                self.setState({contract: value})
                if (value.length > 0 && self.props.number === 0) {
                    document.getElementById(value[0].contractid).classList='live_race '+document.getElementById(value[0].contractid).classList;
                    // console.log(value[0].contractid)
                    self.props.initiate(value[0].contractid)
                }
            })
        })
        return val;
    }
    componentWillMount() {
        this.getContract();
    }
    handleClick = (e, titleProps) => {

        const {index} = titleProps
        const {activeIndex} = this.props.parentState
        const newIndex = this.props.parentState.state.activeIndex === index? -1: index
        this.props.parentState.setState({activeIndex: newIndex})
    }
    updateContract(contract) {
        this.props.contractUpdate(contract);
    }
    render() {

        if (this.state.contract !== null && this.state.contract.length !== 0) {
            var contractjson = this.state.contract;
            const Buttons = (contractjson.map(row => <div class={"race " + row.contractid} id={row.contractid} key={row.contractid} onClick={(event) => this.updateContract(event)} style={{textAlign:'left'}}>
                <ul class={row.contractid}>
                    <li class={"days_number " + row.contractid}>
                        <span class={row.contractid}>{(moment(parseInt(row.date) * 1000).format('DD')).toString()}</span>
                    </li>
                    <li class={"date " + row.contractid}>{(moment(parseInt(row.date) * 1000).format('dddd, MMM YYYY')).toString()}
                        <br/>
                        <span class={"hour  " + row.contractid}>{(moment(parseInt(row.date) * 1000).format('HH:SS')).toString()}</span>
                    </li>
                </ul>
                <div class={"status-race-sidebar " + row.contractid}>Status
                    <span class={"status_race_value live " + row.contractid}>{row.active}</span>
                </div>
            </div>))

            return (<div>
                <Accordion.Title active={this.props.parentState.state.activeIndex === this.props.number} index={this.props.number}  onClick={this.handleClick} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                    <span style={{textAlign:'left'}}><Icon name='dropdown'/> {this.props.title}</span>
                </Accordion.Title>
                <Accordion.Content active={this.props.parentState.state.activeIndex === this.props.number} content={Buttons}/>
            </div>);
        }
        return (<div/>)
    }
}
