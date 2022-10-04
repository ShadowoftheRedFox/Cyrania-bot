const Command = require('../../Structures/Command');
const profile = require("../../Data/User.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['pong'],
            description: ['This provides the ping of the bot', "Donne la latence du bot."],
            category: ['Utilities', "Utilité"],
            displayName: ["Ping", "Ping"]
        });
    }

    async run(message) {
        const msg = await message.channel.send('Pinging...');

        const latency = msg.createdTimestamp - message.createdTimestamp;
        const choicesFR = ['C\'est vraiment ma latence?', 'C\'est mauvais? Je ne peut pas voir!', 'J\'éspère que ce n\'est pas si mal...'];
        const choicesEN = ['Is this really my ping?', 'Is this okay? I can\'t look!', 'I hope it isn\'t bad!'];
        const responseEN = choicesEN[Math.floor(Math.random() * choicesEN.length)];
        const responseFR = choicesFR[Math.floor(Math.random() * choicesFR.length)];

        if (profile[message.author.id].langue === "FR") msg.edit(`${responseFR} - Latence du bot: \`${latency}ms\`, Latence de l'API: \`${Math.round(this.client.ws.ping)}ms\``);
        else msg.edit(`${responseEN} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``);

    }

};