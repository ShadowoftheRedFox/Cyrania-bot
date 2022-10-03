const Command = require('../../Structures/Command');
const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js")
const profile = require("../../Data/User.json");
const fs = require("fs");
const ms = require('ms');
const db = require('quick.db')
var colors = require("colors")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Owner test command.',
            category: 'Owner',
            ownerOnly: true,
            categoryFR: "Propriétaire",
            descriptionFR: "Commande de test du propriétaire."
        });
    }
    async run(message, [number]) {
        const args = message.content.split(' ')
        const ID = message.author.id

        return message.reply("No test are being runned now.")

    }
}