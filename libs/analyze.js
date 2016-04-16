'use strict';

var swearjar = require('swearjar');
var cool = require('cool-ascii-faces');
var request = require('request-promise');

try {
  var config = require('../config.json');
}
catch(err) {
}

const no_gif = [11, 12, 44, 45, 53, 56, 58, 66, 67, 76];

module.exports = function analyze_message(message, bot_id) {
  legacy(message);
  wushu(message);
  mentions(message, bot_id);
}

function legacy(message) {
  if (message.content == "ping") {
    message.channel.sendMessage("pong");
  }

  if(message.content.match(/Hatsumi/)) {
    message.channel.sendMessage("Sexy Batman says: Looking for trouble?", true);
  }
};

function wushu(message) {
  let matches = message.content.match(/(\/\d+)/g);
  if(!matches) {
    return;
  }

  matches.forEach(match => {
    let num = parseInt(match.split('/')[1]);
    if(available(num)) {
      message.channel.uploadFile('./assets/aow' + match + '.gif');
    }
  });
};

function available(num) {
  if(no_gif.indexOf(num) > -1 || num < 1 || num > 84) {
    return false;
  }

  return true;
};

function mentions(message, id) {
  message.mentions.forEach(user => {
    if(user.bot && swearjar.profane(message.content)) {
      message.channel.createPermissionOverwrite(message.member, 0, 0x0000800+0x0000008)
      .then(po => {
        message.reply(' has been muted for 1 minute for disrespecting the bots.');
        setTimeout(function unmute() {
          po.delete()
        }, 60000);
      });

      return;
    }

    if(user.id === id) {
      let regex_id = new RegExp('<@'+id+'>', 'g');
      let msg = message.content.replace(regex_id, 'bot');

      request.post({
        url: 'https://cleverbot.io/1.0/ask',
        body: {
          user: process.env.CLEVERBOT_USER || config.CLEVERBOT_USER,
          key: process.env.CLEAVERBOT_KEY || config.CLEAVERBOT_KEY,
          nick: user.username,
          text: msg
        },
        json: true
      })
      .then(body => {
        message.reply(body.response);
      })
      .catch(err => {
        console.error(err);
        message.reply(cool());
      })
      return;
    }
  });
};