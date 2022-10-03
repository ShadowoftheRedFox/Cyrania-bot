const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            category: 'Event',
            guildOnly: true,
            categoryFR: "Evenement",
            ownerOnly: true
        });
    }

    async run(message) {
        if (!message.guild) return
        const GID = message.guild.id;
        const ID = message.author.id

        if (!GL[GID].other.automod) {
            GL[GID].other.automod = {
                number: 0,
                sanction: {}
            }
        }
    }
}