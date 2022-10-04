const fs = require("fs");
const Event = require('../../Structures/Event');
const mtnce = require("../../Data/Maintenance.json");
const db = null; //TODO replace with my own library;
const ms = require("ms");
const ConfigFile = require('../../Data/ConfigFile.json');
const profile = require("../../Data/User.json");
const closedCommand = require("../../Data/closedCommand.json");
const GL = require("../../Data/Guild.json");
var colors = require("colors");
const { PermissionsBitField, Message } = require("discord.js");


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
        var GID = ID;

        if (message.guild && !GL[message.guildId]) utils.addGuildToDB(message);

        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`);

        if (!profile[ID]) {
            profile[ID] = {
                langue: "EN",
                color: "role",
                premium: false,
                data: {}
            };
            fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                if (err) utils.debugMessage(err, "Inner");
            });
        }

        if (message.guild) {
            const filterCommand = this.client.commands.get("FilterEvent".toLowerCase());
            await filterCommand.run(message).catch(error => {
                console.log(error.stack);
                if (ID == "431839245989183488") return message.channel.send("Error catched.");
            });
            const automodCommand = this.client.commands.get("AutomodEvent".toLowerCase());
            await automodCommand.run(message).catch(error => {
                console.log(error.stack);
                if (ID == "431839245989183488") return message.channel.send("Error catched.");
            });
        }
        if (!message.flags.has("SourceMessageDeleted")) {
            const mailCommand = this.client.commands.get("MailEvent".toLowerCase());
            await mailCommand.run(message).catch(error => {
                console.log(error.stack);
                if (ID == "431839245989183488") return message.channel.send("Error catched.");
            });
        }
        if (message.content.match(mentionRegex)) {
            if (message.guild) {
                if (profile[ID].langue == "FR") return message.author.send(`Mon préfix pour ${message.guild.name} est \`${ConfigFile[GID].prefix}\`.\nTapez \`${ConfigFile[GID].prefix}help\` si vous avez besoin d'aide.`);
                else return message.author.send(`My prefix for ${message.guild.name} is \`${ConfigFile[GID].prefix}\`.\nType \`${ConfigFile[GID].prefix}help\` if you need help.`);
            } else {
                if (profile[ID].langue == "FR") return message.author.send(`Mon préfix pour vous est \`,,\`.\nTapez \`,,help\` si vous avez besoin d'aide.`);
                else return message.author.send(`My prefix for you is \`,,\`.\nType \`,,help\` if you need help.`);
            }
        }

        let prefix = ",,";
        if (message.guild) prefix = message.content.match(mentionRegexPrefix) ? message.content.match(mentionRegexPrefix)[0] : ConfigFile[GID].prefix;

        if (!message.content.startsWith(prefix)) return;
        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

        if (command) {
            if (command.guildOnly == true && !message.guild) {
                if (profile[ID].langue == "FR") return message.author.send('Désolé, cette commande ne peut être utilisée que dans un serveur discord.');
                else return message.author.send('Sorry, this command can only be used in a discord server.');
            }

            //TODO Edit that to make it more configurable

            ////////////////////////////////////////////////////////////
            //MODE DE MAINTENANCE 
            if (ID !== "431839245989183488" && mtnce.maintenance == 1) {
                if (profile[ID].langue == "EN") message.author.send("I'm being upddated!\nFor more informations, check <#776547688753659965> in https://discord.gg/FVwnFP38P6 .");
                if (profile[ID].langue == "FR") message.author.send("Je suis entrain d'être mise à jour!\nPour plus d'informations, allez voir <#776547688753659965> dans https://discord.gg/FVwnFP38P6 .");
                return;
            }
            ////////////////////////////////////////////////////////////


            if (command.ownerOnly && !utils.checkOwner(ID)) {
                console.log("Owner command tried.");
                return;
            }
            var found = "";
            if (message.guild) {
                GL[GID].staff.forEach(element => {
                    if (message.member.roles.cache.has(element)) found = "staff";
                });
                GL[GID].mods.forEach(element => {
                    if (message.member.roles.cache.has(element)) found = "mod";
                });
                GL[GID].managers.forEach(element => {
                    if (message.member.roles.cache.has(element)) found = "manager";
                });
                GL[GID].admins.forEach(element => {
                    if (message.member.roles.cache.has(element)) found = "admin";
                });
                if (ID == message.guild.ownerId) found = "owner";
                else if (found == "") found = "server";
            } else found = "mp";

            if (ID !== "431839245989183488" && command.nsfw && message.guild && !message.channel.nsfw) {
                if (profile[ID].langue == "FR") return message.author.send('Désolé, cette commande doit être utilisée dans un salon de type NSFW.');
                else return message.author.send('Sorry, this command can only be ran in a NSFW marked channel.');
            }
            if (command.args && !args.length) {
                if (profile[ID].langue == "FR") return message.author.send(`Désolé, cette fontion utilise des arguments. Utilisation: ${command.usage ?
                    `${this.client.prefix + command.name} ${command.usage}` : 'Cette commande n\'a pas un format d\'utilisation.'}`);
                else return message.author.send(`Sorry, this command requires arguments to function. Usage: ${command.usage ?
                    `${this.client.prefix + command.name} ${command.usage}` : 'This command doesn\'t have a usage format'}`);
            }

            console.log(`Roles perms:${found}`.green);
            if (message.guild) {
                if (command.managerOnly && found !== "manager" && found !== "admin" && found !== "owner") {
                    if (profile[ID].langue == "EN") return message.author.send("This command can only be used by manager, admin or server owner.");
                    if (profile[ID].langue == "FR") return message.author.send("Cette commande ne peut être utilisée que par un manager, un admin, ou le propriétaire du serveur.");
                }
                if (command.modOnly && found !== "mod" && found !== "admin" && found !== "owner") {
                    if (profile[ID].langue == "EN") return message.author.send("This command can only be used by moderator, admin or server owner.");
                    if (profile[ID].langue == "FR") return message.author.send("Cette commande ne peut être utilisée que par un modérateur, un admin, ou le propriétaire du serveur.");
                }
                if (command.adminOnly && (found !== "admin" && found !== "owner" || message.member.permissions.has(PermissionsBitField.Flags.Administrator))) {
                    if (profile[ID].langue == "EN") return message.author.send("This command can only be used by admin or server owner.");
                    if (profile[ID].langue == "FR") return message.author.send("Cette commande ne peut être utilisée que par un admin, ou le propriétaire du serveur.");
                }
                if (command.guildOwnerOnly && found !== "owner") {
                    if (profile[ID].langue == "EN") return message.author.send("This command can only be used by server owner.");
                    if (profile[ID].langue == "FR") return message.author.send("Cette commande ne peut être utilisée que par le propriétaire du serveur.");
                }
                const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
                if (userPermCheck) {
                    const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
                    if (ID !== "431839245989183488" && missing.length) {
                        if (profile[ID].langue == "EN") return message.author.send(`You are missing ${utils.formatArray(missing.map(utils.formatPerms))} permissions, you need them to use this command!`);
                        if (profile[ID].langue == "FR") return message.author.send(`Vous manquez les permissions ${utils.formatArray(missing.map(utils.formatPerms))}, vous devez les avoir pour pouvoir utiliser cette commande!`);
                    }
                }
                const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPermsBot;
                if (botPermCheck) {
                    const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
                    if (missing.length) {
                        if (profile[ID].langue == "EN") return message.author.send(`I am missing ${utils.formatArray(missing.map(utils.formatPerms))} permissions, I need them to run this command!`);
                        if (profile[ID].langue == "FR") return message.author.send(`J'ai besoin des permissions ${utils.formatArray(missing.map(utils.formatPerms))} pour éxecuter cette commande!`);
                    }
                }
            }
            if (ID !== `431839245989183488`) {
                let timer = db.fetch(`SMCyra${command.name}.${ID}`) - Date.now();
                if (db.has(`SMCyra${command.name}.${ID}`) && (timer >= 0)) {
                    if (timer < 1000) timer = 100;
                    if (langue[ID].langue == `EN`) return message.reply(`Please slow down! Wait ${ms(timer, { long: true })} before using this command again.`).then(msg => { return msg.delete({ timeout: 5000 }); });
                    if (langue[ID].langue == `FR`) return message.reply(`Ralentissez s'il vous plait! Attendez ${ms(timer, { long: true })} avant de refaire cette commande..`).then(msg => { return msg.delete({ timeout: 5000 }); });
                }
                let timeuser = command.cooldown;
                db.set(`SMCyra${command.name}.${ID}`, Date.now() + ms(timeuser));
                const interval = setInterval(function () {
                    if (Date.now() > db.fetch(`SMCyra${command.name}.${ID}`)) {
                        db.delete(`SMCyra${command.name}.${ID}`);
                        clearInterval(interval);
                    }
                }, 1000);
            }
            let role = found;
            console.log([
                `=============================`,
                `Command used: ${command.name}`,
                `User: ${message.author.id}`,
                `Rank: ${role}`,
                `At: ${utils.exactDate()}`,
                `=============================`
            ].join('\n'));
            if (!closedCommand[command.name]) {
                command.run(message, args).catch(error => {
                    console.log(error.stack);
                    if (ID == "431839245989183488") return message.channel.send("Error catched.");
                    const name = command.name;
                    if (!closedCommand[name]) {
                        closedCommand[name] = {
                            number: 0,
                            error: ""
                        };
                    }
                    closedCommand[name].number++;
                    closedCommand[name].error = error;
                    fs.writeFile("./src/Data/closedCommand.json", JSON.stringify(closedCommand, closedCommand, 3), function (err) {
                        if (err) console.log(err);
                    });
                    if (closedCommand[name].number == 1) {
                        this.client.channels.cache.get("783000325954994216").send(`La commande **${name}** à produit l'erreur suivante:\n${error}`);
                    }
                    if (profile[ID].langue == "EN") message.author.send(`☢ This command is closed because she gives multiples errors.\nCommand: \`\`${name}\`\`\nError number: \`\`${closedCommand[name].number}\`\``);
                    if (profile[ID].langue == "FR") message.author.send(`☢ Cette commande est fermée car elle a donné de multiples erreurs.\nCommande: \`\`${name}\`\`\nNombre d'erreurs: \`\`${closedCommand[name].number}\`\``);
                });
            } else {
                if (profile[ID].langue == "EN") message.author.send(`☢ This command is closed because she gives multiples errors.`);
                if (profile[ID].langue == "FR") message.author.send(`☢ Cette commande est fermée car elle a donné de multiple erreurs.`);
            }
        }
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