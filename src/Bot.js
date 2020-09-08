const Discord = require('discord.js');
let prefix = '-';

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

        // ARGUMENTS
        let args = message.content.substring(prefix).split(" ");

        // 1 Word Commands - args[0]
        switch(args[0]) {

            // HELP

            case `${prefix}help`:
                await createEmbed(`LIST OF COMMANDS`, '#FF7F50', '**Command:** `'
                    + prefix + 'Website`\nBrain Buster Website\n**Command:** `'
                    + prefix + 'Stats`\nSee your user stats\n**Command:** `'
                    + prefix + 'Daily`\nGet your daily reward\n**Command:** `'
                    + prefix + 'Balance`\nCheck how many coins you have\n**Command:** `'
                    + prefix + 'Multiply`\nGet more coins from sending messages\n**Command:** `'
                    + prefix + 'Dice [multiplier] [amount]`\n1x-100x Gambling\n**Command:** `'
                    + prefix + 'Coinflip [amount]`\n2x Gambling\n**Command:** `'
                    + prefix + 'Slot [amount]`\n3x Gambling');
                break;

            // WEBSITE

            case `${prefix}website`:
                const website = new Discord.MessageEmbed()
                    .setTitle('brainbusters.ca')
                    .setColor('#FF7F50')
                    .setURL('https://brainbusters.ca/')

                await message.channel.send(website);
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

module.exports.Bot = Bot;
