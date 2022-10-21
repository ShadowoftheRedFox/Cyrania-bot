//TODO update embed
const { EmbedBuilder, version: djsversion, Message } = require('discord.js');
const { version } = require('../../../package.json');
const Command = require('../../Structures/Command');
const { utc } = require('moment');
const UserList = require("../../Data/User.json");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			category: ['Owner', "Propriétaire"],
			description: ['Display information about the bot.', "Donne des informations sur le bot."],
			aliases: ["bi"],
			ownerOnly: true,
		});
	}

	/**
	 * @param {Message} message 
	 * @returns 
	 */
	async run(message) {
		const color = await this.client.utils.getClientColorInGuild(message);
		const embed = new EmbedBuilder()
			.setThumbnail(this.client.user.displayAvatarURL())
			.setColor(color)
			.addFields({
				name: 'General', value: [
					`**❯ Owner:** <@${this.client.owners.join(">, <@")}>`,
					`**❯ Client:** ${this.client.user.tag} (${this.client.user.id})`,
					`**❯ Commands:** ${this.client.commands.size}`,
					`**❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()} `,
					`**❯ Users:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
					`**❯ Channels:** ${this.client.channels.cache.size.toLocaleString()}`,
					`**❯ Creation Date:** ${utc(this.client.user.createdTimestamp).format('Do MMMM YYYY HH:mm:ss')}`,
					`**❯ Node.js:** ${process.version}`,
					`**❯ Version:** v${version}`,
					`**❯ Discord.js:** v${djsversion}`,
					'\u200b'
				].join("\n")
			})
			.setTimestamp();

		return message.channel.send({ embeds: [embed] });
	}

};
