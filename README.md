ninja-presence-ping
===================

This is a ping presence driver for your own Ninja Block (http://ninjablocks.com)

This driver will create two devices, one with the raw data as devices respond to a ping. And one generic state device with three states, 'NobodyHome' , 'SomeoneHome' , 'EveryoneHome'.
So you should be able to use those in your rules!!

After enabling this driver a Generic state device should show up, but it won't have any states (i don't know how to create them) but if you create them manually you should be able to use them, and they should start changing state automaticly.

For everyone who likes this driver, you can also use this widget (https://gist.github.com/svrooij/6974775)
*************

Easy installation (Ninja toolbelt required)
-------------------------------------------

To install the easy way you'll need the ninja toolbelt. (https://github.com/ninjablocks/ninja-toolbelt for instructions)

install commando: `ninja install https://github.com/svrooij/ninja-presence-ping`

Git installation
----------------

1. SSH to your ninjablock `ssh ubuntu@192.168.?.?` default password `temppwd`
2. Elevate rights `sudo su` and typ the password
3. Go to the correct folder `cd /opt/ninja/drivers`
4. Clone the repository `git clone https://github.com/svrooij/ninja-presence-ping.git`
5. Go to the directory and install the dependencies `cd ninja-presence-ping && npm install`


*************
To-do
=====

- [x] Create a [gist](https://gist.github.com/svrooij/6974775) for display
- [x] Add state device for using the presence in the rules engine
- [x] Enable configuration of host trough the settings, instead of the 'edit the index.js file' way
- [x] Rewrite the sub driver
- [x] Moved main state logic to ninja-presence-base
- [ ] Add a device per host, for even better control of the rules
