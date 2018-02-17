import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import {Button} from 'reactstrap';
import configjson from './config.json'
var moment = require('moment');

export default class UpcomingRaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: null
        };
        this.getContract = this.getContract.bind(this);

    }
    getContract() {
        console.log('contract')
        let self = this;
        let val = fetch("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract/getNextDayRace", {
            method: 'GET'
        }).then(function(contracts) {
            contracts.json().then(function(value) {
                self.setState({contract: value})
            })
        })
        return val;
    }
    componentWillMount() {
        this.getContract();
    }

    render() {

        if (this.state.contract !== null && this.state.contract.length !== 0) {
            var contractjson = this.state.contract;
            console.log(contractjson)
            const Buttons = (contractjson.map(row => <div class="race "id={row.raceDate} key={row.raceDate} style={{textAlign:'left'}}>
                <ul>
                    <li class="days_number ">
                        <span>{(moment(parseInt(row.raceDate) * 1000).format('DD')).toString()}</span>
                    </li>
                    <li class="date">{(moment(parseInt(row.raceDate) * 1000).format('dddd, MMM YYYY')).toString()}
                        <br/>
                        <span class="hour">{(moment(parseInt(row.raceDate) * 1000).format('HH:SS')).toString()}</span>
                    </li>
                </ul>
                <div class="status-race-sidebar">Status
                    <span class="status_race_value upcoming ">{row.status}</span>
                </div>
            </div>))

            return (<div>
                <Accordion.Title active={true} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                    <span style={{textAlign:'left'}}><Icon name='dropdown'/> Upcoming Races</span>
                </Accordion.Title>
                <Accordion.Content active={true} content={Buttons}/>
            </div>);
        }
        return (<div/>)
    }
}
