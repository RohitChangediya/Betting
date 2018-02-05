import React, {Component} from 'react';
import {Accordion, Icon} from 'semantic-ui-react';
import {Button} from 'reactstrap';
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
        let val = fetch("http://localhost:3000/contract", {
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
            const Buttons = (contractjson.map(row => <Button id={row.contractid} color="link" key={row.contractid} onClick={(event) => this.updateContract(event)}>
                {(moment(parseInt(row.date) * 1000).format('ddd, DD MMM YYYY, HH:SS')).toString()}
            </Button>))

            return (<div>
                <Accordion.Title active={this.props.parentState.state.activeIndex === this.props.number} index={this.props.number} style={{
                        color: 'white'
                    }} onClick={this.handleClick}>
                    <Icon name='dropdown'/> {this.props.title}
                </Accordion.Title>
                <Accordion.Content active={this.props.parentState.state.activeIndex === this.props.number} content={Buttons}/>
            </div>);
        }
        return (<div/>)
    }
}
