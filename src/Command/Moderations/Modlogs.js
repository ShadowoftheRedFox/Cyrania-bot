const Command = require('../../Structures/Command');
//TODO update embed
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GuildList = require("../../Data/Guild.json");

function embedFct(number) {
	const current = caseTab.slice(number, number + 10);
	const thisTab = [];
	current.forEach(c => {
		thisTab.push(c);
	});
	const modlogsEmbed = new MessageEmbed()
		.setTitle(`Mod logs ${number + 1}-${number + current.length} out of ${caseTab.length} of ${member.user.tag} (${ID})`)
		.setTimestamp()
		.setColor("#8388f7")
		.addField(`Case${caseNumber > 0 ? "s" : ""}:`, thisTab.join("\n"));
	return modlogsEmbed;
}

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: ['See all the logs relativ to moderation of someone.', "Regardez tout les logs relatifs à la modération de quelqu'un."],
			category: ['Moderation', 'Modération'],
			aliases: ["ml", "modlog", "userlog"],
			usage: ["<user tag/user ID> [number] [edit] [reason]", "<tag utilisateur/ID utilisateur> [nombre] [modification] [raison]"],
			modOnly: true,
			guildOnly: true
		});
	}
	async run(message, [target]) {
		const GID = message.guild.id;
		const args = message.content.split(' ');
		const AID = message.author.id;
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date + ' ' + time;

		if (!args[1]) return message.channel.send("Please tag or put the ID of the user modlogs you want to see.");

		const member = message.mentions.members.first() || message.guild.members.cache.get(target);
		if (!member) return message.channel.send("I wasn't able to find this user.");
		const ID = member.user.id;

		const ML = GuildList[GID].other.modLogs;
		if (ML.userLogged.indexOf(ID) === -1) return message.channel.send("This user don't have modlogs.");
		const thisUserLogs = ML.user[ID];
		const caseNumber = thisUserLogs.number;
		const caseTab = [];
		for (let pas = 0; pas < caseNumber; pas++) {
			const thisCase = thisUserLogs.case[pas];
			const type = thisCase.type;
			let typeInfos = "";
			if (type === "warn" || type === "kick" || type === "softban") {
				//nothing, just the reason, which is already done
			} else if (type === "ban") {
				typeInfos = [
					`\`Duration:\` Permanent`,
					`\`Ended at:\` Never`
				].join("\n");
			} else if (type === "tempban") {
				typeInfos = [
					`\`Duration:\` ${thisCase.duration}`,
					`\`Ended at:\` ${ms(Date.now() - thisCase.endAt, { long: true })} ago.`
				].join("\n");
			} else if (type === "mute") {
				typeInfos = [
					`\`Duration:\` ${thisCase.duration}`,
					`\`Ended at:\` ${ms(Date.now() - thisCase.endAt, { long: true })} ago.`
				].join("\n");
			}
			//can be added more
			caseTab.push([
				`**[Case n°${pas + 1}]** ${thisCase.type}`,
				`\`Moderator:\` ${thisCase.executorUsername}#${thisCase.executorDiscriminator} (${thisCase.executorID})`,
				`\`Date:\` ${thisCase.exactDate}`,
				`\`Reason:\` ${thisCase.reason}${typeInfos === "" ? "" : `\n${typeInfos}`}`
			].join("\n"));
		}
		if (!args[2]) {


			if (caseTab.length <= 10) return message.channel.send({ embeds: [embedFct(0)] });

			return message.channel.send({ embeds: [embedFct(0)] }).then(message => {
				message.react("🗑️");
				message.react('➡️');
				const filter = (reaction, user) => ['⬅️', "🗑️", '➡️'].includes(reaction.emoji.name) && user.id === ID;
				const collector = message.createReactionCollector({ filter, time: 60000 });

				let currentIndex = 0;
				collector.on('collect', reaction => {
					message.reactions.removeAll().then(async () => {
						if (reaction.emoji.name === '⬅️') currentIndex -= 10;
						if (reaction.emoji.name === "➡️") currentIndex += 10;
						if (reaction.emoji.name === "🗑️") {
							collector.stop();
							return;
						}
						message.edit(embedFct(currentIndex));
						if (currentIndex !== 0) await message.react('⬅️');
						message.react("🗑️");
						if (currentIndex + 10 < caseTab.length) message.react('➡️');
					});
				});
			});

		} else if (isNaN(args[2]) === true) {
			return message.channel.send(`This is not a number, please follow this exemple:\n\`,,modlogs ${ID} [number]\``);
		} else {
			if (parseInt(args[2]) > caseNumber) return message.channel.send(`${member.user.tag} has only ${caseNumber} modlogs.`);
			if (parseInt(args[2]) <= 0) return message.channel.send("User cases start from 1.");
			if (args[3] && args[3].toLowerCase() === "edit") {
				const editCase = ML.user[ID].case[parseInt(args[2]) - 1];
				const editReason = args.slice(4).join(" ");
				if (!editReason) return message.channel.send("You need to type the new reason!");
				message.channel.send(`The current mod log case reason is **${editCase.reason}**, and the new one will be **${editReason}**. Are you sure you want to modify it? you won't be able to cancel the action.`).then(msg => {
					msg.react("✅");
					msg.react("❌");
					const filter = (reaction, user) => user.id === AID;
					const collector = msg.createReactionCollector({ filter, time: 20000 });
					collector.on('collect', async (reaction, user) => {
						if (reaction.emoji.name === "❌") {
							collector.stop();
							return message.channel.send("Edition canceled.");
						}
						if (reaction.emoji.name === "✅") {
							collector.stop();
							editCase.reason = editReason;
							fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
								if (err) console.log(err);
							});
							return message.channel.send("Edition done.");
						}
					});
				});
			} else {
				const modlogsEmbed = new MessageEmbed()
					.setTitle(`Mod log of ${member.user.tag} (${ID})`)
					.setTimestamp()
					.setColor("#8388f7")
					.setDescription(`You can do \`${args[0]} @${member.user.username} ${args[2]} edit <reason>\` to edit the reason of this mod log, bu you can't delete a mod log.`)
					.addField("Case:", [
						caseTab[parseInt(args[2]) - 1]
					].join("\n"));

				return message.channel.send({ embeds: [modlogsEmbed] });
			}
		}
	}
};