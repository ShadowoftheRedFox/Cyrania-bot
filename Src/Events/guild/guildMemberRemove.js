const Event = require('../../Structures/Event');
var colors = require("colors")
const { MessageEmbed } = require("discord.js")
const GL = require("../..//Data/Guild.json")

module.exports = class extends Event {

    async run(member) {
        try {
            var fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_KICK',
            });
        } catch (e) { return console.log(e.stack) }
        const kickLog = fetchedLogs.entries.first();

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        if (!kickLog) {
            const embed = new MessageEmbed()
                .setTimestamp()
                .addField("Member left:", [
                    `${member.user.username}#${member.user.discriminator} (\`${ID}\`)`,
                    `Exact date: ${dateTime}`
                ])
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            if (GL[GID].logs.logging === true) {
                try {
                    const channel = member.guild.channels.cache.get(GL[GID].logs.channel)
                    return channel.send({ embeds: [embed] })
                } catch (error) {
                    console.log(error.stack)
                }
            }
        }

        const { executor, target, reason } = kickLog;
        const kicker = executor
        const kicked = target
        let bot = ""
        if (kicker.bot) bot = " by bot"

        if (target.id === member.id) {
            const kickEmbed = new MessageEmbed()
                .setTitle(`Member kicked${bot}`)
                .setTimestamp()
                .setAuthor(`${kicked.username}#${kicked.discriminator}`, kicked.displayAvatarURL({ dynamic: true, size: 512 }))
                .setThumbnail(kicked.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("RED")
                .addField("Infos:", [
                    `<@${kicker.id}> (\`${kicker.username}#${kicker.discriminator}\`) kicked ${kicked.username}#${kicked.discriminator} \`(${kicked.id})\``,
                    `Reason: ${reason === null ? "No reason provided" : reason}`,
                    `Exact date: ${dateTime}`
                ])
            if (GL[GID].logs.logging === true) {
                try {
                    const channel = member.guild.channels.cache.get(GL[GID].logs.channel)
                    return channel.send({ embeds: [kickEmbed] })
                } catch (error) {
                    console.log(error.stack)
                }
            }
        }
    }
}