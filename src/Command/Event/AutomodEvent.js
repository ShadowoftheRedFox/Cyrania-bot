const Command = require('../../Structures/Command');
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            category: ['Event', "Evenement"],
            guildOnly: true,
            ownerOnly: true
        });
    }

    async run(message) {
        if (!message.guild) return;
        const GID = message.guild.id;
        const ID = message.author.id;
    }
};