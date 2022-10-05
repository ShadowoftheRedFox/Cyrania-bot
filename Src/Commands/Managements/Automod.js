const Command = require('../../Structures/Command');
//TODO update embed
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const ms = require('ms');
const GuildList = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Manage the automoderation.', "Gère l'automodération."],
            category: ['Management', "Gestion"],
            usage: ["[help]", "[aide]"],
            aliases: ["am", "automods", "automoderation"],
            botPerms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageRoles],
            managerOnly: true,
            guildOnly: true
        });
    }
    async run(message) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const ID = message.author.id;

        if (!args[1] || args[1].toLowerCase() === "help") {
            return message.channel.send([
                "Staff are not affected by the automoderation.",
                "Do `,,automod add <number> <ban/softban/tempban/kick/mute> <parameters>` to add an automod sanction on this server.",
                "Do `,,automod list [number]` to get the list of automods sanctions on this server.",
                "Do `,,automod <disable/enable/delete> <number>` to disable, enable or delete the sanction on this server.",
                "Do `,,automod infos [ban/tempban/softban/kick/mute]` to get more infos about a sanction, or in general."
            ].join("\n"));
        }

        if (args[1].toLowerCase() === "infos") {
            if (args[2] && args[2].toLowerCase() === "ban") {
                return message.channel.send([
                    "**[Infos]: Ban**",
                    "Be carreful, the ban is definitiv, and tempban isn't, he have a duration before getting ubanned.",
                    "When a member is banned, he won't be able to join the server until he is getting unbanned.",
                    "You can choose to delete messages sent in a says number, between 0 and 7 days, 7 included. (0 does not delete messages.)",
                    "\n__Sanction parameters:__",
                    "`,,automod add <number> ban <days> [reason]`: **number**: number of modlogs to reach to get the sanction. | **days**: number between 0 and 7, 0 and 7 included, of message sent that will be deleted if they were sended in the last number day(s). | **reason**: Deafult \"Banned by automod. | Too much modlogs!\", but you can change the reason."
                ].join("\n"));
            } else if (args[2] && args[2].toLowerCase() === "tempban") {
                return message.channel.send([
                    "**[Infos]: Tempban**",
                    "Be carreful, the ban is definitiv, and tempban isn't, he have a duration before getting ubanned.",
                    "When a member is banned, he won't be able to join the server until he is getting unbanned. I will send a log if i'm not able to unban him in the log channel.",
                    "You can choose to delete messages sent in a says number, between 0 and 7 days, 7 included. (0 does not delete messages.)",
                    "\n__Sanction parameters:__",
                    "`,,automod add <number> tempban <days> <time> [reason]`: **number**: number of modlogs to reach to get the sanction. | **days**: number between 0 and 7, 0 and 7 included, of message sent that will be deleted if they were sended in the last number day(s). | **time**: time of the ban before he get unbanned. Number followed by __s, m, h, d__, respectively seconds, minutes, hours and days. | **reason**: Deafult \"Tempbanned by automod. | Too much modlogs!\", but you can change the reason."
                ].join("\n"));
            } else if (args[2] && args[2].toLowerCase() === "softban") {
                return message.channel.send([
                    "**[Infos]: Softban**",
                    "A softban is a ban, directly followed by an unban. It have the same result as a kick but delete an amount of the messages sended by the user banned.",
                    "Since it is similar as a kick, there is no timer. I will send a log if i'm not able to unban him in the log channel.",
                    "You can choose to delete messages sent in a says number, between 0 and 7 days, 7 included. (0 does not delete messages.)",
                    "\n__Sanction parameters:__",
                    "`,,automod add <number> softban <days> [reason]`: **number**: number of modlogs to reach to get the sanction. | **days**: number between 0 and 7, 0 and 7 included, of message sent that will be deleted if they were sended in the last number day(s). | **reason**: Deafult \"Softbanned by automod. | Too much modlogs!\", but you can change the reason."
                ].join("\n"));
            } else if (args[2] && args[2].toLowerCase() === "kick") {
                return message.channel.send([
                    "**[Infos]: Kick**",
                    "A kick just get someone out of the server. He will be able to join right after, but he won't have back his roles (except if a bot saved them).",
                    "\n__Sanction parameters:__",
                    "`,,automod add <number> kick [reason]`: **number**: number of modlogs to reach to get the sanction. | **reason**: Deafult \"Kicked by automod. | Too much modlogs!\", but you can change the reason."
                ].join("\n"));
            } else if (args[2] && args[2].toLowerCase() === "mute") {
                return message.channel.send([
                    "**[Infos]: Mute**",
                    "A mute is not a in discord sanction, by that, I mean you need bot to do a mute. The bot will give a user a role that will restrict his permissions for an amount of time.",
                    "You need to do `,,setup mute` to setup a role to give when a user will be muted (or i will create one).",
                    "\n__Sanction parameters:__",
                    "`,,automod add <number> mute <time> [reason]`: **number**: number of modlogs to reach to get the sanction. | **time**: time of the ban before he get unbanned. Number followed by __s, m, h, d__, respectively seconds, minutes, hours and days. | **reason**: Deafult \"Tempbanned by automod. | Too much modlogs!\", but you can change the reason."
                ].join("\n"));
            } else {
                return message.channel.send([
                    "**[Infos]: General**",
                    "	- Each sanctions will be logged (on the beginning and on the end of it) in the log channel. You can manually do each sanctions too.",
                    "	- The automoderation will help with moderations, giving \"pre ordered sanction\" if the amount of modlogs is reached.",
                    "	- The automoderation is mercyless, it will give the said sanction no matter what happened to get this amount of modlogs, so choose carrefully.",
                    "	- Autosanctions (such as leaving and rejoining the server and try to by pass a mute) will be logged in the log channel as \"unlogged sanction\", meaning that this action will not influence the automoderation.",
                    "	- Do `,,automod infos [ban/tempban/softban/kick/mute]` to get more infos about a sanction.",
                    "If you have any issues or questions about autosanctions/automoderation, please check out the support channel on my support server."
                ].join("\n"));
            }
        }

        //TODO unfinished
        // return message.channel.send("Going further is dangerous, this is an unfinished part of the code.");

        if (args[1].toLowerCase() === "add") {
            if (!args[2] || isNaN(args[2]) === true) return message.channel.send("You need to provide the number of modlogs to have to get the sanction.");
            if (args[2] <= 0) return message.channel.send("The number of modlogs must be bigger than 0.");

            const modlogsAmountTrigger = parseInt(args[2].toLowerCase());
            let reason = "No reason provided.";
            var duration = "";

            if (!args[3].toLowerCase() || args[3].toLowerCase() !== "ban" && args[3].toLowerCase() !== "tempban" && args[3].toLowerCase() !== "kick" && args[3].toLowerCase() !== "mute" && args[3].toLowerCase() !== "softban") return message.channel.send(`You need to choose a sanction when someone get ${modlogsAmountTrigger} modlogs. Sanctions types are: ban, tempban, softban, kick and mute.`);

            if (args[3].toLowerCase() === "mute") {
                if (!args[4].toLowerCase()) return message.channel.send("Please provide a duration for the mute like the following exemple:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
                try {
                    duration = ms(args[4].toLowerCase());
                    if (isNaN(duration)) return message.author.send("Please provide a duration like the following exemple:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
                } catch (e) {
                    console.log(e.stack);
                    return message.author.send("Please provide a duration like the following exemple:\n10m = 10 minutes, 100s = 100 seconds, 10d = 10 days, 10h = 10 hours");
                }

                if (args[5]) reason = args.slice(5).join(" ");

                const AM = GuildList[GID].other.automod;
                message.channel.send([
                    "I will add these automod sanction, and it will be enable, please confirm it:\n",
                    `[Sanction n°${AM.number + 1}] Type: **${args[3].toLowerCase()}**`,
                    `\`- Reason:\` ${reason}`,
                    `\`- Duration:\` ${ms(duration, { long: true })}`,
                    `This automod sanction will trigger when someone hit **${modlogsAmountTrigger} modlogs**.`
                ].join("\n")).then(msg => {
                    msg.react("✅");
                    msg.react("❌");
                    const filter = (reaction, user) => user.id === ID;
                    const collector = msg.createReactionCollector({ filter, time: 20000 });
                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name === "❌") {
                            collector.stop();
                            return message.channel.send("Autosanction creation canceled.");
                        }
                        if (reaction.emoji.name === "✅") {
                            AM.sanction[AM.number] = {
                                type: args[3].toLowerCase(),
                                reason: reason,
                                duration: ms(duration),
                                durationMS: duration,
                                amountTrigger: modlogsAmountTrigger,
                                userSanctionned: []
                            };
                            AM.number++;
                            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                                if (err) console.log(err);
                            });
                            return message.channel.send("Sanction created; do `,,automod list` to get a list of every sanctions.");
                        }
                    });
                });
            }

            if (args[3].toLowerCase() === "kick") {

            }

            if (args[3].toLowerCase() === "ban") {

            }

            if (args[3].toLowerCase() === "softban") {

            }

            if (args[3].toLowerCase() === "tempban") {

            }
        }
    }
};