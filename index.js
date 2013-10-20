var Presence = require('ninja-presence-base');

module.exports = Presence;

Presence.prototype.G = 'pingpresence';
Presence.prototype.V = 0;
Presence.prototype.D = 261; //used the WIFI AP presence driver ID.... I will change this in the future
Presence.prototype.name = 'Presence - Lan Ping';

Presence.prototype.init = function() {
	//you should edit this line for devices you would like to ping.
	//this._hosts = ['192.168.96.160','192.168.96.161'];
	this._opts.hosts = this._opts.hosts || {};
	
	this._ping = require ("ping");
	
// 	//Print default settings
// 	this._app.log.info('Scan delay: '+this._opts.scanDelay);
// 	this._app.log.info('Timeout: '+this._opts.timeout);
	
	this._opts.scanDelay = this._opts.scanDelay || 20*1000; //Default scanDelay
	this._opts.timeout = this._opts.timeout || 5*60*1000; //Default timeout
	
	//Print current settings.
	this._app.log.info('Scan delay: '+this._opts.scanDelay);
	this._app.log.info('Timeout: '+this._opts.timeout);
	//this._state = 'NobodyHome';
	
	//self.emitCurrentState();
	
}

Presence.prototype.scan = function() {
  var self = this;
  for(var ip in self._opts.hosts) {
  	var host = self._opts.hosts[ip];
  	self._ping.sys.probe(host.ip,function(isAlive) {
  		if(isAlive) {
  			self._app.log.info('Ping => ' + host.name +' is up.');
  			self.see({
  				name : host.name,
  				id : host.ip.replace('.','_'),
  				distance:99
  			});
  		} else {
  		
  		}
  	});
  }
/*  //foreach host in the array hosts
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
    	
    	//self.updateState();
    	
    });
  });
  
  //This is added because the dashboard loses the state after a timeout.
  //Better send the status twice then not at all.
  //self.emitCurrentState();
  */
    
  //Tell the system the scan is complete
  self.scanComplete();

};

Presence.prototype.config = function(rpc,cb) {

  var self = this;

	if (!rpc) {
		return cb(null,{"contents":[
			{ "type": "paragraph", "text": "Welcome to the Ping Presence driver!"},
			{ "type": "submit", "name": "General Settings", "rpc_method": "genSettings" },
			{ "type": "paragraph", "text": "Before it works you have to add some devices!"},
			{ "type": "submit", "name": "Add device to ping", "rpc_method": "addModal" },
			
			{ "type":"close", "text":"Close"}
		]});
	}

	switch (rpc.method) {
		case 'addModal':
    		cb(null, {
        	"contents":[
          		{ "type": "paragraph", "text":"Please enter the IP address or the hostname and a nickname of the device to be pinged"},
          		{ "type": "input_field_text", "field_name": "ip", "value": "", "label": "IP/Hostname", "placeholder": "x.x.x.x", "required": true},
          		{ "type": "input_field_text", "field_name": "name", "value": "", "label": "Name", "placeholder": "Device X", "required": true},
          		{ "type": "submit", "name": "Add", "rpc_method": "add" },
          		{ "type":"close", "text":"Cancel"}
        	]
      	});
      	break;
    case 'add':
      var devOptions = {"ip": rpc.params.ip, "name": rpc.params.name}
      self._opts.hosts[rpc.params.ip] = devOptions;
      self.save();
      //self.add(devOptions);
      cb(null, {
        "contents": [
          { "type":"paragraph", "text":"Device at " + rpc.params.ip + " with options (name : " + rpc.params.name + ") will be pinged starting today."},
          { "type":"close", "text":"Close"}
        ]
      });
      break;
    case 'genSettings':
      cb(null, {
        "contents": [
          { "type":"paragraph", "text":"Set the general settings of the Ping Presence driver here according to your wishes"},
          { "type": "input_field_text", "field_name": "scanDelay", "value": (self._opts.scanDelay/1000), "label": "Scan delay in seconds", "placeholder": "20", "required": true},
          { "type": "input_field_text", "field_name": "timeout", "value": (self._opts.timeout/1000), "label": "Timeout in seconds", "placeholder": "300", "required": true},
          { "type": "submit", "name": "Save", "rpc_method": "saveSettings" },
          { "type":"close", "text":"Cancel"}
        ]
      });
      break;
  	case 'saveSettings':
      console.log('New scandelay '+rpc.params.scanDelay+' and timeout '+rpc.params.timeout);
      self._opts.scanDelay = (rpc.params.scanDelay *1000);
      self._opts.timeout = (rpc.params.timeout *1000);
      self.save();
      //self.add(devOptions);
      cb(null, {
        "contents": [
          { "type":"paragraph", "text":"New settings saved"},
          { "type":"paragraph", "text":"Scan Delay => " + rpc.params.scanDelay + " Timeout " + rpc.params.timeout},
          { "type":"paragraph", "text":"Timeout => " + rpc.params.timeout},
          { "type":"close", "text":"Close"}
        ]
      });
      break;
    default:
      log('Unknown rpc method', rpc.method, rpc);
  }
};


/*
//I know this actually should be in the base driver, but this is the easiest way for now.
Presence.prototype.updateState = function(){
	var self = this;
  	
  	//Get the number of objects in the timeout list.
  	//Device get added and removed by the ninja-presence-base driver
  	var aantal = Object.keys(self._timeouts).length;
  	self._app.log.info('Ping => Number device online: ' + aantal);
  	
  	
  	if(aantal == 0)
  {
  	self.actuateState('NobodyHome');
  } else if( aantal == self._hosts.length) 
  {
  	self.actuateState('EverybodyHome');
  } else 
  {
  	self.actuateState('SomeoneHome');
  }
	
	
};

Presence.prototype.emitCurrentState = function(){
	var self = this;
	self.emitState(self._state);
};

//I know this actually should be in the base driver, but this is the easiest way for now.
Presence.prototype.emitState = function(state){
	var self = this;
	
	//Remember the old ID
	var tempD = self.D;
	//Set the Driver ID to 244 (generic state driver)
	self.D = 244;
	
	//Send the new state to the Cloud
	self.emit('data' ,state);
  		
	//Set the driver ID back to the regular ID
	self.D = tempD;
	
};

Presence.prototype.actuateState = function(newState) {
	var self = this;
	//Check if the state has change since the last time it fired.
	//So we don't send out a 'new' state if it is the same as the last state.
	if(self._state != newState)
	{
	
		//Log the state change
  		self._app.log.info('Ping => State changed from '+ self._state + ' to '+newState);
  		//Save the new state so we can compare it.
  		self._state = newState;
  		self.emitState(newState);
  	}
}
*/