import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
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
        let self = this;
        let val = fetch("http://"+configjson.serverIP+":"+configjson.serverPort+"/contract/getNextDayRace", {
            method: 'GET'
        }).then(function(contracts) {
            if(contracts.status===204){
                self.setState({contract: []})
            }
            else{
            contracts.json().then(function(value) {
                // console.log(value)
                self.setState({contract: value})
            })
            }
        })
        return val;
    }
    componentWillMount() {
        this.getContract();
    }

    render() {

        if (this.state.contract !== null && this.state.contract.length !== 0) {
            var contractjson = this.state.contract;
            // console.log(contractjson)
            const Buttons = (contractjson.map(row => <div className="race "id={row.raceDate} key={row.raceDate} style={{textAlign:'left'}}>
                <ul>
                    <li className="days_number ">
                        <span>{(moment(parseInt(row.raceDate,10) * 1000).format('DD')).toString()}</span>
                    </li>
                    <li className="date">{(moment(parseInt(row.raceDate,10) * 1000).format('dddd, MMM YYYY')).toString()}
                        <br/>
                        <span className="hour">{(moment(parseInt(row.raceDate,10) * 1000).format('HH:SS')).toString()}</span>
                    </li>
                </ul>
                <div className="status-race-sidebar">Status
                    <span className="status_race_value upcoming ">{row.status}</span>
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
