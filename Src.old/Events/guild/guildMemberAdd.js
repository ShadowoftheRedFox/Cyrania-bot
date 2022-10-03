const Event = require('../../Structures/Event');
var colors = require("colors")
const { MessageEmbed } = require("discord.js")
const GL = require("../../Data/Guild.json")

module.exports = class extends Event {

    async run(member) {
        const GID = member.guild.id
        const ID = member.user.id
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const joinEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle("Member joined")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addField(member.user.username, [
                `${member.user.username}#${member.user.discriminator} (\`${ID}\`)`,
                `Exact date: ${dateTime}`
            ])

        if (GL[GID].logs.logging === true) {
            try {
                const channel = member.guild.channels.cache.get(GL[GID].logs.channel)
                channel.send({ embeds: [joinEmbed] })
            } catch (error) {
                console.log(error.stack)
            }
        }

        if (GL[GID].other.mute.mutedArray.indexOf(ID) > -1) {
            try {
                member.roles.add(GL[GID].other.mute.role)

                const logEmbed = new MessageEmbed()
                    .setTitle("Warn (not mod logged)")
                    .setColor("YELLOW")
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .addField("Infos:", [
                        `**Moderator:** ${this.client.user.tag} (\`${this.client.user.id}\`)`,
                        `**Warned:** ${member.user.tag} (\`${ID}\`)`,
                        `**Reason:** Tried to bypass mute.`,
                        `Exact date: ${dateTime}`
                    ])
                    .setTimestamp()

                if (GL[GID].logs.logging === true) {
                    try {
                        const channel = member.guild.channels.cache.get(GL[GID].logs.channel)
                        channel.send({ embeds: [logEmbed] })
                    } catch (error) {
                        console.log(error.stack)
                    }
                }
            } catch (e) {
                console.log(e.stack)
            }
        }
    }
}