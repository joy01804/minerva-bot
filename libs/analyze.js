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
  poll(message);
  wushu(message);
  mentions(message, bot_id);
};

function poll(message) {
  let msg = message.content;
  let emotes = ['0\u20e3', '1\u20e3', '2\u20e3', '3\u20e3', '4\u20e3', '5\u20e3', '6\u20e3', '7\u20e3', '8\u20e3', '9\u20e3'];
  let poll = '';
  let reactions = [];

  let instruction = 'To poll, use the following message format:\n```help-me-poll question\noption 1\noption 2\noption 3\nup to 9 options\n```';

  if(msg.startsWith('help-me-poll')) {
    let rows = msg.split('\n');

    if(rows.length < 3 || rows.length > 10) {
      message.channel.sendMessage(instruction);
      return;
    }

    rows[0] = rows[0].substring(12).trim();
    poll += rows[0] + '\n';

    for(let i = 1; i < rows.length; i++) {
      poll += emotes[i] + ' ' + rows[i] +'\n';
      reactions.push(emotes[i]);
    }

    message.channel.sendMessage(poll)
      .then(message => {
        reactions.forEach(reaction => {
          message.addReaction(reaction)
            .catch(err => {
              console.log(err)
            });
        });
      }).catch(err => {
      console.log(err);
    });
  }
}

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

  var fn = user => {
    if (user.bot && swearjar.profane(msg)) {
      console.info('"' + msg + '" is profane');
      message.channel.createPermissionOverwrite(message.member, 0, 0x0000800 + 0x0000008)
          .then(po => {
            message.reply(' has been muted for 1 minute for disrespecting the bots.');
            console.info('"' + msg + '" is profane');
            setTimeout(function unmute() {
              po.delete()
                  .then(po => {
                    console.info('PO successfully deleted');
                  }).catch(err => {
                console.error('PO was not deleted correctly');
              });
            }, 60000);
          }).catch(err => {
        console.error(err)
      });
    } else if (user.id === id) {
      msg = msg.split('<@' + id + '>').join('').trim();
      mentioned = true;
      bot_user = user;
    }
    else {
      msg = msg.split('<@' + user.id + '>').join(user.username).trim();
    }

    return Promise.resolve();
  };

  var actions = message.mentions.map(fn);

  Promise.all(actions)
  .then(data => {
    if (mentioned) {
      message.reply(cool());
      // console.info(msg);
      // request.post({
      //   url: 'https://cleverbot.io/1.0/ask',
      //   body: {
      //     user: process.env.CLEVERBOT_USER || config.CLEVERBOT_USER,
      //     key: process.env.CLEVERBOT_KEY || config.CLEVERBOT_KEY,
      //     nick: bot_user.username,
      //     text: msg
      //   },
      //   json: true
      // })
      //     .then(body => {
      //       message.reply(body.response);
      //     })
      //     .catch(err => {
      //       console.error(err.error.status);
      //       message.reply(cool());
      //
      //       // Try reinitiate the bot.
      //       request.post({
      //         url: 'https://cleverbot.io/1.0/create',
      //         body: {
      //           user: process.env.CLEVERBOT_USER || config.CLEVERBOT_USER,
      //           key: process.env.CLEVERBOT_KEY || config.CLEVERBOT_KEY,
      //           nick: bot_user.username
      //         },
      //         json: true
      //       })
      //           .then(body => {
      //             if (body.nick) {
      //               console.log('Connected to CleverBot with session id: ' + body.nick);
      //             }
      //             else {
      //               console.log(body.status);
      //             }
      //           })
      //           .catch(err => {
      //             console.error(err.error.status || err);
      //           });
      //     });
    }
  }).catch(err => {
    console.error(err)
  });
}