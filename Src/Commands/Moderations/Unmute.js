const Command = require('../../Structures/Command');
const { MessageEmbed, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Unmute someone.',
            category: 'Moderation',
            descriptionFR: "Re donne la parole à quelqu'un.",
            aliases: ["um", "unsilent", "unsilence"],
            modOnly: true,
            usage: "<user tag/user ID> [reason]",
            botPerms: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageRoles],
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

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to unmute.")

        if (!GL[GID].other.mute.role) return message.channel.send("I don't know what is the muted role! Please ask a manager or an admin to do `,,setup mute`.")
        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.")
        const ID = member.user.id
        const role = message.guild.roles.cache.get(`${GL[GID].other.mute.role}`)
        if (!member.roles.cache.has(role.id)) return message.author.send("This user is not muted!")

        let reason = args.slice(2).join(" ")
        try {
            member.roles.remove(role)
        } catch (e) {
            console.log(e.stack)
            try {
                const channel = message.guild.channels.cache.get(GL[GID].logs.channel)
                if (channel) channel.send(`Couldn't remove <@&${role.id}> from <@${ID}>.`)
            } catch (error) {
                console.log(error.stack)
            }
        }

        const unmuted = new MessageEmbed()
            .setTitle("Unmute")
            .setColor("YELLOW")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField("Infos:", [
                `**Moderator:** ${message.author.tag} (\`${AID}\`)`,
                `**Unmuted:** ${member.user.tag} (\`${ID}\`)`,
                `**Reason:** ${reason}`,
                `Exact date: ${dateTime}`
            ])
            .setTimestamp()

        const other = GL[GID].other
        if (other.mute.mutedData[ID]) delete other.mute.mutedData[ID]
        const index = other.mute.mutedArray.indexOf(ID)
        if (index > -1) {
            other.mute.mutedArray.splice(index, 1)
        }

        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
            if (err) console.log(err)
        })

        message.delete()
        const msgUnmute = new MessageEmbed()
            .setTitle("✅ User unmuted.")
        message.channel.send({ embeds: [msgUnmute] })

        if (GL[GID].logs.logging === true) {
            try {
                const channel = message.guild.channels.cache.get(GL[GID].logs.channel)
                channel.send({ embeds: [unmuted] })
            } catch (error) {
                console.log(error.stack)
            }
        }
        try {
            member.send(`You have been unmuted.\n**Reason:** ${reason}`)
        } catch (error) {
            console.log(error.stack)
        }
    }
}