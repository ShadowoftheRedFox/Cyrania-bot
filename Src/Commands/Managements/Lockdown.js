const Command = require('../../Structures/Command');
const { MessageEmbed, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Enable or disable lockdown, manage channel to lockdown too.',
			category: 'Management',
			descriptionFR: "Active ou désactive le confinement, gère les salons à confiner.",
			managerOnly: true,
			usage: "<enable/disable/channel> [reason]/<add/remove> <all/channel id/channel tag>",
			botPerms: [PermissionFlagsBits.ManageChannels],
			guildOnly: true
		});
	}
	async run(message) {
		const GID = message.guild.id;
		const args = message.content.toLowerCase().split(' ')
		const ID = message.author.id

	}
}