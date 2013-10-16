ninja-presence-ping
===================

This is a ping presence driver for your own Ninja Block (http://ninjablocks.com)

To install the easy way you'll need the ninja toolbelt. (https://github.com/ninjablocks/ninja-toolbelt for instructions)

install commando: `ninja install https://github.com/svrooij/ninja-presence-ping`

You should edit the index.js file to include the hosts it should ping. It is high up my list to enable configuration with the settings!!

This driver will create two devices, one with the raw data as devices respond to a ping. And one generic state device with three states, 'NobodyHome' , 'SomeoneHome' , 'EverybodyHome'. 
So you should be able to use those in your rules!!

After enabling this driver a Generic state device should show up, but it won't have any states (i don't know how to create them) but if you create them manually you should be able to use them, and they should start changing state automaticly.

For everyone who likes this driver, you can also use this widget (https://gist.github.com/svrooij/6974775)

*************
To-do
=====

- [x] Create a [gist](https://gist.github.com/svrooij/6974775) for display
- [x] Add state device for using the presence in the rules engine
- [ ] Enable configuration of host trough the settings, instead of the 'edit the index.js file' way
- [ ] Rewrite the sub driver
- [ ] Add a device per host, for even better control of the rules
