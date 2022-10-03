const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = require('quick.db');
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Clear a amount of message or message from a user.',
            category: 'Moderation',
            descriptionFR: "Efface un nombre de message ou des message d'un utilisateur.",
            aliases: ["c", "broom"],
            modOnly: true,
            usage: "<number> [user]",
            botPerms: ["MANAGE_MESSAGES"],
            guildOnly: true
        });
    }
    async run(message) {
        const GID = message.guild.id;
        const args = message.content.split(' ')

        if (!args[1]) return message.channel.send("Please input a number of message I will delete, or a user tag or ID to delete his messages.")
        if (isNaN(args[1]) === false || !args[2]) {
            try {
                if (Math.floor(parseInt(args[1])) <= 0) return message.channel.send("I can't delete 0 messages or less than 0. <a:whyareulikethis:875409288724639764>")
                if (Math.floor(parseInt(args[1])) > 100) return message.channel.send("Due to discord limitations, I can't delete more than 100 messages at times.")
                await message.channel.bulkDelete(Math.floor(parseInt(args[1])), true).then(async msg => {
                    message.channel.send(`Cleared ${msg.size} messages. :broom:`).then(async del => {
                        setTimeout(async () => {
                            try { await message.delete() } catch (e) { /*nothing*/ }
                            try { await del.delete() } catch (e) { /*nothing*/ }
                        }, 2500);
                    })
                })
            } catch (e) {
                /*nothing*/
                return await message.channel.send("I could not delete some messages!")
            }
        } else {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
            if (!member) return message.author.send("I can't find this user.")
            message.channel.messages.fetch({ limit: 100 }).then(async messages => {
                var messagesDel = []
                messages.forEach(element => {
                    const { author } = element
                    if (author && author.id === member.id) messagesDel.push(element)
                });
                try {
                    await message.channel.bulkDelete(messagesDel).then(async msg => {
                        await message.channel.send(`Cleared ${msg.size} messages from ${member.user.tag}. :broom:`).then(del => {
                            setTimeout(async () => {
                                try { await del.delete() } catch (e) { /*nothing*/ }
                                if (member.id !== message.author.id) try { await message.delete() } catch (e) { /*nothing*/ }
                            }, 2500);
                        })
                    })
                } catch (e) {
                    /*nothing*/
                    return await message.channel.send("I could not delete some messages!")
                }
            })
        }
    }
}