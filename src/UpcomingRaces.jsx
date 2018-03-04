import React, {Component} from 'react';
import {Accordion} from 'semantic-ui-react';
import configjson from './config.json'
var moment = require('moment');
if (!process.env.REACT_APP_ENVIRONMENT || process.env.REACT_APP_ENVIRONMENT === 'dev') {
    // dev code
    var ip=configjson.testingIP;
} else {
    // production code
    ip=configjson.productionIP;
}
export default class UpcomingRaces extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contract: null
        };
        this.getContract = this.getContract.bind(this);
        this.convertMS = this.convertMS.bind(this);

    }

    componentWillMount() {
        this.getContract();
    }
    convertMS(ms){
      var  h, m, s;
      if(ms<0)
        ms*=-1
      s = Math.floor(ms / 1000);
      m = Math.floor(s / 60);
      s = s % 60;
      h = Math.floor(m / 60);
      m = m % 60;
      h=h+' hrs ';
      m=m+' mins ';
      return h+m;
      }
      getContract() {
          let self = this;
          let val = fetch(ip+"/bridge/getNextRace", {
              method: 'GET',
              headers: {
                  duration:this.props.duration,
                  currentTime:parseInt((new Date()).getTime() / 1000,10)
              }
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
                        <span className="hour">{(moment(parseInt(row.raceDate,10) * 1000).format('HH:mm')).toString()}</span>
                    </li>
                </ul>
                <div className="status-race-sidebar">Status
                    <span className="status_race_value upcoming ">{row.status}</span>
                </div>
                <div className="duration-race-sidebar"><img src={require("./assets/Orion_hour.png")} alt="" className="duration_icon_sidebar"/>Duration : <span className="duration_race_value">{this.props.duration/3600} hours</span></div>
                <div className="start_countdown">Betting opens in {this.convertMS(row.time_remaining)}</div>
            </div>))

            return (<div>
                {/* <Accordion.Title active={true} style={{textAlign:'left',backgroundColor:'#19b5fe'}}>
                    <span style={{textAlign:'left'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Upcoming {this.props.duration/3600} hr Races</span>
                </Accordion.Title> */}
                <Accordion.Content active={true} content={Buttons}/>
            </div>);
        }
        return (<div/>)
    }
}
