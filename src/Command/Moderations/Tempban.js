const Command = require('../../Structures/Command');
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Tempban someone.', "Bannis temporairement quelqu'un."],
            category: ['Moderation', 'Modération'],
            aliases: ["tb", "timeban"],
            usage: ["<user tag/user ID> <duration> [reason]", "<tag utilisateur/ID utilisateur> <durée> [raison]"],
            botPerms: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers],
            modOnly: true,
            guildOnly: true
        });
    }
    async run(message, [target]) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const AID = message.author.id;
        var dateTime = this.client.utils.exactDate();

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to tempban.");

        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.");
        if (member.id === message.guild.ownerID) return message.channel.send("You are trying to ban the owner you know?");
        if (!member.bannable) return message.author.send("I can't ban this user.");
        var duration = "";
        try {
            duration = ms(args[2].toLowerCase());
            if (isNaN(duration)) return message.author.send("Please provide a duration like the following example:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
        } catch (e) {
            console.log(e.stack);
            return message.author.send("Please provide a duration like the following example:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
        }

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
        if (args[2]) reason = args.slice(3).join(" ");

        const banMessage = new EmbedBuilder()
            .setTitle("Banned")
            .setColor("RED")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .addFields({
                name: `You have been banned on **${message.guild.name}**`, value: [
                    `**Duration:** ${ms(duration, { long: true })}`,
                    `**Reason:** ${reason}`
                ].join("\n")
            })
            .setDescription("If you think that was injustified, wait that 2/3 of your mute have passed then go in the MP of a super moderator.");

        const logEmbed = new EmbedBuilder()
            .setTitle("Mute")
            .setColor("YELLOW")
            .setTimestamp()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields({
                name: "Infos:", value: [
                    `**Moderator:** ${message.author.tag} (\`${AID}\`)`,
                    `**Muted:** ${member.user.tag} (\`${ID}\`)`,
                    `**Duration:** ${ms(duration, { long: true })}`,
                    `**Reason:** ${reason}`,
                    `Exact date: ${dateTime}`
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
            mutedID: ID,
            mutedUsername: member.user.username,
            mutedDiscriminator: member.user.discriminator,
            durationMS: duration,
            duration: ms(duration, { long: true }),
            muterID: AID,
            muterUsername: message.author.username,
            muterDiscriminator: message.author.discriminator,
            endAt: Date.now() + duration,
            type: "tempban"
        };
        other.modLogs.user[ID].number++;

        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
            if (err) console.log(err);
        });

        member.send({ embeds: [banMessage] }).then(async msg => {
            try {
                await member.ban({ days: 7, reason: reason }).setTimeout(() => {
                    let bUser = bans.find(b => b.user.id == member.id);
                    if (!bUser) return;
                    try {
                        msg.guild.members.unban(bUser.user);
                        const unbanned = new EmbedBuilder()
                            .setTitle("Unban")
                            .setColor("YELLOW")
                            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                            .addFields({
                                name: "Infos:", value: [
                                    `**Moderator:** ${this.client.user.tag} (\`673892879826944003\`)`,
                                    `**Unbanned:** ${member.user.tag} (\`${ID}\`)`,
                                    `**Reason:** Automatic (end of duration)`,
                                    `Exact date: ${dateTime}`
                                ].join("\n")
                            })
                            .setTimestamp()
                            .setFooter(`User case n°${other.modLogs.user[member.id].number}`);
                        if (GuildList[GID].logs.logging === true) {
                            try {
                                const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                                channel.send({ embeds: [unbanned] });
                            } catch (error) {
                                console.log(error.stack);
                            }
                        }
                        try {
                            member.send("You have been unbanned.");
                        } catch (error) {
                            console.log(error.stack);
                        }
                    } catch (e) {
                        console.log(e.stack);
                        try {
                            const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                            channel.send("```diff\n-I wans't able to unban this case.\n```", { embed: logEmbed });
                        } catch (error) {
                            console.log(error.stack);
                        }
                    }
                }, duration);
                message.delete().then(msg => {
                    const banned = new EmbedBuilder()
                        .setTitle(`✅ User tempbanned.`);
                    message.channel.send({ embeds: [banned] });
                });
            } catch (e) {
                console.log(e.stack);
                message.author.send(`I wasn't able to ban ${member.user.tag} (${member.id}).`);
            }
        });

        if (GuildList[GID].logs.logging === true) {
            try {
                const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                channel.send({ embeds: [logEmbed] });
            } catch (error) {
                console.log(error.stack);
            }
        }
    }
};