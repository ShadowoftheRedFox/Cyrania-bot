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
        const unbanEmbed = new MessageEmbed()
            .setTitle(`Member unbanned${bot}`)
            .setTimestamp()
            .setAuthor(`${unbanned.username}#${unbanned.discriminator} `, unbanned.displayAvatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(unbanned.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor("GREEN")
        let process = fetchedLogs.entries.first()
        if (!process) {
            if (GL[GID].logs.logging === true) {
                try {
                    unbanEmbed.addField("Infos:", [
                        `Unknown user unbanned ${unbanned.username}#${unbanned.discriminator} \`(${unbanned.id})\``,
                        `Reason: ${reason === null ? "No reason provided" : reason}`,
                        `Exact date: ${dateTime}`
                    ])
                    const channel = guild.channels.cache.get(GL[GID].logs.channel)
                    channel.send({ content: `${user.tag} was unbanned from ${guild.name} but no audit log could be found.`, embeds: [unbanEmbed] })
                } catch (error) {
                    console.log(error.stack)
                }
            }
            return
        }
        const { executor, target, reason } = process

        const unbanner = executor
        const unbanned = target
        const GID = guild.id

        let bot = ""
        if (unbanner.bot) bot = " by bot"


        unbanEmbed.addField("Infos:", [
            `<@${unbanner.id}> (\`${unbanner.username}#${unbanner.discriminator}\`) unbanned ${unbanned.username}#${unbanned.discriminator} \`(${unbanned.id})\``,
            `Reason: ${reason === null ? "No reason provided" : reason}`,
            `Exact date: ${dateTime}`
        ])

        if (GL[GID].logs.logging === true) {
            try {
                const channel = guild.channels.cache.get(GL[GID].logs.channel)
                channel.send({ embeds: [unbanEmbed] })
            } catch (error) {
                console.log(error.stack)
            }
        }
    }
}



/*
ban {
    targetType: 'USER',
    actionType: 'CREATE',
    action: 'MEMBER_BAN_REMOVE',
    reason: null,
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
    id: '874268492990406686',
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