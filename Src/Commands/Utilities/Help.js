const { EmbedBuilder } = require('discord.js');
const Command = require('../../Structures/Command');
const GuildList = require("../../Data/Guild.json");
const UserList = require("../../Data/User.json");
const console = require('console');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['halp', "h", "aide", "secours", "secour"],
			description: ['Displays all the commands in the bot.', "Donne toute les commandes du bot et leur utilisation."],
			category: ['Utilities', "Utilité"],
			usage: ['[command]', '[command]'],
			displayName: ["Help", "Aide"]
		});
	}

	/**
	 * 
	 * @param {Message} message 
	 * @param {string} param1 
	 * @returns 
	 */
	async run(message, [command]) {
		let ActualPrefix = ",,";
		if (message.guild) ActualPrefix = GuildList[message.guildId].prefix;

		const embedEN = new EmbedBuilder()
			.setColor("BLUE")
			.setAuthor({ name: `🆘 | ${message.guild ? message.guild.name : message.author.username}: Help Menu`, iconURL: (message.guild ? message.guild.iconURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true, size: 512 })) })
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		const embedFR = new EmbedBuilder()
			.setColor("BLUE")
			.setAuthor({ name: `🆘 | ${message.guild ? message.guild.name : message.author.username}: Menu d'aide`, iconURL: (message.guild ? message.guild.iconURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true, size: 512 })) })
			.setThumbnail(this.client.user.displayAvatarURL())
			.setFooter({ text: `Demandé par ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
			.setTimestamp();

		if (command) {
			/**
			 * @type {Command}
			 */
			const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

			if (!cmd && command) {
				if (UserList[message.author.id].langue === "FR") return message.reply(`Nom de commande invalide: \`${command}\`.`);
				if (UserList[message.author.id].langue === "EN") return message.reply(`Invalid Command named: \`${command}\`.`);
			}

			embedEN.setAuthor({ name: `🆘 | ${this.client.utils.capitalise(cmd.displayName[0])} Command Help`, iconURL: this.client.user.displayAvatarURL() });
			const rolesTaben = [];
			if (cmd.guildOwnerOnly) rolesTaben.push("Server owner");
			if (cmd.adminOnly) rolesTaben.push("Administrator");
			if (cmd.managerOnly) rolesTaben.push("Manager");
			if (cmd.modOnly) rolesTaben.push("Moderator");
			if (cmd.staffOnly) rolesTaben.push("Staff");
			if (rolesTaben.length == 0) rolesTaben.push("None");
			embedEN.setDescription([
				`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
				`**❯ Description:** ${cmd.description[0]}`,
				`**❯ Category:** ${cmd.category[0]}`,
				`**❯ Usage:** ${ActualPrefix}${cmd.displayName[0]} ${cmd.usage[0]}`,
				`**❯ Server only:** ${cmd.guildOnly ? "Yes" : "No"}`,
				`**❯ Roles needed:** ${rolesTaben.join(", ")}`
			].join("\n"));

			embedFR.setAuthor({ name: `🆘 | Commande d'aide: ${this.client.utils.capitalise(cmd.displayName[1])}`, iconURL: this.client.user.displayAvatarURL() });
			const rolesTabfr = [];
			if (cmd.guildOwnerOnly) rolesTabfr.push("Propriétaire du serveur");
			if (cmd.adminOnly) rolesTabfr.push("Administrateur");
			if (cmd.managerOnly) rolesTabfr.push("Manageur");
			if (cmd.modOnly) rolesTabfr.push("Modérateur");
			if (cmd.staffOnly) rolesTabfr.push("Staff");
			if (rolesTabfr.length == 0) rolesTabfr.push("Aucun");
			embedFR.setDescription([
				`**❯ Alliasse:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'Pas d\'alliasses.'}`,
				`**❯ Description:** ${cmd.description[1]}`,
				`**❯ Categorie:** ${cmd.category[1]}`,
				`**❯ Utilisation:** ${ActualPrefix}${cmd.displayName[1]} ${cmd.usage[1]}`,
				`**❯ Serveur uniquement:** ${cmd.guildOnly ? "Oui" : "Non"}`,
				`**❯ Rôles requis:** ${rolesTabfr.join(", ")}`
			].join("\n"));

			if (UserList[message.author.id].langue === "FR") return message.channel.send({ embeds: [embedFR] });
			else return message.channel.send({ embeds: [embedEN] });

		} else {
			if (message.guild) {
				embedEN.setDescription([
					`These are the available commands for ${message.guild.name}`,
					`The bot's prefix is: \`${ActualPrefix}\``,
					`Command Parameters: \`<>\` is strict & \`[]\` is optional`
				].join("\n"));

				embedFR.setDescription([
					`Voila les commandes disponibles pour ${message.guild.name}`,
					`Le préfix du bot est: \`${ActualPrefix}\``,
					`Paramètres de commandes: \`<>\` est obligatoire et \`[]\` est optionnel.`
				].join("\n"));
			} else {
				embedEN.setDescription([
					`These are the available commands for your DM`,
					`The bot's prefix is: \`,,\``,
					`Command Parameters: \`<>\` is strict & \`[]\` is optional`
				].join("\n"));

				embedFR.setDescription([
					`Voila les commandes disponibles pour vos messages privés`,
					`Le préfix du bot est: \`,,\``,
					`Paramètres de commandes: \`<>\` est obligatoire et \`[]\` est optionnel.`
				].join("\n"));
			}


			let categories;
			if (message.author.id === "431839245989183488") {
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category[0]));
			} else {//cmd.category !== 'Event'
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category[0] !== 'Owner' && cmd.category[0] !== 'Event').map(cmd => cmd.category[0]));
			}
			for (const category of categories) {
				embedEN.addFields({
					name: `**${this.client.utils.capitalise(category)}**`, value: this.client.commands.filter(cmd =>
						cmd.category[0] === category).map(cmd => `\`${cmd.displayName[0]}\``).join(' ')
				});
			}


			let categoriesFR;
			if (message.author.id === "431839245989183488") {
				categoriesFR = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category[1]));
			} else {
				categoriesFR = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category[1] !== 'Propriétaire' && cmd.category[0] !== 'Evenement').map(cmd => cmd.category[1]));
			}
			for (const categoryFR of categoriesFR) {
				embedFR.addFields({
					name: `**${this.client.utils.capitalise(categoryFR)}**`, value: this.client.commands.filter(cmd =>
						cmd.category[1] === categoryFR).map(cmd => `\`${cmd.name[1]}\``).join(' ')
				});
			}

			if (UserList[message.author.id].langue === "FR") return message.channel.send({ embeds: [embedFR] });
			else return message.channel.send({ embeds: [embedEN] });
		}
	}

};