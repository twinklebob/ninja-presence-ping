var Presence = require('ninja-presence-base');

module.exports = Presence;

Presence.prototype.G = 'pingpresence';
Presence.prototype.V = 0;
Presence.prototype.D = 261; //used the WIFI AP presence driver ID.... I will change this in the future
Presence.prototype.name = 'Presence - Lan Ping';

Presence.prototype.init = function() {
	//you should edit this line for devices you would like to ping.
	this._hosts = ['192.168.96.160','192.168.96.161'];
	
	this._ping = require ("ping");
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
    			id: host,
    			distance: 99
    		});
    	} else {//not responding to ping
    		//write something to the log
    		self._app.log.info('Ping => ' + host +' is not responding.');
    	}
    	
    });
  });
  
  //Tell the system the scan is complete
  self.scanComplete();

};
