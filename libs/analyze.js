'use strict';

const no_gif = [11, 12, 44, 45, 53, 56, 58, 66, 67, 76];

module.exports = function analyze_message(message) {
  legacy(message);
  wushu(message);
}

function legacy(message) {
  if (message.content == "ping") {
    message.channel.sendMessage("pong");
  }

  if(message.content.match(/Hatsumi/)) {
    message.channel.sendMessage("Sexy Batman says: Looking for trouble?", true);
  }
}

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
}

function available(num) {
  if(no_gif.indexOf(num) > -1 || num < 1 || num > 84) {
    return false;
  }

  return true;
}