import React, {Component} from 'react';

import ethorsejson from './ETHorse.json';
import addressjson from './Address.json';
import WeekList from './WeekList'
import {Accordion} from 'semantic-ui-react'

var moment = require('moment');

var Web3 = require('web3');
var contract = require("truffle-contract");

var web3 = new Web3(Web3.givenProvider);

var myContract = contract(ethorsejson);

if (web3.currentProvider != null) {
    myContract.setProvider(web3.currentProvider);
}

export default class ContractSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timejson: [],
            currentTime: "Change Races",
            duplicatejson: {},
            prevActive: null,
            classActive: false,
            activeIndex: 0
        };
        this.handleChange = this.handleChange.bind(this);
    }
    getDate(address) {
        let self = this;
        var start_time_utc = null;
        var result_time_utc = null;

        myContract.at(address).then(function(instance) {
            instance.starting_time().then(function(start_time) {
                start_time = parseInt(start_time, 10)
                start_time_utc = new Date(start_time * 1000);
                instance.race_duration().then(function(race_duration) {
                    race_duration = parseInt(race_duration, 10)
                    result_time_utc = new Date((start_time + race_duration) * 1000)
                    let start_time_utc_display = moment(start_time_utc).format('ddd, DD MMM YYYY, HH:SS')
                    var temp_json = {
                        "address": address,
                        "start_time": start_time_utc_display,
                        "start_time_sort": start_time_utc,
                        "end_time": result_time_utc
                    }
                    self.state.timejson.push(temp_json)
                    self.state.duplicatejson[address] = start_time_utc.toString()
                })
                if (address === addressjson.addresses[0].address) {
                    self.setState({currentTime: start_time_utc.toString()});
                }
            })
        })
    }

    handleChange(event) {
        // if (this.state.prevActive != null) {
        //     this.state.prevActive.className = "btn btn-link";
        // }
        // if (this.state.classActive === false) {
        //     document.getElementById(this.state.contract).classList='live_race '+document.getElementById(this.state.contract).classList;
        //      this.setState({classActive: true});
        // }

        // console.log(event.target.className.split(' ').slice(-1)[0].startsWith("0x"))
        // console.log(event.target.name)
        if(event.target.className.split(' ').slice(-1)[0].startsWith("0x")){
        this.setState({prevActive: event.target});
        // event.target.className = "btn btn-link btn-active";
        if(this.state.prevActive!==null)
            document.getElementById(this.state.prevActive).classList.remove('live_race');
        this.setState({
            prevActive: event.target.className.split(' ').slice(-1)[0]
        });
        document.getElementById(event.target.className.split(' ').slice(-1)[0]).classList='live_race '+document.getElementById(event.target.className.split(' ').slice(-1)[0]).classList;
        this.props.onContractSubmit(event.target.className.split(' ').slice(-1)[0]);
        }
    }

    initiate(rSelected) {
        this.setState({contract:rSelected});
        this.props.onContractSubmit(rSelected);
    }

    render() {

        return (<div class="left-panel"><div style={{
                height: '100%',
                overflow: 'scroll',
                backgroundColor:'#1e2339'
            }}>
            <Accordion className="float-left" style={{
                    marginTop: '0'
                }}>
                <WeekList title="Week 1" number={0} date={parseInt((new Date).getTime() / 1000)} contractUpdate={(event) => this.handleChange(event)} parentState={this} initiate={this.initiate.bind(this)} currentTime={parseInt((new Date).getTime() / 1000)}/>
                <WeekList title="Week 2" number={1} date={parseInt((new Date).getTime() / 1000) - 604800} contractUpdate={(event) => this.handleChange(event)} parentState={this} currentTime={parseInt((new Date).getTime() / 1000)}/>
                <WeekList title="Week 3" number={2} date={parseInt((new Date).getTime() / 1000) - 604800 * 2} contractUpdate={(event) => this.handleChange(event)} parentState={this} currentTime={parseInt((new Date).getTime() / 1000)}/>
                <WeekList title="Week 4" number={3} date={parseInt((new Date).getTime() / 1000) - 604800 * 3} contractUpdate={(event) => this.handleChange(event)} parentState={this} currentTime={parseInt((new Date).getTime() / 1000)}/>
            </Accordion>
        </div>
        </div>
        )

    }
}
