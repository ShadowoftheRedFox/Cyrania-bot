const Event = require('../../Structures/Event');
var colors = require("colors")
const { MessageEmbed } = require("discord.js")
const GL = require("../../Data/Guild.json")

module.exports = class extends Event {

    async run(guild) {
        try {
            var fetchedLogs = await guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            });
        } catch (e) { return console.log(e.stack) }
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        const banEmbed = new MessageEmbed()
            .setTitle(`Member banned${bot}`)
            .setTimestamp()
            .setAuthor(`${banned.username}#${banned.discriminator}`, banned.displayAvatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(banned.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("RED")
        let process = fetchedLogs.entries.first()
        if (!process) {
            if (GL[GID].logs.logging === true) {
                try {
                    const channel = guild.channels.cache.get(GL[GID].logs.channel)
                    banEmbed.addField("Infos:", [
                        `Unkonwn user banned ${banned.username}#${banned.discriminator} \`(${banned.id})\``,
                        `Reason: ${reason === null ? "No reason provided" : reason}`,
                        `Exact date: ${dateTime}`
                    ])
                    channel.send({ content: `${user.tag} was banned from ${guild.name} but no audit log could be found.`, embeds: [banEmbed] })
                } catch (error) {
                    console.log(error.stack)
                }
            }
            return
        }
        const { executor, target, reason } = process

        const banner = executor
        const banned = target
        const GID = guild.id

        let bot = ""
        if (banner.bot) bot = " by bot"


        banEmbed.addField("Infos:", [
            `<@${banner.id}> (\`${banner.username}#${banner.discriminator}\`) banned ${banned.username}#${banned.discriminator} \`(${banned.id})\``,
            `Reason: ${reason === null ? "No reason provided" : reason}`,
            `Exact date: ${dateTime}`
        ])


        if (GL[GID].logs.logging === true) {
            try {
                const channel = guild.channels.cache.get(GL[GID].logs.channel)
                channel.send({ embeds: [banEmbed] })
            } catch (error) {
                console.log(error.stack)
            }
        }
    }
}

/*
ban {
    targetType: 'USER',
    actionType: 'DELETE',
    action: 'MEMBER_BAN_ADD',
    reason: 'ouste',
    executor: User {
      id: '431839245989183488',
      system: null,
      locale: null,
      flags: UserFlags { bitfield: 256 },
      username: 'Shadow of the Red Fox',
      bot: false,
      discriminator: '5881',
      avatar: 'a99fde8f193e3368b9a84a77bf376963',
      lastMessageID: null,
      lastMessageChannelID: null
    },
    changes: null,
    id: '874268452821545001',
    extra: null,
    target: User {
      id: '722545984013598803',
      system: null,
      locale: null,
      flags: UserFlags { bitfield: 0 },
      username: 'CDT',
      bot: false,
      discriminator: '8130',
      avatar: 'b0e203eda9f334bb6fb3ff99434b9a73',
      lastMessageID: null,
      lastMessageChannelID: null
    }
  }
  */