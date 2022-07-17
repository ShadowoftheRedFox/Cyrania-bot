const { MessageEmbed, version: djsversion } = require('discord.js');
const { version } = require('../../../package.json');
const Command = require('../../Structures/Command');
const { utc } = require('moment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ["bi"],
			ownerOnly: true,
			category: "Owner",
			categoryFR: 'Propriétaire'
		});
	}

	run(message) {
		const embed = new MessageEmbed()
			.setThumbnail(this.client.user.displayAvatarURL())
			.setColor(message.guild.me.displayHexColor || 'BLUE')
			.addField('General', [
				"**❯ Owner:** <@431839245989183488>",
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
			].join("\n"))
			.setTimestamp();

		return message.channel.send({ embeds: [embed] });
	}

};
