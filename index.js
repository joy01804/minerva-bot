var Discordie = require("discordie");
var Events = Discordie.Events;

var client = new Discordie();

client.connect({
  token: process.env.BOT_TOKEN
});

client.Dispatcher.on(Events.GATEWAY_READY, e => {
  console.log("Connected as: " + client.User.username);
});

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
  if (e.message.content == "ping")
    e.message.channel.sendMessage("pong");
  if(e.message.content.match(/Hatsumi/)) {
    e.message.channel.sendMessage("Sexy Batman says: Looking for trouble?", true);
  }
});
