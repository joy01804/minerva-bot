'use strict';

var swearjar = require('swearjar');
var cool = require('cool-ascii-faces');
var request = require('request-promise');
var fs = require('fs');

try {
  var config = require('../config.json');
}
catch(err) {
}

module.exports = function analyze_message(message, bot_id) {
  legacy(message);
  wushu(message);
  mentions(message, bot_id);
  clean(message);
}

function legacy(message) {
  if (message.content == "ping") {
    message.channel.sendMessage("pong");
  }

  if(message.content.match(/Hatsumi/)) {
    message.channel.sendMessage("Sexy Batman says: Looking for trouble?");
  }
};

function wushu(message) {
  let matches = message.content.match(/(\/\d+)/g);
  if(!matches) {
    return;
  }

  matches.forEach(match => {
    try {
      var file = fs.readFileSync('./assets/aow' + match + '.gif');
    } catch (error) {
      console.error(error);
      return;
    }
    message.channel.uploadFile(file, match + '.gif');
  });
};

function mentions(message, id) {
  var msg = message.content;
  var mentioned = false;
  var bot_user;

  message.mentions.forEach(user => {
    if (user.bot && swearjar.profane(msg)) {
      message.channel.createPermissionOverwrite(message.member, 0, 0x0000800 + 0x0000008)
      .then(po => {
        message.reply(' has been muted for 1 minute for disrespecting the bots.');
        setTimeout(function unmute() {
          po.delete();
        }, 60000);
      });

      return;
    }

    if (user.id === id) {
      msg = msg.split('<@' + id + '>').join('').trim();
      mentioned = true;
      bot_user = user;
    }
    else {
      msg = msg.split('<@' + user.id + '>').join(user.username).trim();
    }
  });

  if(mentioned) {
    console.info(msg);
    request.post({
      url: 'https://cleverbot.io/1.0/ask',
      body: {
        user: process.env.CLEVERBOT_USER || config.CLEVERBOT_USER,
        key: process.env.CLEAVERBOT_KEY || config.CLEAVERBOT_KEY,
        nick: bot_user.username,
        text: msg
      },
      json: true
    })
    .then(body => {
      message.reply(body.response);
    })
    .catch(err => {
      console.error(err.error.status);
      message.reply(cool());

      // Try reinitiate the bot.
      request.post({
        url: 'https://cleverbot.io/1.0/create',
        body: {
          user: process.env.CLEVERBOT_USER || config.CLEVERBOT_USER,
          key: process.env.CLEAVERBOT_KEY || config.CLEAVERBOT_KEY,
          nick: bot_user.username
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
  }
};

function clean(message) {
  if(message.channel.name === 'general' && message.content.charAt(0) === '!') {
    setTimeout(function() {
      message.delete();
    }, 5000);
  }
};