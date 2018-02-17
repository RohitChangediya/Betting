import React from 'react';

export default class Timer extends React.Component{
    constructor(props){
        super(props);
        this.state={timerHTML:'',targetDate:this.props.targetDate}
        this.countDownCompute=this.countDownCompute.bind(this);
    }
    componentDidMount(){
        if(this.props.targetDate!==''){
            console.log('Check time left')
            this.countDownCompute();
        }
    }
    componentDidUpdate(){
        if(this.state.timerHTML==='')
            this.countDownCompute();
    }
    countDownCompute(){
        console.log('Check time left')
        var countDownDate = parseInt(this.props.targetDate);

        console.log(this.props.targetDate);
        var self=this;
        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get todays date and time
            var now = new Date().getTime();

            // Find the distance between now an the count down date
            var distance = parseInt(countDownDate) - parseInt(now);
            console.log('Distance',distance,countDownDate,now)
            if (distance < 0) {
                console.log('HTML updated');
                clearInterval(x,function(){
                    console.log('Cleared')
                });
                self.setState({ timerHTML:"Race closed for betting.",distance});
            }

            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            if(distance>=0)
                {self.setState({ timerHTML:(hours + "h "
            + minutes + "m " + seconds + "s ")});}

            // If the count down is finished, write some text

        }, 1000);

    }
    render(){
            return(
                <div class="col-sm-12 col-md-8 col-lg-4">
					<img class="header-item-img" src={require("./assets/Orion_stopwatch.png")}/>
					<div class="cb-title remaining text-center">Remaining time before bets are closed.</div>
					<p id="timer" class="text-center">{this.state.timerHTML}</p>
				</div>
            );

    }
}
