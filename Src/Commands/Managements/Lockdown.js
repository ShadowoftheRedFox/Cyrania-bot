const Command = require('../../Structures/Command');
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const GuildList = require("../../Data/Guild.json");
const UserList = require("../../Data/User.json");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: ['Enable or disable lockdown, manage channel to lockdown too.', "Active ou désactive le confinement, gère les salons à confiner."],
			category: ['Management', "Gestion"],
			usage: ["[help]", "[aide]"],
			displayName: ["Lockdown", "Couvre Feu"],
			aliases: ["lock", "ld", "cf", "couvrefeu", "ferme"],
			botPerms: [PermissionFlagsBits.ManageChannels],
			managerOnly: true,
			guildOnly: true,
			ownerOnly: true
		});
	}
	async run(message) {
		const GID = message.guild.id;
		const args = message.content.toLowerCase().split(' ');
		const ID = message.author.id;
	}
};