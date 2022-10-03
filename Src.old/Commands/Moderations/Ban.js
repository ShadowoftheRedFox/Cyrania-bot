const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = require('quick.db');
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Ban someone.',
            category: 'Moderation',
            descriptionFR: "Bannis quelqu'un.",
            aliases: ["b", "bans"],
            modOnly: true,
            usage: "<user tag/user ID> [reason]",
            botPerms: ["BAN_MEMBERS", "KICK_MEMBERS"],
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

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to ban.")

        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.")
        if (member.id === message.guild.ownerID) return message.channel.send("You are trying to ban the owner you know?")
        if (!member.bannable) return message.author.send("I can't ban this user.")

        let foundMem = 0
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

        if (foundMem !== 0) return message.author.send("You can't ban a staff member! You need to un staff him first.")

        let reason = "No reason provided."
        if (args[2]) reason = args.slice(2).join(" ")

        const banMessage = new MessageEmbed()
            .setTitle("Banned")
            .setColor("RED")
            .setTimestamp()
            .setThumbnail(message.guild.iconURL())
            .addField(`You have been banned on **${message.guild.name}**`, [
                `**Duration:** permanent.`
                `**Reason:** ${reason}`
            ].join("\n"))

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
            targetID: member.user.id,
            targetUsername: member.user.username,
            targetDiscriminator: member.user.discriminator,
            executorID: AID,
            executorUsername: message.author.username,
            executorDiscriminator: message.author.discriminator,
            exactDate: dateTime,
            type: "ban"
        }
        other.modLogs.user[ID].number++

            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function(err) {
                if (err) console.log(err)
            })

        member.send({ embeds: [banMessage] }).then(async msg => {
            try {
                await message.guild.members.ban(member.user.id, { days: 7, reason: reason })
                message.delete().then(msg => {
                    const banned = new MessageEmbed()
                        .setTitle(`✅ User banned.`)
                    message.channel.send({ embeds: [banned] })
                })
            } catch (e) {
                console.log(e.stack)
                message.author.send(`I wasn't able to ban ${member.user.tag} (${member.user.id}).`)
            }
        })
    }
}