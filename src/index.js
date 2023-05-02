require('dotenv').config();
const { Client } = require('discord.js');
const { load } = require('./moduleManager');
const cache = require('./utils/cacheMe');

const client = new Client({
  intents: ['MessageContent', 'GuildMessages', 'Guilds', 'GuildMembers'],
});

async function init() {
  cache.set('client', client, 0);
  await load();
  await client.login(process.env.TOKEN);
}
init();
