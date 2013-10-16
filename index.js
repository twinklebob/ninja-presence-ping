var Presence = require('ninja-presence-base');

module.exports = Presence;

Presence.prototype.G = 'pingpresence';
Presence.prototype.V = 0;
Presence.prototype.D = 261; //used the WIFI AP presence driver ID.... I will change this in the future
Presence.prototype.name = 'Presence - Lan Ping';

Presence.prototype.init = function() {
	//you should edit this line for devices you would like to ping.
	this._hosts = ['iPhone-Stephan','iPhone-Alrieke'];
	
	this._ping = require ("ping");
	
// 	//Print default settings
// 	this._app.log.info('Scan delay: '+this._opts.scanDelay);
// 	this._app.log.info('Timeout: '+this._opts.timeout);
	
	this._opts.scanDelay = 20*1000;
	this._opts.timeout = 5*60*1000;
	
	//Print current settings.
	this._app.log.info('Scan delay: '+this._opts.scanDelay);
	this._app.log.info('Timeout: '+this._opts.timeout);
	this._state = 'NobodyHome';
}

Presence.prototype.scan = function() {
  var self = this;

  //foreach host in the array hosts
  self._hosts.forEach(function(host){
    self._ping.sys.probe(host, function(isAlive){
    	if(isAlive) { //If it is online
    		//Write something to log
    		self._app.log.info('Ping => ' + host +' is up.');
    		
    		//Fire see, this should notify the system.
    		self.see({
    			name: host,
    			id: host.replace('.','_'), //dots should not be just in the ID, so we replace it.
    			distance: 99
    		});
    	} else {//not responding to ping
    		//write something to the log
    		//self._app.log.info('Ping => ' + host +' is not responding.');
    	}
    	
    	self.updateState();
    	
    });
  });
  
  
    
  //Tell the system the scan is complete
  self.scanComplete();

};

//I know this actually should be in the base driver, but this is the easiest way for now.
Presence.prototype.updateState = function(){
	var self = this;
  	
  	//Get the number of objects in the timeout list.
  	//Device get added and removed by the ninja-presence-base driver
  	var aantal = Object.keys(self._timeouts).length;
  	self._app.log.info('Ping => Number device online: ' + aantal);
  	
  	
  	if(aantal == 0)
  {
  	self.emitState('NobodyHome');
  } else if( aantal == self._hosts.length) 
  {
  	self.emitState('EverybodyHome');
  } else 
  {
  	self.emitState('SomeoneHome');
  }
	
	
};

//I know this actually should be in the base driver, but this is the easiest way for now.
Presence.prototype.emitState = function(newState){
	var self = this;
	
	//Check if the state has change since the last time it fired.
	//So we don't send out a 'new' state if it is the same as the last state.
	if(self._state != newState) {
		//Remember the old ID
		var tempD = self.D;
		//Set the Driver ID to 244 (generic state driver)
		self.D = 244;

  		//Log the state change
  		self._app.log.info('Ping => State changed from '+ self._state + ' to '+newState);
  		//Save the new state so we can compare it.
  		self._state = newState;
  		
  		//Send the new state to the Cloud
  		self.emit('data' ,newState);
  		
  		//Set the driver ID back to the regular ID
  		self.D = tempD;
	}
};
