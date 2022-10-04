const Command = require('../../Structures/Command');
const ms = require('ms');
const profile = require("../../Data/User.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['ut'],
            description: ['This provides the current uptime of the bot.', "Donne la durée de connexion du bot."],
            category: ['Utilities', "Utilité"],
            wlc: true
        });
    }

    async run(message) {

        if (profile[message.author.id].langue === "FR") message.channel.send(`Ma durée de connexion est de \`${ms(this.client.uptime, { long: true })}\`.`);
        else message.channel.send(`My uptime is \`${ms(this.client.uptime, { long: true })}\`.`);
    }
};