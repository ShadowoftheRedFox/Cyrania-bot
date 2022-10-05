const Command = require('../../Structures/Command');
//TODO update embed
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Ban someone.', "Bannis quelqu'un."],
            category: ['Moderation', 'Modération'],
            aliases: ["b", "bans"],
            usage: ["<user tag/user ID> [reason]", "<tag utilisateur/ID utilisateur> [reason]"],
            botPerms: [PermissionFlagsBits.BanMembers],
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

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to ban.");

        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.");
        if (member.id === message.guild.ownerID) return message.channel.send("You are trying to ban the owner you know?");
        if (!member.bannable) return message.author.send("I can't ban this user.");

        let foundMem = 0;
        GuildList[GID].staff.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 1;
        });
        GuildList[GID].mods.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 2;
        });
        GuildList[GID].managers.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 3;
        });
        GuildList[GID].admins.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 4;
        });

        if (foundMem !== 0) return message.author.send("You can't ban a staff member! You need to un staff him first.");

        let reason = "No reason provided.";
        if (args[2]) reason = args.slice(2).join(" ");

        const banMessage = new EmbedBuilder()
            .setTitle("Banned")
            .setColor("RED")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .addFields({
                name: `You have been banned on **${message.guild.name}**`, value: [
                    `**Duration:** permanent.`,
                    `**Reason:** ${reason}`
                ].join("\n")
            });

        const other = GuildList[GID].other;

        if (!other.modLogs) {
            other.modLogs = {
                userLogged: [],
                user: {}
            };
        }

        if (!other.modLogs.user[ID]) {
            other.modLogs.user[ID] = {
                number: 0,
                case: {}
            };
        }

        other.modLogs.user[ID].case[other.modLogs.user[ID].number] = {
            reason: reason,
            targetID: member.user.id,
            targetUsername: member.user.username,
            targetDiscriminator: member.user.discriminator,
            executorID: AID,
            executorUsername: message.author.username,
            executorDiscriminator: message.author.discriminator,
            exactDate: dateTime,
            type: "ban"
        };
        other.modLogs.user[ID].number++;

        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
            if (err) console.log(err);
        });

        member.send({ embeds: [banMessage] }).then(async msg => {
            try {
                await message.guild.members.ban(member.user.id, { days: 7, reason: reason });
                message.delete().then(msg => {
                    const banned = new EmbedBuilder()
                        .setTitle(`✅ User banned.`);
                    message.channel.send({ embeds: [banned] });
                });
            } catch (e) {
                console.log(e.stack);
                message.author.send(`I wasn't able to ban ${member.user.tag} (${member.user.id}).`);
            }
        });
    }
};