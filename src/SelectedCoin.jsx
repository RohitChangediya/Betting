import React from 'react';

export default class SelectedCoin extends React.Component{

    render(){
        if(this.props.coin==="ETH"){
            return (<div>
                        <img alt="" className='crypto-img' src={require('./assets/ethereum.png')}/>
                        <div className="crypto text-center">Ethereum</div>
                    </div>);
        }
        else if(this.props.coin==="BTC"){
            return (<div>
                        <img alt="" className='crypto-img' src={require('./assets/bitcoin.png')}/>
                        <div className="crypto text-center">Bitcoin</div>
                    </div>);
        }
        else if(this.props.coin==="LTC"){
            return (<div>
                        <img alt="" className='crypto-img' src={require('./assets/litecoin.png')}/>
                        <div className="crypto text-center">Litecoin</div>
                    </div>);
        }
        return (<div><p className="text-center selected-coin">Select a coin.</p></div>);
    }
}
