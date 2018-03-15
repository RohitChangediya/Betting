import React from 'react';
import $ from 'jquery';


export default class NextRaceModal extends React.Component{
    constructor(props){
      super(props);
      this.convertMS=this.convertMS.bind(this);
    }
    componentDidMount(){

      $(".modal-button-close").click(function(){
        $(".modal-box-container").removeClass("modal-box-container-reveal");
        $(".modal-box").removeClass("modal-box-slide");
    });
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

    render(){
      return(<div class="modal-box-container">
          		<div class="modal-box">
          			<div class="modal-icon text-center"><img src={require("./assets/Orion_deadline.png")} alt=""/></div>
          			<div class="text-center modal-text">Next race starts in <span class="hr">{this.convertMS(this.props.epoch_time)}</span> </div>
          			<button class="btn modal-button-close mx-auto d-block">Close</button>
          		</div>
          	</div>
            );

    }
}
