import React from 'react';


export default class Amount extends React.Component {
    constructor(props) {
        super(props);
        this.state={value:0.1}
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        console.log(event.target.value)
        this.setState({value:event.target.value})
        this.props.onValueSubmit(event.target.value);
    }
    render() {
        return (
            <div>
            <img alt="" className="header-item-img" src={require("./assets/Orion_coins.png")}/>
              <div className="cb-title amount text-center">Amount to Bet</div>

              <div className="form-inline justify-content-center">
                  <input type="number" className="form-control amount-input mx-auto d-block text-center" id="amount" value={this.state.value} step="0.01" max="1" min="0.1" title="Enter the amount to bet in ether" onChange={this.handleChange}/>
                  <div className="eth text-center mx-auto d-block"><img alt="" className="eth-logo" src={require("./assets/eth.png")}/> ETH</div>
              </div>
          </div>);
    }
}
