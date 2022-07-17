const { MessageEmbed } = require('discord.js');
const Command = require('../../Structures/Command');
const ConfigFile = require("../../Data/ConfigFile.json");
const profile = require("../../Data/profile.json");

module.exports = class extends Command {

        constructor(...args) {
            super(...args, {
                aliases: ['halp', "h", "aide", "secours", "secour"],
                description: 'Displays all the commands in the bot.',
                category: 'Utilities',
                usage: '[command]',
                categoryFR: "Utilité",
                descriptionFR: "Donne toute les commandes du bot et leur utilisation."
            });
        }

        async run(message, [command]) {
                let ActualPrefix = ",,"
                if (message.guild) ActualPrefix = ConfigFile[message.guild.id].prefix
                let args = message.content.split("")

                const embedEN = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor(`🆘 | ${message.guild ? message.guild.name : message.author.username}: Help Menu`, message.guild ? message.guild.iconURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                const embedFR = new MessageEmbed()
                    .setColor("BLUE")
                    .setAuthor(`🆘 | ${message.guild ? message.guild.name : message.author.username}: Menu d'aide`, message.guild ? message.guild.iconURL({ dynamic: true }) : message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setThumbnail(this.client.user.displayAvatarURL())
                    .setFooter(`Demander par ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                if (command) {
                    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

                    if (!cmd && args[1]) {
                        if (profile[message.author.id].langue === "FR") return message.channel.send({ content: `Nom de commande invalide. \`${command}\`.` })
                        if (profile[message.author.id].langue === "EN") return message.channel.send({ content: `Invalid Command named. \`${command}\`.` })
                    }

                    embedEN.setAuthor(`🆘 | ${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
                    const rolesTaben = []
                    if (cmd.guildOwnerOnly) rolesTaben.push("Server owner")
                    if (cmd.adminOnly) rolesTaben.push("Administrator")
                    if (cmd.managerOnly) rolesTaben.push("Manager")
                    if (cmd.modOnly) rolesTaben.push("Moderator")
                    if (cmd.staffOnly) rolesTaben.push("Staff")
                    if (rolesTaben.length === 0) rolesTaben.push("Everyone")
                    embedEN.setDescription([
                                `**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
				`**❯ Description:** ${cmd.description}`,
				`**❯ Category:** ${cmd.category}`,
				`**❯ Usage:** \`${ActualPrefix}${cmd.usage}`,
				`**❯ Server only:** ${cmd.guildOnly ? "Yes" : "No"}`,
				`**❯ Roles needed:** ${rolesTaben.join(", ")}`
			].join("\n"));

			embedFR.setAuthor(`🆘 | Commande d'aide: ${this.client.utils.capitalise(cmd.nameFR)}`, this.client.user.displayAvatarURL());
			const rolesTabfr = []
			if (cmd.guildOwnerOnly) rolesTabfr.push("Propriétaire du serveur")
			if (cmd.adminOnly) rolesTabfr.push("Administrateur")
			if (cmd.managerOnly) rolesTabfr.push("Manager")
			if (cmd.modOnly) rolesTabfr.push("Moderateur")
			if (cmd.staffOnly) rolesTaben.push("Staff")
			if (rolesTabfr.length === 0) rolesTabfr.push("Tout le monde")
			embedFR.setDescription([
				`**❯ Alliasse:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'Pas d\'alliasses.'}`,
				`**❯ Description:** ${cmd.descriptionFR}`,
				`**❯ Categorie:** ${cmd.categoryFR}`,
				`**❯ Utilisation:** \`${ActualPrefix}${cmd.usageFR}`,
				`**❯ Serveur uniquement:** ${cmd.guildOnly ? "Oui" : "Non"}`,
				`**❯ Rôles demandés:** ${rolesTabfr.join(", ")}`
			].join("\n"));

			if (profile[message.author.id].langue === "EN") return message.channel.send({ embeds: [embedEN] });
			if (profile[message.author.id].langue === "FR") return message.channel.send({ embeds: [embedFR] });

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
				categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
			} else {//cmd.category !== 'Event'
				categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
				for (let pas = 0; pas < categories.length; pas++) {
					if (categories[pas].toLowerCase() === "event") categories.splice(pas, 1)
				}
			}
			for (const category of categories) {
				embedEN.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
			}


			let categoriesFR;
			if (message.author.id === "431839245989183488") {
				categoriesFR = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.categoryFR));
			} else {
				categoriesFR = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.categoryFR !== 'Propriétaire').map(cmd => cmd.categoryFR));
				for (let pas = 0; pas < categoriesFR.length; pas++) {
					if (categoriesFR[pas].toLowerCase() === "evenement") categoriesFR.splice(pas, 1)
				}
			}
			for (const categoryFR of categoriesFR) {
				embedFR.addField(`**${this.client.utils.capitalise(categoryFR)}**`, this.client.commands.filter(cmd =>
					cmd.categoryFR === categoryFR).map(cmd => `\`${cmd.nameFR}\``).join(' '));
			}

			if (profile[message.author.id].langue === "EN") return message.channel.send({ embeds: [embedEN] });
			if (profile[message.author.id].langue === "FR") return message.channel.send({ embeds: [embedFR] });
		}
	}

};