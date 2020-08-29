// GLOBAL
const Discord = require('discord.js');
const bot = new Discord.Client();
const token = "TOKEN";
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let prefix = "-";
let dailytime = true;

// LOGGING IN
bot.once('ready', () => {
    console.log(`[LOGGED IN] ${bot.user.tag} is online`);
    bot.user.setActivity(`-help | Benny#0917`);
});


// COMMANDS
bot.on('message', message => {
    let sender = message.author;
    // USER DATA - To Json
    if (!userData[sender.id]) userData[sender.id] = {
        messagesSent: 0,
        coins: 0,
        multiplier: 1
    }
    // Adds message and coin for each message sent
    if (userData[sender.id].multiplier === 2) {
        userData[sender.id].coins++;
    }
    userData[sender.id].messagesSent++;
    userData[sender.id].coins++;

    Save(); // Saves data to json

    // ARGUMENTS
    let args = message.content.substring(prefix).split(" ");

    // 1 Word Commands - args[0]
    switch(args[0]) {

            // HELP

        case `${prefix}help`:
            const help = new Discord.MessageEmbed()
                .setTitle('LIST OF COMMANDS')
                .setColor('#FF7F50')
                .setDescription('**Command:** `'+prefix+'Website`\nBrain Buster Website\n**Command:** `'+prefix+'Stats`\nSee your user stats\n**Command:** `'+prefix+'Daily`\nGet your daily reward\n**Command:** `'+prefix+'Balance`\nCheck how many coins you have\n**Command:** `'+prefix+'Prefix`\nChange the prefix of the bot\n**Command:** `'+prefix+'Coinflip`\n2x Gambling\n**Command:** `'+prefix+'Slot`\n3x Gambling')

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

            // USER STATS

        case `${prefix}stats`:
            const stats = new Discord.MessageEmbed()
                .setTitle('USER STATS')
                .setColor('#FF7F50')
                .setDescription('Coins: `$'+ userData[sender.id].coins +'` \nMessages Sent: `'+ userData[sender.id].messagesSent +'`\nMultiplier: `'+ userData[sender.id].multiplier +'x`')

            message.channel.send(stats);
            break;

            // DAILY REWARD

        case `${prefix}daily`:
            if (dailytime === true) {
                // Gives you 50-100 coins and writes it to the json file
                let dailyreward = Math.floor(Math.random() * 50) + 50;
                userData[sender.id].coins+=dailyreward;
                Save();
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
                .setTitle(`${sender.username}'s BALANCE`)
                .setColor('#FF7F50')
                .setDescription('Coins: `$'+ userData[sender.id].coins +'`')

            message.channel.send(balance);
            break;

            // PREFIX CHANGE

        case `${prefix}prefix`:
            prefix = args[1];
            const changep = new Discord.MessageEmbed()
                .setTitle('PREFIX UPDATE!')
                .setColor('#FF7F50')
                .setDescription('New Prefix: `'+ prefix +'`')

            message.channel.send(changep);
            break;

            // MULTIPLIERS

        case `${prefix}multiply`:
            if (args[1] === '2x') {
                if (userData[sender.id].coins >= 2000) {
                    userData[sender.id].coins -= 2000;
                    userData[sender.id].multiplier = 2;
                    Save();
                    const x2 = new Discord.MessageEmbed()
                        .setTitle('PURCHASED (-2000)')
                        .setColor('#7FFF00')
                        .setDescription(`**${sender.username}** has purchased ***2x*** multiplier`)

                    message.channel.send(x2);
                } else {
                        const x2err = new Discord.MessageEmbed()
                            .setTitle('INSUFFICIENT FUNDS')
                            .setColor('#FF4500')
                            .setDescription('You need `$2000` for the ***2x*** multiplier')

                        message.channel.send(x2err);
                }
            } else {
                const multipliers = new Discord.MessageEmbed()
                    .setTitle('MULTIPLIERS')
                    .setColor('#FF7F50')
                    .setDescription('Multiplies coins from messages\n\n***2x*** - `$2000`')
                    .setFooter(`Do "${prefix}multiply 2x" to purchase`)

                message.channel.send(multipliers);
            }
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
                    userData[sender.id].coins -= args[1];
                    userData[sender.id].coins += args[1]*2;
                    Save();
                    const cfwin = new Discord.MessageEmbed()
                        .setTitle('COIN FLIP (2x)')
                        .setColor('#7FFF00')
                        .setDescription('**⚪️ ️| ⚪️**\n\nYou won: `$' + args[1]*2 + '`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                    message.channel.send(cfwin);
                } else {
                    userData[sender.id].coins -= args[1];
                    Save();
                    const cflose = new Discord.MessageEmbed()
                        .setTitle('COIN FLIP (2x)')
                        .setColor('#FF4500')
                        .setDescription('**🔴️ | 🔴️**\n\nYou lost: `$' + args[1] + '`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                    message.channel.send(cflose);
                }
            }
            break;

            // SLOT GAMBLE

        case `${prefix}slot`:
            if (args[1] < 50) {
            const sloterr = new Discord.MessageEmbed()
                .setTitle(`BET TOO LOW`)
                .setColor('#FF4500')
                .setDescription('Bet must be more than $50')

            message.channel.send(sloterr);
        } else if(!args[1]) {
            const sloterr1 = new Discord.MessageEmbed()
                .setTitle(`ERROR`)
                .setColor('#FF4500')
                .setDescription('Give an amount to bet')

            message.channel.send(sloterr1);
        } else if(args[1] > userData[sender.id].coins) {
            const sloterr2 = new Discord.MessageEmbed()
                .setTitle(`INSUFFICIENT FUNDS`)
                .setColor('#FF4500')
                .setDescription('You do not have `$' + args[1] + '`')

            message.channel.send(sloterr2);
        } else if(args[1] >= 50) {
            let flip = Math.floor(Math.random() * 3) + 1
            if (flip === 1) {
                userData[sender.id].coins -= args[1];
                userData[sender.id].coins += args[1]*3;
                Save();
                const slotwin = new Discord.MessageEmbed()
                    .setTitle('SLOT (3x)')
                    .setColor('#7FFF00')
                    .setDescription('🍉|🥝|🥕\n🍒|🍒|🍒\n🥝|🥕|🥝\n\nYou won: `$' + args[1]*2 + '`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                message.channel.send(slotwin);
            } else if (flip >= 2) {
                userData[sender.id].coins -= args[1];
                Save();
                const slotlose = new Discord.MessageEmbed()
                    .setTitle('SLOT (3x)')
                    .setColor('#FF4500')
                    .setDescription('🍉|🥝|🥕\n🍒|🍒|🍌\n🥝|🥕|🥝\n\nYou lost: `$' + args[1] + '`\n**Balance**: `$'+ userData[sender.id].coins +'`')

                message.channel.send(slotlose);
            }
        }
            break;
    }
});

function Save() {
    fs.writeFile('data.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

bot.login(token);
