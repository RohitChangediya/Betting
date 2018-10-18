import React from 'react';

export default class Timer extends React.Component{
    constructor(props){
        super(props);
        this.state={timerHTML:'',targetDate:this.props.targetDate,compute:false,timer:null,progress:0}
        this.countDownCompute=this.countDownCompute.bind(this);
        this.timer = 0;
    }
    componentDidMount(){
        if(this.props.targetDate!==''){
            this.countDownCompute();
        }
    }
    componentDidUpdate(){
        let self=this;
        if((parseInt(this.state.targetDate,10)!==parseInt(this.props.targetDate,10) || this.props.targetDate==='')){
            clearInterval(this.timer);
            this.setState({targetDate:this.props.targetDate},function(){
            self.countDownCompute();
            })

        }
    }
    countDownCompute(){
        var countDownDate = parseInt(this.props.targetDate*1000,10);
        var self=this;

        this.timer = setInterval(function() {

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = parseInt(countDownDate,10) - parseInt(now,10);
            if (parseInt(distance,10) < 0) {
                // console.log(self.props.bet_phase);
                if (self.props.bet_phase=="Betting closes in"){
                    clearInterval(self.timer);
                    self.setState({ timerHTML:"<div class=\"race_details\">Betting closed</div>",distance,compute:false,progress:100+'%'});
                } else if (self.props.bet_phase=="Race ends in" ) {
                    clearInterval(self.timer);
                    self.setState({ timerHTML:"<div class=\"race_details\">Race complete</div>",distance,compute:false,progress:100+'%'});
                } else if ( self.props.bet_phase=="Race complete") {
                    clearInterval(self.timer);
                    self.setState({ timerHTML:"<div class=\"race_details\">Race ended</div>",distance,compute:false,progress:100+'%'});
                }
                self.props.updateRace();
            }

            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            let progress=0
            if((self.props.targetDate-self.props.timerStart)>0)
                progress=(100-((distance)/((self.props.targetDate-self.props.timerStart)*1000))*100)+'%';
            // Display the result in the element with id="demo"
            if(distance>=0)
                {self.setState({ timerHTML:(hours + "h "
            + minutes + "m " + seconds + "s "),compute:false,progress});}

            // If the count down is finished, write some text
            // console.log(progress);
            // if ((100-((distance)/((self.props.targetDate-self.props.timerStart)*1000))*100)>=100) {
            //     clearInterval(self.timer);
            //     self.setState({ timerHTML:"<div class=\"race_details\">Betting closed</div>",distance,compute:false,progress:100+'%'});
            // }

        }, 1000);
    // this.setState({timer:x});

    }
    render(){
        if(this.props.targetDate!==''){
            return(
                <div className="col-sm-12 col-md-8 col-lg-4">
					<img alt="" className="header-item-img" src={require("./assets/Orion_stopwatch.png")}/>
					<div className="cb-title remaining text-center">{this.props.bet_phase}</div>
					<p id="timer" className="text-center" dangerouslySetInnerHTML={{__html: this.state.timerHTML}} style={{marginTop: '17px'}}></p>
                    <div className="progress">
						<div className="progress-bar" role="progressbar" aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax="100" style={{"width":this.state.progress}}></div>
					</div>
                    <div>
                        <p className="cb-title text-center" style={{fontSize:"12px",marginTop: '10px'}}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEqSURBVDhPhZKxSgNBFEVX3ASbDRgsF4KNXxAhRbAWxdZvCFbW6ZNG8CdM/IXEwsJWsTE/4A+olZgi2c15Mzc7DGzwwOXtu+9ddobdpI6iKLKyLPvUK3TKc6rRblg8RlO0JFBB/41GKNNqDIMzW9J+LcwXKFfEg9FBP9qpwLtFQ7UO+ndKQ1EXfvSjAN6KckTNvRPAu9kGWyi64xZ8u2vdiV5dmOe+twIMn1EPnaBP2RV4a0pqb770Vgz+nU72JCsCv23DrvoI/GvKPvXLOwG8P8qeHbtBE92L3mijnqwI/Lm7s0Ezlu+g/6XYW7voxbsBvAtFXThDH5o56GfoHi1kOegfFAtg5sh+gJ0wn1AOFIlh0GRhgN6QfQ4LLNEcnWvtf8il6FBtDUmyAZEHd1AXrFh0AAAAAElFTkSuQmCC"/>
                            &nbsp;Bets are matched up to 10 minutes before bets closing time.
                        </p>
                    </div>
                    <div className="btn-container text-center">
                        <a href={"https://mylittleethorse.com/#/race/"+this.props.raceNumber} target="_blank" id="mle">
                            <button type="button" className="btn place-bet-button center-block text-center" value="View Race">
                                {/* <img class="place-bet-icon" src={require("./assets/Orion_online-payment.png")}/>  */}
                                View Race
                            </button>
                        </a>
                    </div>
				</div>
            );}
        else{
            return(
                <div className="col-sm-12 col-md-8 col-lg-4">
					<img alt="" className="header-item-img" src={require("./assets/Orion_stopwatch.png")}/>
					<div className="cb-title remaining text-center">Remaining time before bets are closed</div>
					<p id="timer" className="text-center">No race selected</p>
				</div>
            );
        }

    }
}
