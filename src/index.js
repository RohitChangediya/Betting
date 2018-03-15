import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'semantic-ui-css/semantic.min.css';
import './css/left-panel.css';
import './css/right-panel.css';
import './css/style.css';
import './css/modal-box.css';
import './css/anim.css';

import registerServiceWorker from './registerServiceWorker';
import Warning from './Warning'

var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider);

if (web3.currentProvider != null) {
    ReactDOM.render(<App/>, document.getElementById('root'));
} else {
    ReactDOM.render(<Warning/>, document.getElementById('root'));
}
registerServiceWorker();
