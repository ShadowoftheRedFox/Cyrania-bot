const Command = require('../../Structures/Command');
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Mute someone.', "Rend muet quelqu'un."],
            category: ['Moderation', 'Modération'],
            aliases: ["m", "silent", "silence", "muet"],
            usage: ["<user tag/user ID> <duration> [reason]", "<tag utilisateur/ID utilisateur> <durée> [raison]"],
            botPerms: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageRoles],
            modOnly: true,
            guildOnly: true
        });
    }
    async run(message, [target]) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const AID = message.author.id;
        var dateTime = this.client.utils.exactDate();

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to mute.");

        if (!GuildList[GID].other.mute.role) return message.channel.send("I don't have a role to add to a muted person! Please ask a manager or an admin to do `,,setup mute`.");
        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.");

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

        if (foundAth === 2 && foundMem !== 0) return message.channel.send("You can't mute a staff member!");
        if (foundAth === 3 && foundMem <= 3) return message.channel.send("You can't mute manager or admins!");


        const role = message.guild.roles.cache.get(`${GuildList[GID].other.mute.role}`);
        if (member.roles.cache.has(role.id)) return message.author.send("This user is already muted!");

        const ID = member.user.id;
        if (ID === message.guild.ownerID) return message.author.send("You dare trying to mute the owner?!");
        if (member.user.bot) return message.author.send("This user is a bot, why would you mute him?");
        if (member.permissions.has("ADMINISTRATOR", true)) return message.author.send("Mute an admin would be... useless, you know?");
        if (!args[2]) return message.author.send("Please provide a duration like the following example:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
        var duration = "";
        try {
            duration = ms(args[2].toLowerCase());
            if (isNaN(duration)) return message.author.send("Please provide a duration like the following example:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
        } catch (e) {
            console.log(e.stack);
            return message.author.send("Please provide a duration like the following example:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
        }

        let reason = "No reason provided.";
        if (args[3]) reason = args.slice(3).join(" ");

        const muteMessage = new EmbedBuilder()
            .setTitle("Muted")
            .setColor("Red")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .addFields({
                name: `You have been muted on **${message.guild.name}**`, value: [
                    `**Duration:** ${ms(duration, { long: true })}`,
                    `**Reason:** ${reason}`
                ].join("\n")
            });

        const logEmbed = new MessageEmbed()
            .setTitle("Mute")
            .setColor("Yellow")
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

        //TODO change database
        const other = GuildList[GID].other;

        if (other.mute.mutedArray.indexOf(ID) === -1) other.mute.mutedArray.push(ID);
        other.mute.mutedData[ID] = {
            reason: reason,
            mutedID: ID,
            mutedUsername: member.user.username,
            mutedDiscriminator: member.user.discriminator,
            durationMS: duration,
            duration: ms(duration, { long: true }),
            muterID: AID,
            muterUsername: message.author.username,
            muterDiscriminator: message.author.discriminator,
            endAt: Date.now() + duration
        };

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

        if (other.mute.mutedArray.indexOf(ID) === -1) other.modLogs.userLogged.push(ID);
        other.modLogs.user[ID].case[other.modLogs.user[ID].number] = {
            reason: reason,
            targetID: ID,
            targetUsername: member.user.username,
            targetDiscriminator: member.user.discriminator,
            executorID: AID,
            executorUsername: message.author.username,
            executorDiscriminator: message.author.discriminator,
            durationMS: duration,
            duration: ms(duration, { long: true }),
            endAt: Date.now() + duration,
            exactDate: dateTime,
            type: "mute"
        };
        other.modLogs.user[ID].number++;

        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
            if (err) console.log(err);
        });
        member.roles.add(role).then(
            setTimeout(() => {
                if (member.roles.cache.has(role.id)) {
                    try {
                        member.roles.remove(role);
                    } catch (e) {
                        console.log(e.stack);
                        try {
                            const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                            channel.send("```diff\n-I wans't able to unmute this case.\n```", { embeds: [logEmbed] });
                        } catch (error) {
                            console.log(error.stack);
                        }
                    }
                    const unmuted = new EmbedBuilder()
                        .setTitle("Unmute")
                        .setColor("Yellow")
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .addFields({
                            name: "Infos:", value: [
                                `**Moderator:** ${this.client.user.tag} (\`673892879826944003\`)`,
                                `**Unmuted:** ${member.user.tag} (\`${ID}\`)`,
                                `**Reason:** Automatic (end of sanction)`,
                                `Exact date: ${dateTime}`
                            ].join("\n")
                        })
                        .setTimestamp()
                        .setFooter(`User case n°${other.modLogs.user[ID].number}`);

                    delete other.mute.mutedData[ID];
                    const index = other.mute.mutedArray.indexOf(ID);
                    if (index > -1) {
                        other.mute.mutedArray.splice(index, 1);
                    }
                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                        if (err) console.log(err);
                    });
                    if (GuildList[GID].logs.logging === true) {
                        try {
                            const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                            channel.send({ embeds: [unmuted] });
                        } catch (error) {
                            console.log(error.stack);
                        }
                    }
                    try {
                        member.send("You have been unmuted.");
                    } catch (error) {
                        console.log(error.stack);
                    }
                }
            }, duration)
        );

        message.delete().then(msg => {
            const muted = new MessageEmbed()
                .setTitle(`✅ User muted. ${reason !== "No reason provided." ? reason : ""}`);
            message.channel.send({ embeds: [muted] });
        });

        if (GuildList[GID].logs.logging === true) {
            try {
                const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                channel.send({ embeds: [logEmbed] });
            } catch (error) {
                console.log(error.stack);
            }
        }

        try {
            member.send({ embeds: [muteMessage] });
        } catch (error) {
            console.log(error.stack);
        }

    }
};