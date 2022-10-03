const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = require('quick.db');
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Enable or disable lockdown, manage channel to lockdown too.',
			category: 'Management',
			descriptionFR: "Active ou désactive le confinement, gère les salons à confiner.",
			managerOnly: true,
			usage: "<enable/disable/channel> [reason]/<add/remove> <all/channel id/channel tag>",
			botPerms: ["MANAGE_CHANNELS"],
            guildOnly: true
		});
	}
	async run(message) {
		const GID = message.guild.id;
		const args = message.content.toLowerCase().split(' ')
		const ID = message.author.id

	}
}