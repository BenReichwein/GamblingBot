const Discord = require('discord.js');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let prefix = '-';
let dailytime = true;

class Bot {

    /** @type module:"discord.js".Client */
    #bot;

    constructor(bot) {
        this.#bot = bot;
    }

    async onStart() {
        console.log("[LOGGED IN]")
        await this.getBot().user.setStatus("online");
        await this.getBot().user.setActivity(`-help | Benny#0917`)
    }

    /**
     * @param {module:"discord.js".Message} message
     *
     * @returns {Promise<void>}
     */
    async onMessage(message) {
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
                await createEmbed(`LIST OF COMMANDS`, '#FF7F50', '**Command:** `' + prefix + 'Website`\nBrain Buster Website\n**Command:** `' + prefix + 'Stats`\nSee your user stats\n**Command:** `' + prefix + 'Daily`\nGet your daily reward\n**Command:** `' + prefix + 'Balance`\nCheck how many coins you have\n**Command:** `' + prefix + 'Prefix`\nChange the prefix of the bot\n**Command:** `' + prefix + 'Coinflip`\n2x Gambling\n**Command:** `' + prefix + 'Slot`\n3x Gambling');
                break;

            // WEBSITE

            case `${prefix}website`:
                const website = new Discord.MessageEmbed()
                    .setTitle('brainbusters.ca')
                    .setColor('#FF7F50')
                    .setURL('https://brainbusters.ca/')

                await message.channel.send(website);
                break;

            // USER STATS

            case `${prefix}stats`:
                await createEmbed(`USER STATS`, '#FF7F50', 'Coins: `$'+ userData[sender.id].coins +'` \nMessages Sent: `'+ userData[sender.id].messagesSent +'`\nMultiplier: `'+ userData[sender.id].multiplier +'x`');
                break;

            // DAILY REWARD

            case `${prefix}daily`:
                if (dailytime === true) {
                    // Gives you 50-100 coins and writes it to the json file
                    let dailyreward = Math.floor(Math.random() * 50) + 50;
                    userData[sender.id].coins+=dailyreward;
                    Save();
                    await createEmbed(`DAILY`, '#FF7F50', 'You were awarded with `$'+ dailyreward +'`\n**Balance**: `$'+ userData[sender.id].coins +'`');
                    dailytime = false;
                    sleep(86400000).then(r => dailytime = true);
                } else {
                    await createEmbed('SLOW DOWN THERE', '#FF4500', 'Daily reward available **TOMORROW!**');
                }
                break;

            // BALANCE

            case `${prefix}balance`:case `${prefix}bal`:case `${prefix}coins`:
                await createEmbed(`${sender.username}'s BALANCE`, '#FF7F50', 'Coins: `$'+ userData[sender.id].coins +'`');
                break;

            // MULTIPLIERS

            case `${prefix}multiply`:
                if (args[1] === '2x') {
                    if (userData[sender.id].coins >= 2000) {
                        userData[sender.id].coins -= 2000;
                        userData[sender.id].multiplier = 2;
                        Save();
                        await createEmbed('PURCHASED (-2000)', '#7FFF00', `**${sender.username}** has purchased ***2x*** multiplier`);
                    } else {
                        await createEmbed('INSUFFICIENT FUNDS', '#FF4500', 'You need `$2000` for the ***2x*** multiplier');
                    }
                } else {
                    const multipliers = new Discord.MessageEmbed()
                        .setTitle('MULTIPLIERS')
                        .setColor('#FF7F50')
                        .setDescription('Multiplies coins from messages\n\n***2x*** - `$2000`')
                        .setFooter(`Do "${prefix}multiply 2x" to purchase`)

                    await message.channel.send(multipliers);
                }
                break;

            // COIN FLIP

            case `${prefix}cf`:case `${prefix}coinflip`:
                if (args[1] < 50) {
                    await createEmbed(`BET TOO LOW`, '#FF4500', 'Bet must be more than $50');
                } else if(!args[1]) {
                    await createEmbed(`ERROR`, '#FF4500', 'Give an amount to bet');
                } else if(args[1] > userData[sender.id].coins) {
                    await createEmbed(`INSUFFICIENT FUNDS`, '#FF4500', 'You do not have `$' + args[1] + '`');
                } else if(args[1] >= 50) {
                    let flip = Math.floor(Math.random() * 2) + 1
                    if (flip === 1) {
                        userData[sender.id].coins -= args[1];
                        userData[sender.id].coins += args[1]*2;
                        Save();
                        await createEmbed('COIN FLIP (2x)', '#7FFF00', '**⚪️ ️| ⚪️**\n\nYou won: `$' + args[1]*2 + '`\n**Balance**: `$'+ userData[sender.id].coins +'`');
                    } else {
                        userData[sender.id].coins -= args[1];
                        Save();
                        await createEmbed('COIN FLIP (2x)', '#FF4500', '**🔴️ | 🔴️**\n\nYou lost: `$' + args[1] + '`\n**Balance**: `$'+ userData[sender.id].coins +'`');
                    }
                }
                break;

            // SLOT GAMBLE

            case `${prefix}slot`:
                if (args[1] < 50) {
                    await createEmbed(`BET TOO LOW`, '#FF4500', 'Bet must be more than $50');
                } else if(!args[1]) {
                    await createEmbed(`ERROR`, '#FF4500', 'Give an amount to bet');
                } else if(args[1] > userData[sender.id].coins) {
                    await createEmbed(`INSUFFICIENT FUNDS`, '#FF4500', 'You do not have `$' + args[1] + '`');
                } else if(args[1] >= 50) {
                    let flip = Math.floor(Math.random() * 3) + 1
                    if (flip === 1) {
                        userData[sender.id].coins -= args[1];
                        userData[sender.id].coins += args[1]*3;
                        Save();
                        await createEmbed('SLOT (3x)', '#7FFF00', '🍉|🥝|🥕\n🍒|🍒|🍒\n🥝|🥕|🥝\n\nYou won: `$' + args[1]*2 + '`\n**Balance**: `$'+ userData[sender.id].coins +'`');
                    } else if (flip >= 2) {
                        userData[sender.id].coins -= args[1];
                        Save();
                        await createEmbed('SLOT (3x)', '#FF4500', '🍉|🥝|🥕\n🍒|🍒|🍌\n🥝|🥕|🥝\n\nYou lost: `$' + args[1] + '`\n**Balance**: `$'+ userData[sender.id].coins +'`');
                    }
                }
                break;

                // CREATE EMBED THROUGH FUNCTION

            async function createEmbed(title, color, description) {
                const Embed = new Discord.MessageEmbed()
                    .setTitle(title)
                    .setColor(color)
                    .setDescription(description)
                await message.channel.send(Embed);
            }
        }
    }

    /**
     * @return {module:"discord.js".Client}
     */
    getBot() {
        return this.#bot;
    }
}

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

module.exports.Bot = Bot;
