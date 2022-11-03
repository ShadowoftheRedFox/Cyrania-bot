const Command = require('../../Structures/Command');
const Discord = require('discord.js');
//TODO update embed
const { EmbedBuilder } = require("discord.js");
const UserList = require("../../Data/User.json");
const fs = require("fs");
const ms = require('ms');
var colors = require("colors");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Owner test command.', "Commande de test du propriétaire."],
            category: ['Owner', "Propriétaire"],
            usage: ["[...args]", "[...args]"],
            ownerOnly: true
        });
    }
    async run(message) {
        const args = message.content.split(' ');
        const ID = message.author.id;

        return message.reply("No test are being runned now.");
    }
};