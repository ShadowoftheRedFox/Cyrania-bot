const Event = require('../../Structures/Event');
var colors = require("colors")
const { MessageEmbed } = require("discord.js")

module.exports = class extends Event {

    async run(guild) {
        console.log([
            "===============[NEW GUILD JOINED!]===============",
            `Name: ${guild.name}`,
            `Member count: ${guild.memberCount}`,
            `Owner: ${guild.ownerID}`,
            "================================================="
        ].join("\n").blue)

        let defaultChannel;
        guild.channels.cache.forEach((channel) => {
            if (channel.type == "text") {
                if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                    defaultChannel = channel;
                }
            }
        })

        const embed = new MessageEmbed()
            .setThumbnail(this.client.user.displayAvatarURL())
            .setTitle("Hello there! 👋")
            .setDescription([
                "Thank you for adding me!",
                "My default prefix is `,,`.",
                "**To start using me, type `,,setup`.**",
                "Yo have a full list of every commands, type `,,help`.",
                "**I'm still under developement, so some features may glitch.**",
                "Report any bug, translation error with `,,bugreport`.",
                "\u200b"
            ])
            .addField("Language:", [
                "To help with setup and errors, those two are translated in both english and french.",
                "Otherwise, the whole bot is in english.",
                "Change you language with `,,language`.",
                "\u200b"
            ])
            .addField("Moderation and management:", [
                "Most of my commands and task need some permissions, when you will do `,,setup` or managements commands, i will ask for permissions i don't have.",
                "I force myself to use the less permissions as possible.",
                "**Make sure that my role is higher than any role that i will possibly use/edit in the future.**",
                "If any bugs happen, check my profile and join my server for support!"
            ])
            .setFooter("Need help? Do ,,invite to get the link to the support server! | Made by a french student.")
            .setColor("BLUE")

        try {
            defaultChannel.send({ content: "Hey! 🖖", embeds: [embed] })
        } catch (error) {
            console.log(error.stack)
        }
    }
}