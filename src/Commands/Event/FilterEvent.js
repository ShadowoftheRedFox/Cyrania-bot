const Command = require('../../Structures/Command');
//TODO update embed
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const GuildList = require("../../Data/Guild.json");
const emojiRegex = require("emoji-regex"); //TODO update that

function emotes(str) {
    if (str.match(/<a:.+?:\d+>|<:.+?:\d+>/gi)) return true;
    else if (str.match(UNIregex)) return true;
    else if (str.match(UNIregexTxT)) return true;
    else if (str.match(UNIregexEs)) return true;
    else if (str.match(UNIregexEsTxT)) return true;
    else return false;
}

function flood(str) {
    if (str.match(/[^A-Za-z0-9]{10}/g)) {
        return true;
    } else {
        return false;
    }
}

function zalgo(str) {
    if (str.match(/[\xCC\xCD]/g)) {
        return true;
    } else {
        return false;
    }
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            category: ['Event', "Evenement"],
            guildOnly: true,
            ownerOnly: true
        });
    }

    async run(message) {
        if (!message.guild) return;
        const GID = message.guild.id;
        const filter = GuildList[GID].filter;
        if (filter.enable === false) return;
        if (filter.ignoredChannel.indexOf(message.channel.id) > -1) return;
        const ID = message.author.id;

        var foundRank = "";
        GuildList[GID].staff.forEach(element => {
            if (message.member.roles.cache.has(element)) foundRank = "staff";
        });
        GuildList[GID].mods.forEach(element => {
            if (message.member.roles.cache.has(element)) foundRank = "mod";
        });
        GuildList[GID].managers.forEach(element => {
            if (message.member.roles.cache.has(element)) foundRank = "manager";
        });
        GuildList[GID].admins.forEach(element => {
            if (message.member.roles.cache.has(element)) foundRank = "admin";
        });
        if (ID === message.guild.ownerID) foundRank = "owner";

        if (foundRank !== "") return;

        const usersMap = new Map();
        const LIMIT = 7;
        const DIFF = 5000;
        const TIME = 7000;
        let found = false;
        let msg = "";

        if (usersMap.has(message.author.id)) {
            const userData = usersMap.get(message.author.id);
            const { lastMessage, timer } = userData;
            const difference = message.createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;

            if (difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(message.author.id);
                }, TIME);
                usersMap.set(message.author.id, userData);
            } else {
                ++msgCount;
                if (parseInt(msgCount) === LIMIT) {

                    msg = "Warning: Spamming in this channel is forbidden.";
                    found = true;
                    try {
                        message.channel.bulkDelete(LIMIT);
                    } catch (e) {
                        console.log(e.stack);
                    }

                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        } else {
            let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
            }, TIME);
            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }

        let rawContent = message.content;
        const rawargs = message.content.toLowerCase().trim().split(' ');
        if (filter.zalgo === true) {
            if (zalgo(rawContent) === true) {
                found = true;
                msg = "You can't say zalgo here!";
            } else {
                rawargs.forEach(element => {
                    if (zalgo(element) === true) {
                        found = true;
                        msg = "You can't say zalgo here!";
                    }
                });
            }
        }

        if (filter.zalgo === true) {
            if (flood(rawContent) === true) {
                found = true;
                msg = "You can't say flood here!";
            } else {
                rawargs.forEach(element => {
                    if (flood(element) === true) {
                        found = true;
                        msg = "You can't say flood here!";
                    }
                });
            }
        }


        rawContent = rawContent.replace("\\", "");
        rawContent = rawContent.replace(/([3])/g, "€");
        rawContent = rawContent.replace(/([€])/g, "e");
        rawContent = rawContent.replace(/([°])/g, "0");
        rawContent = rawContent.replace(/([0])/g, "o");
        rawContent = rawContent.replace(/([7])/g, "1");
        rawContent = rawContent.replace(/([1])/g, "i");

        rawContent = rawContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        rawContent = rawContent.normalize("NFD").replace(/\p{Diacritic}/gu, "");

        const content = rawContent;
        const args = content.split(" ");
        filter.word.forEach(element => {
            if (content.includes(element)) {
                found = true;
                msg = "You can't say that!";
            }
        });


        if (filter.emojis === true) {
            const UNIregex = emojiRegex(),
                UNIregexTxT = emojiRegexTxT(),
                UNIregexEs = emojiRegexEs(),
                UNIregexEsTxT = emojiRegexEsTxT();



            if (emotes(message.content) === true) {
                let emoteFound = 0;
                args.forEach(element => {
                    if (emotes(element) === true) emoteFound++;
                });
                if (emoteFound >= filter.emojisNumber) {
                    found = true;
                    msg = "You can't send too much emojis!";
                }
            }
        }


        if (found === true) {
            try {
                message.delete().then(msgWarn => {
                    message.author.send(msg);
                });
            } catch (e) {
                console.log(e.stack);
            }

            if (filter.warn === true) {
                const other = GuildList[GID].other;
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date + ' ' + time;

                other.modLogs.user[ID].case[other.modLogs.user[ID].number] = {
                    reason: `Filter: ${msg}`,
                    targetID: ID,
                    targetUsername: message.author.username,
                    targetDiscriminator: message.author.discriminator,
                    executorID: AID,
                    executorUsername: this.client.user.username,
                    executorDiscriminator: this.client.user.discriminator,
                    exactDate: dateTime,
                    type: "warn"
                };
                other.modLogs.user[ID].number++;

                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, 3), function (err) {
                    if (err) console.log(err);
                });

                const logEmbed = new MessageEmbed()
                    .setTitle("Warn")
                    .setColor("YELLOW")
                    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .addField("Infos:", [
                        `**Moderator:** ${this.client.user.tag} (\`${this.client.user.id}\`)`,
                        `**Warned:** ${message.author.tag} (\`${ID}\`)`,
                        `**Reason:** Filter: ${msg}`,
                        `Exact date: ${dateTime}`
                    ])
                    .setTimestamp();

                if (GuildList[GID].logs.logging === true) {
                    try {
                        const channel = message.guild.channels.cache.get(GuildList[GID].logs.channel);
                        channel.send("", { embed: logEmbed });
                    } catch (error) {
                        console.log(error.stack);
                    }
                }
            }
        }
    }
};