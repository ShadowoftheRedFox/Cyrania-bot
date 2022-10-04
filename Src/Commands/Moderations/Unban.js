const Command = require('../../Structures/Command');
const { MessageEmbed, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Unban someone.',
            category: 'Moderation',
            descriptionFR: "Débannis quelqu'un.",
            aliases: ["ub", "deban"],
            modOnly: true,
            usage: "<user tag/user ID> [reason]",
            botPerms: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.BanMembers, PermissionFlagsBits.KickMembers],
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

        if (!args[1]) return message.author.send("Please provide the ID of the user you want to unban.")
        const exID = "431839245989183488"
        if (args[1].length !== exID.length || isNaN(args[1]) === true) return message.channel.send("Please provide a correct ID.")

        let userID = args[1]
        msg.guild.fetchBans().then(bans => {
            if (bans.size == 0) return message.author.send("No users banned.")
            let bUser = bans.find(b => b.user.id == userID)
            if (!bUser) return message.author.send("This user is not banned, or he is already unbanned.")
            try {
                msg.guild.members.unban(bUser.user)
                message.delete().then(msg => {
                    const ubEmbed = new MessageEmbed()
                        .setTitle("✅ User unbanned.")
                    message.channel.send({ embeds: [ubEmbed] })
                })
                try {
                    bUser.send("You have been unbanned.")
                } catch (error) {
                    console.log(error.stack)
                }
            } catch (e) {
                console.log(e.stack)
                return message.author.send("I couldn't unban this user.")
            }
        })
    }
}