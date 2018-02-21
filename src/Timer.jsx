import React from 'react';

export default class Timer extends React.Component{
    constructor(props){
        super(props);
        this.state={timerHTML:'',targetDate:this.props.targetDate,compute:false,timer:null}
        this.countDownCompute=this.countDownCompute.bind(this);
        this.timer = 0;
        // this.startTimer = this.startTimer.bind(this);
        // this.countDown = this.countDown.bind(this);
    }
    componentDidMount(){
        if(this.props.targetDate!==''){
            console.log('Mount');
            this.countDownCompute();
        }
    }
    componentDidUpdate(){
        if((this.state.targetDate!==this.props.targetDate || this.props.targetDate==='')){
            console.log('Invoke');
            console.log(this.state.targetDate,this.props.targetDate)
            this.setState({targetDate:this.props.targetDate})
            this.countDownCompute();
        }
    }
    countDownCompute(){
        var countDownDate = parseInt(this.props.targetDate*1000,10);
        console.log(this.props.targetDate)
        var self=this;
        console.log(this.state.targetDate!==this.props.targetDate || this.props.targetDate==='')
        // Update the count down every 1 second
        this.timer = setInterval(function() {

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = parseInt(countDownDate,10) - parseInt(now,10);
            if (parseInt(distance,10) < 0) {
                // console.log(parseInt(1519277268000,10)!==countDownDate,distance);
                clearInterval(self.timer);
                self.setState({ timerHTML:"Race closed for betting.",distance,compute:false});
            }

            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            if(distance>=0)
                {self.setState({ timerHTML:(hours + "h "
            + minutes + "m " + seconds + "s "),compute:false});}

            // If the count down is finished, write some text

        }, 1000);
    // this.setState({timer:x});

    }
    render(){
        if(this.props.targetDate!==''){
            return(
                <div className="col-sm-12 col-md-8 col-lg-4">
					<img alt="" className="header-item-img" src={require("./assets/Orion_stopwatch.png")}/>
					<div className="cb-title remaining text-center">Remaining time before bets are closed.</div>
					<p id="timer" className="text-center">{this.state.timerHTML}</p>
				</div>
            );}
        else{
            return(
                <div className="col-sm-12 col-md-8 col-lg-4">
					<img alt="" className="header-item-img" src={require("./assets/Orion_stopwatch.png")}/>
					<div className="cb-title remaining text-center">Remaining time before bets are closed.</div>
					<p id="timer" className="text-center">No race selected</p>
				</div>
            );
        }

    }
}
