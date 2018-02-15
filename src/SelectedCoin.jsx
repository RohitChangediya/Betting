import React from 'react';

export default class SelectedCoin extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(this.props.coin==="ETH"){
            return (<div>
                        <img class='crypto-img' src={require('./assets/ethereum.png')}/>
                        <div class="crypto text-center">Ethereum</div>
                    </div>);
        }
        else if(this.props.coin==="BTC"){
            return (<div>
                        <img class='crypto-img' src={require('./assets/bitcoin.png')}/>
                        <div class="crypto text-center">Bitcoin</div>
                    </div>);
        }
        else if(this.props.coin==="LTC"){
            return (<div>
                        <img class='crypto-img' src={require('./assets/litecoin.png')}/>
                        <div class="crypto text-center">Litecoin</div>
                    </div>);
        }
        return (<div/>);
    }
}
