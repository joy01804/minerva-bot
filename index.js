'use strict';

var loopback = require('loopback');
var cfenv = require('cfenv');
var request = require('request-promise');

try {
  var config = require('./config.json');
}
catch(err) {
}


// API application
var app = module.exports = loopback();
var appEnv = cfenv.getAppEnv();

app.use('/api', loopback.rest());

app.listen(appEnv.port, appEnv.bind, () => {
  console.log('App server starting on ' + appEnv.url);
});

// Discord Bot
var Discordie = require("discordie");
var analyze = require('./libs/analyze');
var Events = Discordie.Events;
var client = new Discordie();

client.connect({
  token: process.env.BOT_TOKEN || config.BOT_TOKEN
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected to Discord as: " + client.User.username);

  request.post({
    url: 'https://cleverbot.io/1.0/create',
    body: {
      user: process.env.CLEVERBOT_USER || config.CLEVERBOT_USER,
      key: process.env.CLEAVERBOT_KEY || config.CLEAVERBOT_KEY,
      nick: client.User.username
    },
    json: true
  })
  .then(body => {
    if(body.nick) {
      console.log('Connected to CleverBot with session id: ' + body.nick);
    }
    else {
      console.log(body.status);
    }
  })
  .catch(err => {
    console.error(err.error.status || err);
  });
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  analyze(e.message, client.User.id);
});