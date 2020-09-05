// GLOBAL
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = process.env.TOKEN;
const Bot = module.exports = new (require("./src/Bot").Bot)(bot);
const Gambling = module.exports = new (require("./src/Gambling").Gambling)(bot);

// LOGGING IN
bot.once('ready', async () => {
    await Bot.onStart();
});


// COMMANDS
bot.on('message', async (message) => {
    await Bot.onMessage(message);
    await Gambling.onMessage(message);
});

bot.login(token);
