const Command = require('../../Structures/Command');
//TODO update embed
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GuildList = require("../../Data/Guild.json");

function embedFct(number) {
    const current = tagList.slice(number, number + 20);
    const thisTab = [];
    current.forEach(c => {
        thisTab.push(c);
    });
    const modlogsEmbed = new MessageEmbed()
        .setTitle(`Tags ${number + 1}-${number + current.length} out of ${tagList.length}`)
        .setTimestamp()
        .setColor("WHITE")
        .addField(`Tag list:`, thisTab.join("\n"));
    return modlogsEmbed;
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Say a saved message.', "Dit un message enregistré."],
            category: ['Moderation', 'Modération'],
            aliases: ["tag", "t"],
            usage: ["[help]", "[aide]"],
            botPerms: [PermissionFlagsBits.ManageMessages],
            guildOnly: true,
            staffOnly: true
        });
    }
    async run(message) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const ID = message.author.id;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        let foundAth = 0;
        GuildList[GID].staff.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 1;
        });
        GuildList[GID].mods.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 2;
        });
        GuildList[GID].managers.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 3;
        });
        GuildList[GID].admins.forEach(element => {
            if (message.member.roles.cache.has(element)) foundAth = 4;
        });

        if (!args[1] || args[1] === "help") return message.channel.send("What do you want to do? `,,tag <create/edit/delete/list/infos/name> <name/text>`");

        else if (args[1].toLowerCase() === "create") {
            if (foundAth <= 1) return message.author.send("Only mods or higher can create tags.");
            if (!args[2]) return message.channel.send("What will be the name of this tag? `,,tag create <name> <text>`");
            if (args[2] === "infos" || args[2] === "list" || args[2] === "create" || args[2] === "delete" || args[2] === "edit") return message.channel.send(`You can't name the tag ${args[2]} because it's a command needed in the tag process. Please choose another name for this tag.`);
            if (args[2].length > 30) return message.channel.send("To prevent bugs and mistake when typing the name of the tag, name tag must be 30 letters or less.");
            if (!args[3]) return message.channel.send(`What will be the text of the tag ${args[2]}? \`,,tag create ${args[2]} <text>\``);
            const tag = args.slice(3).join(" ");
            if (tag.length > 2000) return message.channel.send("For the moment, bots can not send message with more than 2000 letters. Please make your tag shorter.");

            GuildList[GID].tags[args[2]] = {
                content: tag,
                tagName: args[2],
                author: ID,
                name: message.author.username,
                discriminator: message.author.discriminator,
                timestamp: dateTime,
                timestampMS: Date.now(),
                edited: {
                    number: 0
                }
            };

            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                if (err) console.log(err);
            });

            return message.channel.send(`Tag created under the name of **${args[2]}**. Send it by doing \`,,tag ${args[2]}\`.`);
        } else if (args[1].toLowerCase() === "delete") {
            if (!args[2]) return message.channel.send("Which tag do you want to delete? `,,tag delete <name>`");
            if (!GuildList[GID].tags[args[2]]) return message.channel.send("There is no tags under that name.");
            let edit = "No edit";
            if (GuildList[GID].tags[args[2]].edited.number > 0) {
                let thisTag = GuildList[GID].tags[args[2]];
                let lastEditer = thisTag.edited[thisTag.edited.number - 1];
                edit = [
                    `${lastEditer.name}#${lastEditer.discriminator} (${lastEditer.author})`,
                    ` at ${thisTag.edited[thisTag.edited.number - 1].timestamp}`,
                    ` (${ms(Date.now() - thisTag.edited[thisTag.edited.number - 1].timestampMS, { long: true })} ago.)`
                ].join("");
            }
            message.channel.send([
                `Are you sure that you want to delete this tag?`,
                `**Tag name:** ${args[2]}`,
                `**Author:**: ${GuildList[GID].tags[args[2]].name}#${GuildList[GID].tags[args[2]].discriminator} (${GuildList[GID].tags[args[2]].author})`,
                `**Creation date:** ${GuildList[GID].tags[args[2]].timestamp} (${ms(Date.now() - GuildList[GID].tags[args[2]].timestampMS, { long: true })} ago.)`,
                `**Last edit:** ${edit}`
            ].join("\n")).then(msg => {
                msg.react("✅");
                msg.react("❌");
                const filter = (reaction, user) => user.id === ID;
                const collector = msg.createReactionCollector({ filter, time: 20000 });
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name === "❌") {
                        collector.stop();
                        return message.channel.send("Deletion canceled.");
                    }
                    if (reaction.emoji.name === "✅") {
                        collector.stop();
                        delete GuildList[GID].tags[args[2]];
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        return message.channel.send("The tag has been deleted.");
                    }
                });
            });
        } else if (args[1].toLowerCase() === "edit") {
            if (!args[2]) return message.channel.send("Which tag do you want to delete? `,,tag delete <name>`");
            if (!GuildList[GID].tags[args[2]]) return message.channel.send("There is no tags under that name.");
            if (!args[3]) return message.channel.send("Type some text that will be used to edit the tag.");
            const tag = args.slice(3).join(" ");
            message.channel.send("Are you sure that you want to edit this tag?").then(msg => {
                msg.react("✅");
                msg.react("❌");
                const filter = (reaction, user) => user.id === ID;
                const collector = msg.createReactionCollector({ filter, time: 20000 });
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name === "❌") {
                        collector.stop();
                        return message.channel.send("Edition canceled.");
                    }
                    if (reaction.emoji.name === "✅") {
                        collector.stop();
                        if (tag.length > 2000) return message.channel.send("For the moment, bots can not send message with more than 2000 letters. Please make your tag shorter.");
                        const editedTag = GuildList[GID].tags[args[2]];
                        editedTag.content = tag;
                        editedTag.edited[editedTag.edited.number] = {
                            author: ID,
                            name: message.author.username,
                            discriminator: message.author.discriminator,
                            timestamp: dateTime,
                            timestampMS: Date.now(),
                        };
                        editedTag.edited.number++;
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        return message.channel.send("The tag has been edited.");
                    }
                });
            });

        } else if (args[1].toLowerCase() === "infos") {
            if (!args[2]) return message.channel.send("Which tag do you want to delete? `,,tag delete <name>`");
            if (!GuildList[GID].tags[args[2]]) return message.channel.send("There is no tags under that name.");
            const tag = GuildList[GID].tags[args[2]];
            let edit = "No edit";
            if (GuildList[GID].tags[args[2]].edited.number > 0) {
                let thisTag = GuildList[GID].tags[args[2]];
                let lastEditer = thisTag.edited[thisTag.edited.number - 1];
                edit = [
                    `${lastEditer.name}#${lastEditer.discriminator} (${lastEditer.author})`,
                    ` at ${thisTag.edited[thisTag.edited.number - 1].timestamp}`,
                    ` (${ms(Date.now() - thisTag.edited[thisTag.edited.number - 1].timestampMS, { long: true })} ago.)`
                ].join("");
            }

            const infosEmbed = new MessageEmbed()
                .setTimestamp()
                .setColor("WHITE")
                .setDescription(`Do \`,,tag ${args[2]} to see the content of this tag.\``)
                .addField(`${args[2]} infos:`, [
                    `**Tag name:** ${tag.tagName}`,
                    `**Author:**: ${tag.name}#${tag.discriminator} (${tag.author})`,
                    `**Creation date:** ${tag.timestamp} (${ms(Date.now() - tag.timestampMS, { long: true })} ago.)`,
                    `**Last edit:** ${edit}`,
                    `Has been updated ${tag.edited.number} times.`
                ].join("\n"));

            return message.channel.send({ embeds: [infosEmbed] });

        } else if (args[1].toLowerCase() === "list") {
            const tagTab = Object.values(GuildList[GID].tags);
            if (tagTab.length === 0) return message.channel.send("No tag created yet.");
            const tagList = [];
            let pas = 1;
            tagTab.forEach(element => {
                tagList.push(`**[${pas}]** ${element.tagName}`);
                pas++;
            });


            if (tagList.length <= 20) return message.channel.send({ embeds: [embedFct(0)] });

            return message.channel.send({ embeds: [embedFct(0)] }).then(message => {
                message.react("🗑️");
                message.react('➡️');
                const filter = (reaction, user) => ['⬅️', "🗑️", '➡️'].includes(reaction.emoji.name) && user.id === ID;
                const collector = message.createReactionCollector({ time: 60000 });

                let currentIndex = 0;
                collector.on('collect', reaction => {
                    message.reactions.removeAll().then(async () => {
                        if (reaction.emoji.name === '⬅️') currentIndex -= 20;
                        if (reaction.emoji.name === "➡️") currentIndex += 20;
                        if (reaction.emoji.name === "🗑️") {
                            collector.stop();
                            return;
                        }
                        message.edit(embedFct(currentIndex));
                        if (currentIndex !== 0) await message.react('⬅️');
                        message.react("🗑️");
                        if (currentIndex + 20 < tagList.length) message.react('➡️');
                    });
                });
            });
        } else {
            if (!GuildList[GID].tags[args[1]]) return message.channel.send(`No tag created under the name of **${args[1]}**.`);
            else return message.channel.send(GuildList[GID].tags[args[1]].content).then(message.delete());
        }
    }
};