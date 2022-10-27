const Command = require('../../Structures/Command');
const UserList = require("../../Data/User.json");
const GuildList = require("../../Data/Guild.json");
const fs = require("fs");
const color = require("colors");
const ms = require("ms");
const { Message } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            category: ['Event', "Evenement"],
            guildOnly: true,
            ownerOnly: true
        });
    }

    /**
     * @param {Message} message 
     */
    async run(message) {
        const ID = message.author.id;
        if (!UserList[ID]) this.client.utils.addUserToDB(message);
    }
};