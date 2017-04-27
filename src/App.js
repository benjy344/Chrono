import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Text,
  StatusBar,
  View
} from 'react-native';
import formatTime     from 'minutes-seconds-milliseconds';
import Swiper         from 'react-native-swiper';
class App extends Component {

	constructor(props) {
	    super(props);
	    this.state = { 
	    	timeElapsed: null,
	    	timerIsRunning: false,
	    	startTime: null,
	    	timer: null,
	    	laps: [],
	    	selectedTime: null
	    };
	    this.maxTime = 0;
	}

	render() {
	    return (
	    	<Swiper style={styles.wrapper}
            dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
            paginationStyle={{
              bottom: 70
            }}
            loop={false}>
		    	<View style={styles.container} >
		    		<StatusBar barStyle='light-content' backgroundColor="#242322" />
		    		<View style={styles.header}>
		    			<View style={styles.timerWrapper}>	
				    		<Text style={[styles.text, styles.timer]} >		    				
				    			{ this.setTimer(this.state.timeElapsed) }
				    		</Text>	
		    			</View>		    		
			    		<View style={styles.buttonWrapper}>
				    		{this.StartStopButton()}
				    		{this.ResetButton()}
				    		{this.LapButton()}
			    		</View>   
		    		</View>
		    		<ScrollView style={styles.footer} >
		    			{this.displayLaps()}
		    		</ScrollView>    		
		    	</View>	
		    	<View style={styles.containerResult} >
		    		<StatusBar barStyle='light-content' backgroundColor="#242322" />
		    		<View style={styles.showTime}>
		    			<Text style={styles.textShowTime}>
		    				{this.state.selectedTime ? this.state.selectedTime : ''}
		    			</Text>
		    		</View>		    		
					<View style={styles.resultWrapper}>	
		    			{this.displayLapsTable()}
					</View>		    		  	
		    	</View>	
		    	<View style={styles.containerResult} >
		    		<StatusBar barStyle='light-content' backgroundColor="#242322" />
		    		<View style={styles.showTime}>
		    			<Text style={styles.textShowTime}>
		    				{this.state.selectedTime ? this.state.selectedTime : ''}
		    			</Text>
		    		</View>		    		
					<View style={styles.resultWrapperBottom}>	
		    			{this.displayLapsTable()}
					</View>		    		  	
		    	</View>		    	
		    </Swiper>	    	
	    );

	 }

	 dot() {
	 	return (
	 		<View style={{
	 			backgroundColor:'rgba(0,0,0,.2)',
	 			width: 8, 
	 			height: 8,
	 			borderRadius: 4,
	 			marginLeft: 3, 
	 			marginRight: 3, 
	 			marginTop: 3, 
	 			marginBottom: 3}} ></View>
	 	);
	 }

 	 StartStopButton () {
	  	return (
			<TouchableHighlight 
			underlayColor="#ffffff"
			onPress={() => this.handleStartPress()} 
			style={!this.state.timerIsRunning ? styles.buttonStart : styles.buttonStop} >
				<Text style={styles.text} >
					{this.state.timerIsRunning ? 'STOP' : 'START'}
				</Text>
			</TouchableHighlight>
	  	); 
	}

	LapButton () {
	  	return (
	  		<TouchableHighlight 
	  		underlayColor="#22DDF2" 
	  		onPress={() => this.handleLap()} 
	  		style={styles.buttonLap}>
				<Text style={styles.text} >
					TOUR 
				</Text>
			</TouchableHighlight>
	  	);
	}

	ResetButton () {
	  	return (
	  		<TouchableHighlight 
	  		underlayColor="#F23535" 
	  		onPress={() => this.resetChrono()} 
	  		style={styles.buttonStop}>
				<Text style={styles.text} >
					RESET 
				</Text>
			</TouchableHighlight>
	  	);
	}

	handleLap() {
		if(this.state.timerIsRunning) {

			let lap = this.state.timeElapsed;

			this.setState({ 
				laps : this.state.laps.concat([lap])
			}); 
		}

	}

	resetChrono() {
		clearInterval(this.interval);
		this.setState({
			timeElapsed: null,
	    	timerIsRunning: false,
	    	startTime: null,
	    	laps: []	
		})
		this.maxTime = 0;
	}

	displayLaps () {
		return this.state.laps.map((time, index ) => {
			return <View key={index} style={styles.lap}>
				<Text style={styles.lapText}>Tour n°{index + 1}</Text>
				<Text style={styles.lapText}> {this.setTimer(time)}</Text>
			</View>
		} ).reverse();
	}

	displayLapsTable () {
		return this.state.laps.map((time, index ) => {
			return <TouchableHighlight
				style={[ {height: this.setpercent(time, index)*5}, styles.bar]} 
				underlayColor="#f0f0f0" 
				key={index}				
				onPress={() => this.showTime(time, index)} >
					<View 
						colors={['#C8142F', '#C8C42F', '#C8142F']} 
						key={index} 
						style={[ {height: this.setpercent(time, index)*5}, styles.bar]}>
					</View>
				</TouchableHighlight>
		} );
	}

	showTime(time, index) {
		let currentTime = 0;

		let previousTime = (this.state.laps[index-1] ? this.state.laps[index-1].getTime() : 0);

		currentTime = (time.getTime() - previousTime);
		this.setState({
			selectedTime: formatTime(currentTime)
		})
	}

	setpercent(time, index) {
		
		let currentTime = 0;

		let previousTime = (this.state.laps[index-1] ? this.state.laps[index-1].getTime() : 0);

		currentTime = (time.getTime() - previousTime);

		this.state.laps.map((time, index ) => {						
			this.maxTime = (this.maxTime > currentTime ? this.maxTime : currentTime)
		});
		let percent = Math.round((currentTime/this.maxTime)*100)
		return ( percent )

	}

	handleStartPress() {

		if (this.state.timerIsRunning) {
						
			clearInterval(this.interval);
			this.setState({			
				timerIsRunning: false
			});
			
			return
		} 

		if (this.state.timeElapsed) {
			this.setState({ startTime : new Date() - this.state.timeElapsed }); 
		} else {
			this.setState({ startTime : new Date()});
		}
		

		//never do !!
		// this.state.timeElapsed = new Date()
		//do : 
		this.interval = setInterval( () => {
			this.setState({
				timeElapsed: 	new Date(new Date() - this.state.startTime),
				timerIsRunning: true
			});	
		}, 30);
		
	}

	setTimer(time) {
		if (time != null && time > 0 ) {
			let msec = (time.getMilliseconds()) - 30;
		    let sec  = time.getSeconds()
		    let min  = time.getMinutes()
		    if (msec < 0 ) msec = 0;
		    if (min < 10){
		        min = "0" + min
		    }
		    if (sec < 10){
		        sec = "0" + sec
		    }
		    if(msec < 10){
		        msec = "00" +msec
		    }
		    else if(msec < 100){
		        msec = "0" +msec
		    }
		    let output = min + ":" + sec + "." + msec;
		    return  output.substring(0,output.length-1)
		} else {
			return '00:00.00'
		}
	}
}

const styles = StyleSheet.create({
  	container: {
  		flex:            1, 
  		alignItems: 	'stretch',
  		padding:         10,
  		backgroundColor: '#17182D'  		
  	}, 
  	text: {
  		color: "#fff",
  		fontFamily:'Avenir'  		
  	},
  	header: {
  		flex: 1
  	},
  	footer: {
		flex: 1
  	},
  	timerWrapper: {
  		flex:           5,
  		justifyContent: 'center',
  		alignItems:     'center'
  	},
  	buttonWrapper: {
  		flex:           3,
  		flexDirection:  'row',
  		justifyContent: 'space-around',
  		alignItems:     'center'
  	},
  	timer: {
  		fontSize: 60
  	},
  	buttonLap: {
  		borderWidth:      1,
  		borderColor: 	 '#22DDF2',
  		height:          50,
  		width:           100,
  		borderRadius:    50,
  		justifyContent: 'center',
  		alignItems :     'center'
  	},
  	buttonStart: {
  		borderWidth:      1,
  		borderColor: 	 '#1CF20A',
  		height:          50,
  		width:           100,
  		borderRadius:    50,
  		justifyContent:  'center',
  		alignItems :     'center'
  	},
  	buttonStop: {
  		borderWidth:      1,
  		borderColor: 	 '#F23535',
  		height:          50,
  		width:           100,
  		borderRadius:    50,
  		justifyContent: 'center',
  		alignItems :    'center'
  	},
  	lap : {
  		justifyContent:   'space-around',
  		flexDirection:    'row',
  		borderWidth:      1,
  		borderColor: 	  '#fff',
  		borderRadius:     50,
  		padding: 		  10,
  		margin:           10
 
  	},
  	lapText: {
  		fontSize:         20,
  		color:    	      '#fff'
   	},
   	containerResult: {
   		backgroundColor: '#17182D',
   		flex:            1, 
  		alignItems: 	'center',
  		padding:         10
   	},
   	showTime: {
   		flex:1,
   		alignItems: 'center',
   		justifyContent: 'flex-end'
   	},
   	resultWrapper: {
		flexDirection: 'row', 
		flex: 7,
		alignItems: 'center'		
   	},
   	resultWrapperBottom: {
		flexDirection: 'row', 
		flex: 7,
		alignItems: 'flex-end'		
   	},
   	bar: {
   		flex:1,
   		borderWidth: 1,
   		borderColor: '#17182D',
   		backgroundColor: '#88E3E7'
   	},
   	preview: {
	    flex: 1,
	    justifyContent: 'flex-end',
	    alignItems: 'center'
  	},
  	textShowTime:{
  		fontSize:         25,
  		color:    	      '#fff'
  	}
  	
});

export default App;