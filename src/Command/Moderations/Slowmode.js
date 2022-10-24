const Command = require('../../Structures/Command');
//TODO update embed
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Set or disable the channel slowmode.', "Met ou désactive le mode lent du salon."],
            category: ['Moderation', 'Modération'],
            aliases: ["sm", "cooldow", "cooldows", "slowmodes"],
            usage: ["<number> [reason]", "<nombre> [raison]"],
            botPerms: [PermissionFlagsBits.ManageChannels],
            modOnly: true,
            guildOnly: true
        });
    }
    async run(message, [number]) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const AID = message.author.id;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        if (!number) return message.author.send("You need to choose a number of seconds to wait for the slowmode!");
        if (isNaN(number) || number < 0) return message.author.send("You need to provide a correct number!");

        number = Math.floor(number);

        var reason = `Command invoqued by ${message.author.tag}`;
        if (args[2]) reason = args.slice(2).join(" ");

        try {
            message.channel.setRateLimitPerUser(number, reason);

            const logEmbed = new MessageEmbed()
                .setTitle("Slowmode")
                .setColor("GREEN")
                .setTimestamp()
                .addField("Infos:", [
                    `**Moderator:** ${message.author.tag} (\`${AID}\`)`,
                    `**Channel:** ${message.channel.name} (\`${message.channel.id}\`)`,
                    `**Time:** ${number}`,
                    `**Reason:** ${reason}`,
                    `Exact date: ${dateTime}`
                ].join("\n"));

            message.delete().then(msg => {
                const sm = new MessageEmbed()
                    .setTitle(`✅ ${parseInt(number) === 0 ? "Slowmode disabled." : "Slow mode set."}`);
                message.channel.send({ embeds: [sm] });
            });

            if (GuildList[GID].logs.logging === true) {
                try {
                    const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                    channel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.log(error.stack);
                }
            }
        } catch (e) {
            console.log(e.stack);
            return message.author.send("I couldn't change the slowmode.");
        }
    }
};