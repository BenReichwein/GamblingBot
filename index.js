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

    // ARGUMENTS
    let args = message.content.substring(prefix).split(" ");

    // 1 Word Commands - args[0]
    switch(args[0]) {
        
        // HELP
        
        case `${prefix}help`:
            const help = new Discord.MessageEmbed()
                .setTitle('HELP')
                .setColor('#FF7F50')
                .setDescription('**Command:** `'+prefix+'Trivia`\nBrain Buster Trivia\n**Command:** `'+prefix+'Website`\nDownload Brain Buster App here')

            message.channel.send(help);
            break;
            
            // WEBSITE
            
        case `${prefix}website`:
            const website = new Discord.MessageEmbed()
                .setTitle('brainbusters.ca')
                .setColor('#FF7F50')
                .setURL('https://brainbusters.ca/')

            message.channel.send(website);
            break;
            
            // STATS
            
        case `${prefix}stats`:
            const stats = new Discord.MessageEmbed()
                .setTitle('STATS')
                .setColor('#FF7F50')
                .setDescription('Coins: `$'+ userData[sender.id].coins +'` \nMessages Sent: `'+ userData[sender.id].messagesSent +'`')

            message.channel.send(stats);
            break;
            
            // DAILY REWARD
            
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
                    .setDescription('You were awarded with `$'+ dailyreward +'`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                message.channel.send(daily);
                dailytime = false;
                sleep(86400000).then(r => dailytime = true);
            } else {
                const dailyerror = new Discord.MessageEmbed()
                    .setTitle('SLOW DOWN THERE')
                    .setColor('#FF4500')
                    .setDescription('Daily reward available **TOMORROW!**')

                message.channel.send(dailyerror);
            }
            break;
            
            // BALANCE
            
        case `${prefix}balance`:case `${prefix}bal`:case `${prefix}coins`:
            const balance = new Discord.MessageEmbed()
                .setTitle('BALANCE')
                .setColor('#FF7F50')
                .setDescription('Coins: `$'+ userData[sender.id].coins +'`')

            message.channel.send(balance);
            break;
            
            // COIN FLIP
            
        case `${prefix}cf`:case `${prefix}coinflip`:
            if (args[1] < 50) {
                const coinfliperr = new Discord.MessageEmbed()
                    .setTitle(`BET TOO LOW`)
                    .setColor('#FF4500')
                    .setDescription('Bet must be more than $50')

                message.channel.send(coinfliperr);
            } else if(!args[1]) {
                const coinfliperr1 = new Discord.MessageEmbed()
                    .setTitle(`ERROR`)
                    .setColor('#FF4500')
                    .setDescription('Give an amount to bet')

                message.channel.send(coinfliperr1);
            } else if(args[1] > userData[sender.id].coins) {
                const coinfliperr2 = new Discord.MessageEmbed()
                    .setTitle(`INSUFFICIENT FUNDS`)
                    .setColor('#FF4500')
                    .setDescription('You do not have `$' + args[1] + '`')

                message.channel.send(coinfliperr2);
            } else if(args[1] >= 50) {
                let flip = Math.floor(Math.random() * 2) + 1
                if (flip === 1) {
                    const cfwin = new Discord.MessageEmbed()
                        .setTitle('COIN FLIP')
                        .setColor('#7FFF00')
                        .setDescription('***50/50*** **Chance**\n\nYou won: `$' + args[1] + '`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                    message.channel.send(cfwin);
                } else {
                    userData[sender.id].coins-=args[1];
                    fs.writeFile('data.json', JSON.stringify(userData), (err) => {
                        if (err) console.error(err);
                    })
                    const cflose = new Discord.MessageEmbed()
                        .setTitle('COIN FLIP')
                        .setColor('#FF4500')
                        .setDescription('***50/50*** **Chance**\n\nYou lost: `$' + args[1] + '`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                    message.channel.send(cflose);
                }
            }
            break;
    }
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

bot.login(token);
