const Command = require('../../Structures/Command');
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Warn someone.', "Préviens quelqu'un."],
            category: ['Moderation', 'Modération'],
            aliases: ["w", "attention"],
            usage: ["<user tag/user ID> <reason/list>", "<tag utilisateur/ID utilisateur> <raison/liste>"],
            botPerms: [PermissionFlagsBits.ManageMessages],
            modOnly: true,
            guildOnly: true
        });
    }
    async run(message, [target]) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const AID = message.author.id;
        var dateTime = this.client.utils.exactDate();

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to warn.");

        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.");
        const ID = member.user.id;

        let foundAth = 0;
        let foundMem = 0;
        GuildList[GID].staff.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 1;
        });
        GuildList[GID].mods.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 2;
        });
        GuildList[GID].managers.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 3;
        });
        GuildList[GID].admins.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 4;
        });

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

        if (foundAth === 2 && foundMem !== 0) return message.channel.send("You can't warn a staff member!");
        if (foundAth === 3 && foundMem <= 3) return message.channel.send("You can't warn manager or admins!");

        if (!args[2]) return message.author.send("Please type the reason of the warn.");
        const reason = args.slice(2).join(" ");

        const logEmbed = new EmbedBuilder()
            .setTitle("Warn")
            .setColor("Yellow")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields({
                name: "Infos:", value: [
                    `**Moderator:** ${message.author.tag} (\`${AID}\`)`,
                    `**Warned:** ${member.user.tag} (\`${ID}\`)`,
                    `**Reason:** ${reason}`,
                    `Exact date: ${dateTime}`
                ].join("\n")
            })
            .setTimestamp();

        const warnEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("Warned")
            .addFields({
                name: `You have been warned on **${message.guild.name}**`, value: [
                    `**Reason:** ${reason}`
                ].join("\n")
            })
            .setDescription("A warning won't make me change any of your permissions, but you can get bigger sanctions depending of the server rules and modlogs amount sanctions.")
            .setTimestamp();
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
            targetID: ID,
            targetUsername: member.user.username,
            targetDiscriminator: member.user.discriminator,
            executorID: AID,
            executorUsername: message.author.username,
            executorDiscriminator: message.author.discriminator,
            exactDate: dateTime,
            type: "warn"
        };
        other.modLogs.user[ID].number++;

        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
            if (err) console.log(err);
        });

        message.delete();
        const msgUnmute = new EmbedBuilder()
            .setTitle("✅ User warned.");
        message.channel.send({ embeds: [msgUnmute] });

        if (GuildList[GID].logs.logging === true) {
            try {
                const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                channel.send({ embeds: [logEmbed] });
            } catch (error) {
                console.log(error.stack);
            }
        }
        try {
            member.send({ embeds: [warnEmbed] });
        } catch (error) {
            console.log(error.stack);
        }
    }
};