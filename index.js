'use strict';
const optional = require('optional');
const Discord = require('discord.js');
const wushu = require('./libs/wushu');

const client = new Discord.Client();

client.login(process.env.BOT_TOKEN || optional('./config.json').BOT_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  // if (msg.content === 'ping') {
  //     msg.reply('pong');
  // }

  wushu.emotes(msg);
});
