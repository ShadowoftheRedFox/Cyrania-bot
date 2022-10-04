const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Manage automatic sanctions.',
            category: 'Management',
            descriptionFR: "Gère les sanctions automatiques.",
            modOnly: true,
            guildOnly: true
        });
    }
    async run(message) {
        const GID = message.guild.id;
        const args = message.content.toLowerCase().split(' ')
        const ID = message.author.id
        return
    }
}