'use strict';

var loopback = require('loopback');
var cfenv = require('cfenv');

try {
  var config = require('./config.json');
}
catch(err) {
}

// API application
var app = module.exports = loopback();
var appEnv = cfenv.getAppEnv();
var port = appEnv.isLocal ? config.port : appEnv.port;

app.use('/api', loopback.rest());

app.listen(port, appEnv.bind, () => {
  console.log('App server starting on ' + appEnv.url);
});

// Discord Bot
var Discordie = require("discordie");
var analyze = require('./libs/analyze')
var Events = Discordie.Events;
var client = new Discordie();

client.connect({
  token: process.env.BOT_TOKEN || config.BOT_TOKEN
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected to Discord as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  analyze(e.message);
});
