const Event = require('../../Structures/Event');
const { PermissionsBitField, Message } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
var colors = require("colors");

const UserList = require("../../Data/User.json");
const GuildList = require("../../Data/Guild.json");
const MaintenanceData = require("../../Data/Maintenance.json");

const db = null; //TODO replace with my own library;

//TODO UPDATE THIS CRAP
module.exports = class extends Event {
    /**
    * @param {Message} message 
    */
    async run(message) {
        if (message.author.bot) return;
        if (message.partial) await message.fetch();
        const ID = message.author.id,
            utils = this.client.utils;

        if (message.guild && !GuildList[message.guildId]) utils.addGuildToDB(message);

        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);

        if (!UserList[ID]) utils.addUserToDB(message);

        //TODO fix at some point
        if (message.guild && false) {
            const filterCommand = this.client.commands.get("FilterEvent".toLowerCase());
            await filterCommand.run(message).catch(error => {
                this.client.utils.debugMessage(error, "Command");
                if (this.client.owners.includes(ID)) return message.channel.send("Error catched.");
            });
            const automodCommand = this.client.commands.get("AutomodEvent".toLowerCase());
            await automodCommand.run(message).catch(error => {
                this.client.utils.debugMessage(error, "Command");
                if (this.client.owners.includes(ID)) return message.channel.send("Error catched.");
            });
            const userEditCommand = this.client.commands.get("UserEdit".toLowerCase());
            await userEditCommand.run(message).catch(error => {
                this.client.utils.debugMessage(error, "Command");
                if (this.client.owners.includes(ID)) return message.channel.send("Error catched.");
            });
        }
        //TODO Remove at some point
        if (!message.flags.has("SourceMessageDeleted") && false) {
            const mailCommand = this.client.commands.get("MailEvent".toLowerCase());
            await mailCommand.run(message).catch(error => {
                this.client.utils.debugMessage(error, "Command");
                if (this.client.owners.includes(ID)) return message.channel.send("Error catched.");
            });
        }
        if (message.content.match(mentionRegex)) {
            if (message.guild) {
                if (UserList[ID].langue == "FR") return message.reply(`Mon préfix pour ${message.guild.name} est \`${GuildList[message.guildId].prefix}\`.\nTapez \`${GuildList[message.guildId].prefix}help\` si vous avez besoin d'aide.`);
                else return message.reply(`My prefix for ${message.guild.name} is \`${GuildList[message.guildId].prefix}\`.\nType \`${GuildList[message.guildId].prefix}help\` if you need help.`);
            } else {
                if (UserList[ID].langue == "FR") return message.author.send(`Mon préfix pour vous est \`,,\`.\nTapez \`,,help\` si vous avez besoin d'aide.`);
                else return message.author.send(`My prefix for you is \`,,\`.\nType \`,,help\` if you need help.`);
            }
        }

        let prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : ",,";
        if (message.guild) prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : GuildList[message.guildId].prefix;

        if (!message.content.startsWith(prefix)) return;
        //TODO Remove at some point
        if (!this.client.owners.includes(ID)) return message.reply("I'm currently being updated to support the newest version of discord!");

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

        if (command) {
            //! Maintenance mode
            if (ID !== "431839245989183488" && MaintenanceData.maintenance == 1) {
                if (UserList[ID].langue == "FR") message.reply("Je suis entrain d'être mise à jour!\nPour plus d'informations, allez voir <#776547688753659965> dans https://discord.gg/FVwnFP38P6 .");
                else message.reply("I'm being upddated!\nFor more informations, check <#776547688753659965> in https://discord.gg/FVwnFP38P6 .");
                return;
            }

            if (command.closed) {
                //check if it should re open
                if (command.openTime != 0 && command.openTime <= Date.now()) {
                    command.closed = false;
                } else {
                    //reason is null if it's an error
                    if (!command.reason) {
                        if (UserList[ID].langue == "FR") message.reply("La commande est fermé à cause d'un problème. Elle ne réouvrira que quand celui ci sera réglé.");
                        else message.reply("The command is closed because of a problems. It will not reopen until it's fixed.");
                    } else {
                        if (UserList[ID].langue == "FR") message.reply(`${command.reason} Temps avant ré ouverture: ${ms(command.openTime - Date.now())}`);
                        else message.reply(`${command.reason} Repoen time: ${ms(command.openTime - Date.now())}`);
                    }

                    if (!this.client.owners.includes(ID)) return;
                }
            }

            if (command.guildOnly == true && !message.guild) {
                if (UserList[ID].langue == "FR") return message.author.send('Désolé, cette commande ne peut être utilisée que dans un serveur discord.');
                else return message.author.send('Sorry, this command can only be used in a discord server.');
            }

            if (command.ownerOnly && !utils.checkOwner(ID)) {
                console.log("Owner command tried.");
                return;
            }

            const found = this.getUserPermissionRank(message);

            if (ID !== "431839245989183488" && command.nsfw && message.guild && !message.channel.nsfw) {
                if (UserList[ID].langue == "FR") return message.author.send('Désolé, cette commande doit être utilisée dans un salon de type NSFW.');
                else return message.author.send('Sorry, this command can only be ran in a NSFW marked channel.');
            }
            if (command.args && !args.length) {
                if (UserList[ID].langue == "FR") return message.author.send(`Désolé, cette fontion utilise des arguments. Utilisation: ${command.usage ?
                    `${this.client.prefix + command.name} ${command.usage}` : 'Cette commande n\'a pas un format d\'utilisation.'}`);
                else return message.author.send(`Sorry, this command requires arguments to function. Usage: ${command.usage ?
                    `${this.client.prefix + command.name} ${command.usage}` : 'This command doesn\'t have a usage format'}`);
            }

            console.log(`Roles perms:${found}`.green);
            if (message.guild) {
                if (command.guildWhiteList.length > 0 && !command.guildWhiteList.includes(message.guildId)) {
                    if (UserList[ID].langue == "FR") return message.reply("Cette commande c'est pas disponible sur ce serveur.");
                    else return message.reply("This command is unavailable on this server.");
                }
                if (command.managerOnly && found !== "manager" && found !== "admin" && found !== "owner") {
                    if (UserList[ID].langue == "FR") return message.reply("Cette commande ne peut être utilisée que par un manager, un admin, ou le propriétaire du serveur.");
                    else return message.reply("This command can only be used by manager, admin or server owner.");
                }
                if (command.modOnly && found !== "mod" && found !== "admin" && found !== "owner") {
                    if (UserList[ID].langue == "FR") return message.reply("Cette commande ne peut être utilisée que par un modérateur, un admin, ou le propriétaire du serveur.");
                    else return message.reply("This command can only be used by moderator, admin or server owner.");
                }
                if (command.adminOnly && (found !== "admin" && found !== "owner")) {
                    if (UserList[ID].langue == "FR") return message.reply("Cette commande ne peut être utilisée que par un admin, ou le propriétaire du serveur.");
                    else return message.reply("This command can only be used by admin or server owner.");
                }
                if (command.guildOwnerOnly && found !== "owner") {
                    if (UserList[ID].langue == "FR") return message.reply("Cette commande ne peut être utilisée que par le propriétaire du serveur.");
                    else return message.reply("This command can only be used by server owner.");
                }
                const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
                if (userPermCheck) {
                    const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
                    if (ID !== "431839245989183488" && missing.length) {
                        if (UserList[ID].langue == "FR") return message.reply(`Vous manquez les permissions ${utils.formatArray(missing.map(utils.formatPerms))}, vous devez les avoir pour pouvoir utiliser cette commande!`);
                        else return message.reply(`You are missing ${utils.formatArray(missing.map(utils.formatPerms))} permissions, you need them to use this command!`);
                    }
                }
                const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPermsBot;
                if (botPermCheck) {
                    const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
                    if (missing.length) {
                        if (UserList[ID].langue == "FR") return message.reply(`J'ai besoin des permissions ${utils.formatArray(missing.map(utils.formatPerms))} pour éxecuter cette commande!`);
                        else return message.reply(`I am missing ${utils.formatArray(missing.map(utils.formatPerms))} permissions, I need them to run this command!`);
                    }
                }
            }

            //TODO Use a method for timeout
            // if (ID !== `431839245989183488`) {
            //     let timer = db.fetch(`SMCyra${command.name}.${ID}`) - Date.now();
            //     if (db.has(`SMCyra${command.name}.${ID}`) && (timer >= 0)) {
            //         if (timer < 1000) timer = 1000;
            //         if (langue[ID].langue == `FR`) return message.reply(`Ralentissez s'il vous plait! Attendez ${ms(timer, { long: true })} avant de refaire cette commande..`).then(msg => { return msg.delete({ timeout: 5000 }); });
            //         return message.reply(`Please slow down! Wait ${ms(timer, { long: true })} before using this command again.`).then(msg => { return msg.delete({ timeout: 5000 }); });
            //     }
            //     let timeuser = command.cooldown;
            //     db.set(`SMCyra${command.name}.${ID}`, Date.now() + ms(timeuser));
            //     const interval = setInterval(function () {
            //         if (Date.now() > db.fetch(`SMCyra${command.name}.${ID}`)) {
            //             db.delete(`SMCyra${command.name}.${ID}`);
            //             clearInterval(interval);
            //         }
            //     }, 1000);
            // }

            console.log([
                `=============================`,
                `Command used: ${command.name}`,
                `User: ${message.author.id}`,
                `Rank: ${found}`,
                `At: ${utils.exactDate()}`,
                `=============================`
            ].join('\n'));

            command.run(message, args).catch(error => {
                command.error.push(error);
                command.closed = true;
                command.openTime = 0;

                console.error(error.stack);
                if (this.client.owners.includes(ID)) return message.channel.send("Error catched.");
                else if (UserList[ID].langue == "FR") message.reply("Quelque chose a vraiment mal tourner, et la commande a été fermée.");
                else message.reply("Something went terribly wrong, and the command was closed.");
            });
        } else {
            console.log("Unknown command");
        }
    }

    /**
     * @param {Message} message
     * @return {"staff"|"mod"|"manager"|"admin"|"owner"|"server"|"mp"} 
     */
    getUserPermissionRank(message) {
        if (message.guild) {
            GuildList[message.guildId].staff.forEach(element => {
                if (message.member.roles.cache.has(element)) return "staff";
            });
            GuildList[message.guildId].mods.forEach(element => {
                if (message.member.roles.cache.has(element)) return "mod";
            });
            GuildList[message.guildId].managers.forEach(element => {
                if (message.member.roles.cache.has(element)) return "manager";
            });
            GuildList[message.guildId].admins.forEach(element => {
                if (message.member.roles.cache.has(element)) return "admin";
            });
            //special case when a user ahve perms and not a role
            if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return "admin";
            if (message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return "manager";
            if (ID == message.guild.ownerId) return "owner";
            else if (found == "") return "server";
        } else return "mp";
    }
};
/*
CreateInstantInvite
KickMembers
BanMembers
Administrator
ManageChannels
ManageGuild
AddReactions
ViewAuditLog
PrioritySpeaker
Stream
ViewChannel
SendMessages
SendTTSMessages
ManageMessages
EmbedLinks
AttachFiles
ReadMessageHistory
MentionEveryone
UseExternalEmojis
ViewGuildInsights
Connect
Speak
MuteMembers
DeafenMembers
MoveMembers
UseVAD
ChangeNickname
ManageNicknames
ManageRoles
ManageWebhooks
ManageEmojisAndStickers
UseApplicationCommands
RequestToSpeak
ManageEvents
ManageThreads
CreatePublicThreads
CreatePrivateThreads
UseExternalStickers
SendMessagesInThreads
UseEmbeddedActivities
ModerateMembers
*/