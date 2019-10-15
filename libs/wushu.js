const fs = require('fs');

module.exports = {
  emotes: (message) => {
    const matches = message.content.match(/(\/\d+)/g);
    if(!matches || message.author.bot) {
      return;
    }

    for(let i = 0; i < Math.min(matches.length, 10); i++) {
      try {
        const file = fs.readFileSync('./assets/aow' + matches[i] + '.gif');
        message.channel.send(file, matches[i]);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
