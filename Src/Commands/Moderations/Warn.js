const Command = require('../../Structures/Command');
const { MessageEmbed, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Warn someone.',
            category: 'Moderation',
            descriptionFR: "Préviens quelqu'un.",
            aliases: ["w", "attention"],
            modOnly: true,
            usage: "<user tag/user ID> <reason/list>",
            botPerms: [PermissionFlagsBits.ManageMessages],
            guildOnly: true
        });
    }
    async run(message, [target]) {
        const GID = message.guild.id;
        const args = message.content.split(' ')
        const AID = message.author.id
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to warn.")

        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.")
        const ID = member.user.id

        let foundAth = 0
        let foundMem = 0
        GL[GID].staff.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 1
        });
        GL[GID].mods.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 2
        });
        GL[GID].managers.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 3
        });
        GL[GID].admins.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 4
        });

        GL[GID].staff.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 1
        });
        GL[GID].mods.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 2
        });
        GL[GID].managers.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 3
        });
        GL[GID].admins.forEach(element => {
            if (member.roles.cache.has(element)) foundMem = 4
        });

        if (foundAth === 2 && foundMem !== 0) return message.channel.send("You can't warn a staff member!")
        if (foundAth === 3 && foundMem <= 3) return message.channel.send("You can't warn manager or admins!")

        if (!args[2]) return message.author.send("Please type the reason of the warn.")
        const reason = args.slice(2).join(" ")

        const logEmbed = new MessageEmbed()
            .setTitle("Warn")
            .setColor("YELLOW")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField("Infos:", [
                `**Moderator:** ${message.author.tag} (\`${AID}\`)`,
                `**Warned:** ${member.user.tag} (\`${ID}\`)`,
                `**Reason:** ${reason}`,
                `Exact date: ${dateTime}`
            ].join("\n"))
            .setTimestamp()

        const warnEmbed = new MessageEmbed()
            .setColor("YELLOW")
            .setTitle("Warned")
            .addField(`You have been warned on **${message.guild.name}**`, [
                `**Reason:** ${reason}`
            ].join("\n"))
            .setDescription("A warning won't make me change any of your permissions, but you can get bigger sanctions depending of the server rules and modlogs amount sanctions.")
            .setTimestamp()
        const other = GL[GID].other

        if (!other.modLogs) {
            other.modLogs = {
                userLogged: [],
                user: {}
            }
        }

        if (!other.modLogs.user[ID]) {
            other.modLogs.user[ID] = {
                number: 0,
                case: {}
            }
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
        }
        other.modLogs.user[ID].number++

        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
            if (err) console.log(err)
        })

        message.delete()
        const msgUnmute = new MessageEmbed()
            .setTitle("✅ User warned.")
        message.channel.send({ embeds: [msgUnmute] })

        if (GL[GID].logs.logging === true) {
            try {
                const channel = message.guild.channels.cache.get(GL[GID].logs.channel)
                channel.send({ embeds: [logEmbed] })
            } catch (error) {
                console.log(error.stack)
            }
        }
        try {
            member.send({ embeds: [warnEmbed] })
        } catch (error) {
            console.log(error.stack)
        }
    }
}