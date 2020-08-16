// GLOBAL
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = "TOKEN";
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let prefix = '-';
let dailytime = true;

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
    let args = message.content.substring(prefix).split(" ");

    // 1 Word Commands - args[0]
    switch(args[0]) {
        case `${prefix}help`:
            const help = new Discord.MessageEmbed()
                .setTitle('HELP')
                .setColor('#FF7F50')
                .setDescription('**Command:** `'+prefix+'Trivia`\nBrain Buster Trivia\n**Command:** `'+prefix+'Website`\nDownload Brain Buster App here')

            message.channel.send(help);
            break;
        case `${prefix}website`:
            const website = new Discord.MessageEmbed()
                .setTitle('brainbusters.ca')
                .setColor('#FF7F50')
                .setURL('https://brainbusters.ca/')

            message.channel.send(website);
            break;
        case `${prefix}stats`:
            const stats = new Discord.MessageEmbed()
                .setTitle('STATS')
                .setColor('#FF7F50')
                .setDescription('Coins: `$'+ userData[sender.id].coins +'` \nMessages Sent: `'+ userData[sender.id].messagesSent +'`')

            message.channel.send(stats);
            break;
        case `${prefix}daily`:
            if (dailytime === true) {
                // Gives you 50-100 coins and writes it to the json file
                let dailyreward = Math.floor(Math.random() * 50) + 50;
                userData[sender.id].coins+=dailyreward;
                fs.writeFile('data.json', JSON.stringify(userData), (err) => {
                    if (err) console.error(err);
                })
                const daily = new Discord.MessageEmbed()
                    .setTitle('DAILY')
                    .setColor('#FF7F50')
                    .setDescription('Reward: `$'+ dailyreward +'`\nBalance: `$'+ userData[sender.id].coins +'`')

                message.channel.send(daily);
                dailytime = false;
                sleep(86400000).then(r => dailytime = true);
            } else {
                const dailyerror = new Discord.MessageEmbed()
                    .setTitle('DAILY')
                    .setColor('#FF4500')
                    .setDescription('Daily reward available **TOMORROW!**')

                message.channel.send(dailyerror);
            }
            break;
        case `${prefix}balance`:case `${prefix}bal`:case `${prefix}coins`:
            const balance = new Discord.MessageEmbed()
                .setTitle('BALANCE')
                .setColor('#FF7F50')
                .setDescription('Coins: `$'+ userData[sender.id].coins +'`')

            message.channel.send(balance);
            break;
    }
})

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

bot.login(token);
