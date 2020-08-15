// GLOBAL
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = "NzEzNjI0MzcxNzE2OTQ3OTg4.Xsi0fA.PAGZyVtnr0lSNRQHZtqzUkcAalM";
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const prefix = '-';

// LOGGING IN
bot.once('ready', () => {
    console.log(`[LOGGED IN] ${bot.user.tag} is online`);
    bot.user.setActivity(`${prefix}help | Benny#0917`);
});

bot.once('disconnect', () => {
    console.log('[LOGGED OUT]');
});


// COMMANDS
bot.on('message', message => {
    let sender = message.author;
    // MESSAGE COUNT
    if (!userData[sender.id]) userData[sender.id] = {
        messagesSent: 0,
        coins: 0
    }

    userData[sender.id].messagesSent++;
    userData[sender.id].coins++;

    fs.writeFile('data.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    })

    // COMMANDS
    let args = message.content.substring(prefix.length).split(" ");

    // 1 Word Commands - args[0]
    switch(args[0]) {
        case 'help':
            const help = new Discord.MessageEmbed()
                .setTitle('HELP')
                .setColor('#FF7F50')
                .setDescription('**Command:** `'+prefix+'Trivia`\nBrain Buster Trivia\n**Command:** `'+prefix+'Website`\nDownload Brain Buster App here')

            message.channel.send(help);
            break;
        case 'website':
            const website = new Discord.MessageEmbed()
                .setTitle('WEBSITE')
                .setColor('#FF7F50')
                .setURL('https://brainbusters.ca/')

            message.channel.send(website);
            break;
        case 'stats':
            const stats = new Discord.MessageEmbed()
                .setTitle('STATS')
                .setColor('#FF7F50')
                .setDescription('Coins: `'+ userData[sender.id].coins +'` \nMessages Sent: `'+ userData[sender.id].messagesSent +'`')

            message.channel.send(stats);
            break;

    }
})

bot.login(token);