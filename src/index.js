import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import registerServiceWorker from './registerServiceWorker';
import Header from './Header'
import RGBColor from 'rgbcolor'
import $ from 'jquery'

ReactDOM.render(<Header />, document.getElementById('header'));
ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<h3>Copyright</h3>, document.getElementById('footer'));
/*var colorProperties = ['color', 'background-color'];
$("*").each(function() {
    var color = null;

    for (var prop in colorProperties) {
        prop = colorProperties[prop];

        //if we can't find this property or it's null, continue
        if (!$(this).css(prop)) continue;

        //create RGBColor object
        color = new RGBColor($(this).css(prop));

        if (color.ok) {
            //good to go, let's build up this RGB baby!
            //subtract each color component from 255
            $(this).css(prop, 'rgb(' + (250 - color.r) + ', ' + (255 - color.g) + ', ' + (255 - color.b) + ')');
        }
        color = null; //some cleanup
    }
});*/
registerServiceWorker();
