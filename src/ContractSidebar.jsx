import React, {Component} from 'react';

import ethorsejson from './ETHorse.json';
import addressjson from './Address.json';
import WeekList from './WeekList'
import {Accordion} from 'semantic-ui-react'
import UpcomingRaces from './UpcomingRaces'
import NextRaceModal from './NextRaceModal'
import $ from 'jquery';

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
            activeIndex: 0,
            upcomingDate:0
        };
        this.handleChange = this.handleChange.bind(this);
        this.updateUpcoming=this.updateUpcoming.bind(this);
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
        if (this.state.classActive === false) {
            if(this.state.contract!==undefined)
                document.getElementById(this.state.contract).classList.remove('bettingOpen');
             this.setState({classActive: true});
        }

        console.log("updating mle link");
        console.log("race#: ",event.target);
        this.props.setRaceNumber(event.target.className.split('#').slice(-1)[0]);

        var eventClassName =  event.target.className.split('#').slice(0)[0].split(' ').slice(-1)[0];
        if(eventClassName.startsWith("0x")){
        this.setState({prevActive: event.target});
        // event.target.className = "btn btn-link btn-active";
        if(this.state.prevActive!==null)
            document.getElementById(this.state.prevActive).classList.remove('bettingOpen');
        this.setState({
            prevActive: eventClassName
        });
        document.getElementById(eventClassName).classList='bettingOpen '+document.getElementById(eventClassName).classList;
        this.props.onContractSubmit(eventClassName);
        }
    }

    initiate(rSelected) {
        if (web3.currentProvider != null){
            this.setState({contract:rSelected.contractid});
            this.props.onContractSubmit(rSelected.contractid);
            // console.log("this props: ",this.props.setRaceNumber);
            this.props.setRaceNumber(rSelected.race_number);
        }
    }
    componentDidMount() {
        // document.getElementById("mle").href="https://mylittleethorse.com/#/race/"+this.state.contractDetails.race_number;
    }
    updateUpcoming(upcomingDate){
      this.setState({upcomingDate},function(){
        $(".modal-box-container").addClass("modal-box-container-reveal");
        $(".modal-box").addClass("modal-box-slide");
      });

    }
    render() {

        return (<div className="left-panel">
          {/* <div style={{
                height: '100%',
                overflow: 'scroll',
                backgroundColor:'#1e2339'
            }}> */}
            <Accordion className="float-left" style={{
                    marginTop: '0'
                }}>
                <UpcomingRaces duration={3600} updateUpcoming={this.updateUpcoming}/>
                <UpcomingRaces duration={86400} updateUpcoming={this.updateUpcoming}/>
                <WeekList title="Recent Races" number={0} date={parseInt((new Date()).getTime() / 1000,10)} contractUpdate={(event) => this.handleChange(event)} parentState={this} initiate={this.initiate.bind(this)} currentTime={parseInt((new Date()).getTime() / 1000,10)}/>
            </Accordion>
        {/* </div> */}
        <NextRaceModal epoch_time={this.state.upcomingDate}/>
        </div>
        )

    }
}
