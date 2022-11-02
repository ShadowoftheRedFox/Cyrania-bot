const Command = require("../../Structures/Command");
const GuildList = require("../../Data/Guild.json");
const fs = require("fs");
/**
 * @type {UserList}
 */
const UserList = require("../../Data/User.json");
const { PermissionFlagsBits, Message } = require("discord.js");

/**
 * @param {string[]} arr
 * @returns {boolean} 
 */
function existRole(arr) {
    if (arr.length == 0) return false;
    else {
        let result = false;
        arr.forEach(r => {
            // search for a non undefined/null value
            if (!!r) result = true;
        });
        return result;
    }
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Setup the bot in your server.', "Modifie le bot pour l'adapter à votre serveur."],
            category: ['Utilities', "Utilité"],
            aliases: ["param", "parameters", "parametre"],
            managerOnly: true,
            guildOnly: true
        });
    }

    /**
     * @param {Message} message 
     * @param {string} param
     * @returns 
     */
    async run(message, [main, sub1, sub2, ...args]) {
        const GID = message.guild.id;
        const argss = message.content.toLowerCase().split(" ");
        const ID = message.author.id;
        const color = await this.client.utils.getClientColorInGuild(message);
        const ThisServerPrefix = GuildList[GID].prefix;
        const User = UserList[ID];

        switch (main) {
            case "pre":
            case "prefix": {
                if (!sub1) {
                    if (User.langue === "FR") return message.reply(`Le préfix pour ce serveur est: **${ThisServerPrefix}**.\n Vous voulez un préfix différent? Envoyez ceci sans les **[]**: \`\`,,setup prefix [Nouveau préfix]\`\`\n Vous voulez remettre le préfix par défaut? Envoyez: \`\`,,setup prefix reset\`\``);
                    else return message.channel.send(`The prefix for this server is: **${ThisServerPrefix}**.\n You want a different prefix? Send this without the **[]**: \`\`,,setup prefix [New prefix]\`\`\n You want to reset the prefix? Send: \`\`,,setup prefix reset\`\``);
                } else if (sub1 == "reset") {
                    GuildList[GID].prefix = ",,";
                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                        if (err) console.log(err);
                    });
                    if (User.langue === "FR") return message.channel.send(`Le préfix a bien été changé de **${ThisServerPrefix}** à **,,** .`);
                    else return message.channel.send(`Successfully change the prefix from **${ThisServerPrefix}** to **,,** .`);
                } else {
                    GuildList[GID].prefix = sub1.trim();
                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                        if (err) console.log(err);
                    });
                    if (User.langue === "FR") return message.channel.send(`Le préfix a bien été changé de **${ThisServerPrefix}** à **${sub1}** .`);
                    else return message.channel.send(`Successfully change the prefix from **${ThisServerPrefix}** to **${sub1}** .`);
                }
                break;
            }
            case "logging":
            case "log":
            case "logs": {
                sub1 = sub1.toLowerCase();
                switch (sub1) {
                    case "active":
                    case "enable": {
                        sub2 = sub2.toLowerCase();
                        switch (sub2) {
                            case "on":
                            case "true": {
                                if (GuildList[GID].logging.enable) {
                                    if (User.langue === "FR") return message.channel.send("Cette fonctionnalité est déjà activée!");
                                    else return message.channel.send("This feature is already enabled!");
                                } else {
                                    GuildList[GID].logging.enable = true;
                                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                                        if (err) console.log(err);
                                    });
                                    if (User.langue === "FR") return message.channel.send("Cette fonctionnalité est maintenant activée.");
                                    else return message.channel.send("This feature is now enabled.");
                                }
                                break;
                            }
                            case "off":
                            case "false": {
                                if (!GuildList[GID].logging.enable) {
                                    if (User.langue === "FR") return message.channel.send("Cette fonctionnalité est déjà désactivée!");
                                    else return message.channel.send("This feature is already disabled!");
                                } else {
                                    GuildList[GID].logging.enable = false;
                                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                                        if (err) console.log(err);
                                    });
                                    if (User.langue === "FR") return message.channel.send("Cette fonctionnalité est maintenant désactivée.");
                                    else return message.channel.send("This feature is now disabled.");
                                }
                                break;
                            }
                            default: {
                                if (User.langue === "FR") return message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup logs active <on/off>\``);
                                else return message.reply(`What do you want to do? \`${ThisServerPrefix}setup logs enable <on/off>\``);
                            }
                        }
                        break;
                    }
                    case "salon":
                    case "channel": {
                        if (!sub2) {
                            if (User.langue === "FR") return message.channel.send("Veuillez donnez l'ID du salon où vont être envoyés les logs ou le mentionner.");
                            else return message.channel.send("Please provide the ID of the channel where the logs will be sent or tag the channel.");
                        }
                        const logChannel = message.mentions.channels.first() || message.guild.channels.cache.get(sub2) || message.guild.channels.cache.find(ch => ch.id.includes(sub2));
                        if (!logChannel) {
                            if (User.langue === "FR") return message.channel.send("Je n'arrive pas à trouver ce salon sur ce serveur.");
                            else return message.channel.send("I can't find this channel on this server.");
                        }
                        GuildList[GID].logging.channel = logChannel.id;
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        if (User.langue === "FR") return message.channel.send(`Le salon des logs est désormais <#${logChannel.id}>.`);
                        else return message.channel.send(`The log channel is now <#${logChannel.id}>.`);
                        break;
                    }
                    default: {
                        if (User.langue === "FR") return message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup logs <active/salon>\``);
                        else return message.reply(`What do you want to do? \`${ThisServerPrefix}setup logs <enable/channel>\``);
                    }
                }
                break;
            }
            case "admin":
            case "admins":
            case "administrator":
            case "administrators":
            case "administrateur":
            case "administrateurs":
            case "op":
            case "operator": {
                const roles = args.concat(sub2);
                let alreadyIn = [];
                let toAdd = [];
                let names = ["administrator", "administrateur"];
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        if (!existRole(roles)) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to be considered as ${names[0]} by the bot.`);
                        }
                        //we now know that at least a role is present
                        //go through all of them to check if there are duplicates
                        roles.forEach((role, i) => {
                            let r = message.mentions.roles.at(i) || message.guild.roles.cache.get(role) || message.guild.roles.cache.find(ch => ch.id.includes(role));
                            if (r) {
                                if (GuildList[ID].admins.includes(r.id)) alreadyIn.push(r.id);
                                else toAdd.push(r.id);
                            }
                        });
                        if (alreadyIn.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${alreadyIn[0]}> est déjà considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${alreadyIn[0]}> is already considered as ${names[0]}.`);
                        } else if (alreadyIn.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${alreadyIn.join(">, <@")}> sont déjà considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${alreadyIn.join(" >, <@")}> are already considered as ${names[0]}s.`);
                        }

                        GuildList[GID].admins = GuildList[GID].admins.concat(toAdd);
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });

                        if (toAdd.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${toAdd[0]}> est désormais considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${toAdd[0]}> is now considered as ${names[0]}.`);
                        } else if (toAdd.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${toAdd.join(">, <@")}> sont désormais considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${toAdd.join(" >, <@")}> are now considered as ${names[0]}s.`);
                        }
                        break;
                    }
                    case "remove":
                    case "enlever": {
                        if (!role) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to not be considered as ${names[0]} by the bot.`);
                        }

                        console.log(`Before: ${GuildList[GID].admins}`);
                        const index = GuildList[GID].admins.indexOf(role.id);
                        if (index > -1) {
                            GuildList[GID].admins.splice(index, 1);
                            console.log(`After: ${GuildList[GID].admins}`);
                        } else {
                            if (User.langue === "FR") return message.channel.send(`Ce rôle n'est déjà pas considéré comme ${names[1]} par le bot.`);
                            else return message.channel.send(`This role is already not considered as a ${names[0]} role by the bot.`);
                        }
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        if (User.langue === "FR") return message.channel.send(`Ce rôle n'est plus considéré comme ${names[1]} par le bot.`);
                        else return message.channel.send(`This role is no longer considered ${names[0]} by the bot.`);
                        break;
                    }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup admin <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup admin <add/remove> <role> [roles]\``);
                    }
                }
                break;
            }
            case "manager":
            case "managers":
            case "manageur":
            case "manageurs": {
                const roles = args.concat(sub2);
                let alreadyIn = [];
                let toAdd = [];
                let names = ["manager", "manageur"];
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        if (!existRole(roles)) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to be considered as ${names[0]} by the bot.`);
                        }
                        //we now know that at least a role is present
                        //go through all of them to check if there are duplicates
                        roles.forEach((role, i) => {
                            let r = message.mentions.roles.at(i) || message.guild.roles.cache.get(role) || message.guild.roles.cache.find(ch => ch.id.includes(role));
                            if (r) {
                                if (GuildList[ID].managers.includes(r.id)) alreadyIn.push(r.id);
                                else toAdd.push(r.id);
                            }
                        });
                        if (alreadyIn.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${alreadyIn[0]}> est déjà considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${alreadyIn[0]}> is already considered as ${names[0]}.`);
                        } else if (alreadyIn.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${alreadyIn.join(">, <@")}> sont déjà considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${alreadyIn.join(" >, <@")}> are already considered as ${names[0]}s.`);
                        }

                        GuildList[GID].managers = GuildList[GID].managers.concat(toAdd);
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });

                        if (toAdd.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${toAdd[0]}> est désormais considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${toAdd[0]}> is now considered as ${names[0]}.`);
                        } else if (toAdd.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${toAdd.join(">, <@")}> sont désormais considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${toAdd.join(" >, <@")}> are now considered as ${names[0]}s.`);
                        }
                        break;
                    }
                    case "remove":
                    case "enlever": {
                        if (!role) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to not be considered as ${names[0]} by the bot.`);
                        }

                        console.log(`Before: ${GuildList[GID].managers}`);
                        const index = GuildList[GID].managers.indexOf(role.id);
                        if (index > -1) {
                            GuildList[GID].managers.splice(index, 1);
                            console.log(`After: ${GuildList[GID].managers}`);
                        } else {
                            if (User.langue === "FR") return message.channel.send(`Ce rôle n'est déjà pas considéré comme ${names[1]} par le bot.`);
                            else return message.channel.send(`This role is already not considered as a ${names[0]} role by the bot.`);
                        }
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        if (User.langue === "FR") return message.channel.send(`Ce rôle n'est plus considéré comme ${names[1]} par le bot.`);
                        else return message.channel.send(`This role is no longer considered ${names[0]} by the bot.`);
                        break;
                    }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup manageur <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup manager <add/remove> <role> [roles]\``);
                    }
                }
                break;
            }
            case "mod":
            case "mods":
            case "moderator":
            case "moderators":
            case "moderateur":
            case "moderateurs": {
                const roles = args.concat(sub2);
                let alreadyIn = [];
                let toAdd = [];
                let names = ["moderator", "moderateur"];
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        if (!existRole(roles)) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to be considered as ${names[0]} by the bot.`);
                        }
                        //we now know that at least a role is present
                        //go through all of them to check if there are duplicates
                        roles.forEach((role, i) => {
                            let r = message.mentions.roles.at(i) || message.guild.roles.cache.get(role) || message.guild.roles.cache.find(ch => ch.id.includes(role));
                            if (r) {
                                if (GuildList[ID].mods.includes(r.id)) alreadyIn.push(r.id);
                                else toAdd.push(r.id);
                            }
                        });
                        if (alreadyIn.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${alreadyIn[0]}> est déjà considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${alreadyIn[0]}> is already considered as ${names[0]}.`);
                        } else if (alreadyIn.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${alreadyIn.join(">, <@")}> sont déjà considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${alreadyIn.join(" >, <@")}> are already considered as ${names[0]}s.`);
                        }

                        GuildList[GID].mods = GuildList[GID].mods.concat(toAdd);
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });

                        if (toAdd.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${toAdd[0]}> est désormais considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${toAdd[0]}> is now considered as ${names[0]}.`);
                        } else if (toAdd.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${toAdd.join(">, <@")}> sont désormais considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${toAdd.join(" >, <@")}> are now considered as ${names[0]}s.`);
                        }
                        break;
                    }
                    case "remove":
                    case "enlever": {
                        if (!role) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to not be considered as ${names[0]} by the bot.`);
                        }

                        console.log(`Before: ${GuildList[GID].mods}`);
                        const index = GuildList[GID].mods.indexOf(role.id);
                        if (index > -1) {
                            GuildList[GID].mods.splice(index, 1);
                            console.log(`After: ${GuildList[GID].mods}`);
                        } else {
                            if (User.langue === "FR") return message.channel.send(`Ce rôle n'est déjà pas considéré comme ${names[1]} par le bot.`);
                            else return message.channel.send(`This role is already not considered as a ${names[0]} role by the bot.`);
                        }
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        if (User.langue === "FR") return message.channel.send(`Ce rôle n'est plus considéré comme ${names[1]} par le bot.`);
                        else return message.channel.send(`This role is no longer considered ${names[0]} by the bot.`);
                        break;
                    }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup moderateur <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup moderator <add/remove> <role> [roles]\``);
                    }
                }
                break;
            }
            case "staff":
            case "equipe": {
                const roles = args.concat(sub2);
                let alreadyIn = [];
                let toAdd = [];
                let names = ["staff", "staff"];
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        if (!existRole(roles)) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to be considered as ${names[0]} by the bot.`);
                        }
                        //we now know that at least a role is present
                        //go through all of them to check if there are duplicates
                        roles.forEach((role, i) => {
                            let r = message.mentions.roles.at(i) || message.guild.roles.cache.get(role) || message.guild.roles.cache.find(ch => ch.id.includes(role));
                            if (r) {
                                if (GuildList[ID].staff.includes(r.id)) alreadyIn.push(r.id);
                                else toAdd.push(r.id);
                            }
                        });
                        if (alreadyIn.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${alreadyIn[0]}> est déjà considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${alreadyIn[0]}> is already considered as ${names[0]}.`);
                        } else if (alreadyIn.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${alreadyIn.join(">, <@")}> sont déjà considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${alreadyIn.join(" >, <@")}> are already considered as ${names[0]}s.`);
                        }

                        GuildList[GID].staff = GuildList[GID].staff.concat(toAdd);
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });

                        if (toAdd.length == 1) {
                            if (User.langue === "FR") return message.channel.send(`Le rôle <@${toAdd[0]}> est désormais considéré comme ${names[1]}.`);
                            else return message.channel.send(`The role <@${toAdd[0]}> is now considered as ${names[0]}.`);
                        } else if (toAdd.length > 1) {
                            if (User.langue === "FR") return message.channel.send(`<@${toAdd.join(">, <@")}> sont désormais considérés comme ${names[1]}s.`);
                            else return message.channel.send(`<@${toAdd.join(" >, <@")}> are now considered as ${names[0]}s.`);
                        }
                        break;
                    }
                    case "remove":
                    case "enlever": {
                        if (!role) {
                            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme ${names[1]}.`);
                            else return message.channel.send(`Please tag or type the id of a role you want to not be considered as ${names[0]} by the bot.`);
                        }

                        console.log(`Before: ${GuildList[GID].staff}`);
                        const index = GuildList[GID].staff.indexOf(role.id);
                        if (index > -1) {
                            GuildList[GID].staff.splice(index, 1);
                            console.log(`After: ${GuildList[GID].staff}`);
                        } else {
                            if (User.langue === "FR") return message.channel.send(`Ce rôle n'est déjà pas considéré comme ${names[1]} par le bot.`);
                            else return message.channel.send(`This role is already not considered as a ${names[0]} role by the bot.`);
                        }
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        if (User.langue === "FR") return message.channel.send(`Ce rôle n'est plus considéré comme ${names[1]} par le bot.`);
                        else return message.channel.send(`This role is no longer considered ${names[0]} by the bot.`);
                        break;
                    }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup staff <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup staff <add/remove> <role> [roles]\``);
                    }
                }
                break;
            }
            case "role":
            case "roles": {
                //TODO
                break;
            }
            case "mute":
            case "muet": {
                // check if the bot has the perms to do that action
                const botPermCheck = this.client.defaultPerms.add([PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]);
                if (botPermCheck) {
                    const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
                    if (missing.length) {
                        if (UserList[ID].langue == "FR") return message.reply(`J'ai besoin des permissions ${utils.formatArray(missing.map(utils.formatPerms))} pour éxecuter cette commande!`);
                        else return message.reply(`I am missing ${utils.formatArray(missing.map(utils.formatPerms))} permissions, I need them to run this command!`);
                    }
                }

                switch (sub1) {
                    case "new":
                    case "nouveau":
                    case "creer":
                    case "create":
                        // create a new role
                        let MutedRoleIsBlind = false;
                        if (["on", "yes", "oui", "enable", "true", "vrai", "blind", "aveugle"].includes(sub2)) MutedRoleIsBlind = true;

                        try {
                            const role = await message.guild.roles.create({
                                name: 'Muted',
                                color: '#514f48',
                                permissions: [],
                                reason: `Setup mute role by ${message.author.tag} ${(MutedRoleIsBlind) ? "as blind" : ""}`,
                                unicodeEmoji: "🔇"
                            });

                            // create data in DB
                            if (!GuildList[GID].other.mute) {
                                GuildList[GID].mute = {
                                    role: role.id,
                                    users: []
                                };
                            } else {
                                GuildList[GID].mute.role = role.id;
                            }

                            // overwrite all channel with the new role
                            message.guild.channels.cache.forEach(async channel => {
                                await channel.permissionOverwrites.edit(role, {
                                    SEND_MESSAGES: false,
                                    SPEAK: false,
                                    ADD_REACTIONS: false,
                                    SEND_TTS_MESSAGES: false,
                                    ATTACH_FILES: false,
                                    VIEW_CHANNEL: !MutedRoleIsBlind,
                                }, `Setup mute role by ${message.author.tag} ${(MutedRoleIsBlind) ? "as blind" : ""}`);
                            });
                        } catch (error) {
                            console.error(error);
                            return message.channel.send("An error happened during the process. Try again or contact support.");
                        }

                        // if no error, save and exit
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });

                        if (User.langue === "FR") return message.channel.send("Le rôle a été créé et chaques salons a été mis à jour.");
                        else return message.channel.send("The Muted role has been created and every channels have been updated.");
                        break;
                    case "use":
                    case "utiliser":
                        // use an already existing role
                        MutedRoleIsBlind = false;
                        if (["on", "yes", "oui", "enable", "true", "vrai", "blind", "aveugle"].includes(args[0])) MutedRoleIsBlind = true;

                        try {
                            const role = message.mentions.roles.first() || message.guild.roles.cache.get(sub2) || message.guild.roles.cache.find(r => r.id.includes(sub2));
                            if (!role) {
                                if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme le rôle muet par le bot.");
                                else return message.channel.send("Please tag or type the id of the role you want to be considered as the muted role by the bot.");
                            }

                            // create data in DB
                            if (!GuildList[GID].other.mute) {
                                GuildList[GID].mute = {
                                    role: role.id,
                                    users: []
                                };
                            } else {
                                GuildList[GID].mute.role = role.id;
                            }

                            // overwrite all channel with the new role
                            message.guild.channels.cache.forEach(async channel => {
                                await channel.permissionOverwrites.edit(role, {
                                    SEND_MESSAGES: false,
                                    SPEAK: false,
                                    ADD_REACTIONS: false,
                                    SEND_TTS_MESSAGES: false,
                                    ATTACH_FILES: false,
                                    VIEW_CHANNEL: !MutedRoleIsBlind,
                                }, `Setup mute role by ${message.author.tag} ${(MutedRoleIsBlind) ? "as blind" : ""}`);
                            });
                        } catch (error) {
                            console.error(error);
                            return message.channel.send("An error happened during the process. Try again or contact support.");
                        }

                        // if no error, save and exit
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });

                        if (User.langue === "FR") return message.channel.send("Le rôle a été créé et chaques salons a été mis à jour.");
                        else return message.channel.send("The Muted role has been created and every channels have been updated.");
                        break;
                    default: {
                        // help message about mute setup
                        if (User.langue === "FR") return message.reply([
                            `Vous pouvez créer un rôle muet en faisant \`${ThisServerPrefix}setup mute creer [aveugle]\`.`,
                            "Si aveugle est \`true\`, les personnes ayant le rôles ne veront pas les salons.",
                            "Il faudra exclure manuellement les salons qui pourront être vu par le rôle.\n",
                            `Ou vous pouvez aussi utiliser un rôle déjà existant en tant que rôle muet avec \`${ThisServerPrefix}setup mute utiliser <mention du rôle ou son ID> [aveugle]\`.`
                        ].join("\n"));
                        else return message.reply([
                            `You can create a muted role by doing \`${ThisServerPrefix}setup mute create [blind]\`.`,
                            "If the blind is \`true\`, peoples having this role won't be able to see the channels.",
                            "You will need to manualy esit channel where you want them to see it.\n",
                            `Or you can also use an already existing role which will be used as the muted role with \`${ThisServerPrefix}setup mute user <role mention or its ID> [blind]\`.`
                        ].join("\n"));
                    }
                }
                break;
            }
            default: {
                if (User.langue === "FR") return message.reply([
                    `- \`${ThisServerPrefix}setup prefix\`: Change le préfix pour le serveur.`,
                    `- \`${ThisServerPrefix}setup logs <active/salon>\`: Gère le module de logs.`,
                    `- \`${ThisServerPrefix}setup <admin/mod/manager/staff> <role tag>\`: Ajoute un rôle que le bot considéra comme admin/manageur/modérateur/staff.`,
                    `- \`${ThisServerPrefix}setup roles\`: Donne une liste de tout les rôles sauvegardés.`,
                    `- \`${ThisServerPrefix}setup mute <role tag or ID/create> <ne vera pas les salons: true>\`: Met en place ou crée un rôle pour les personnes muettes, avec la possibilité de ne voir aucun salon.`
                ].join("\n"));
                else return message.reply([
                    `- \`${ThisServerPrefix}setup prefix\`: Change the prefix for this guild.`,
                    `- \`${ThisServerPrefix}setup logs <enable/channel>\`: Manage the logs module.`,
                    `- \`${ThisServerPrefix}setup <admin/mod/manager/staff> <role tag>\`: Add a role and the bot will consider user with it admin/manager/moderator/staff.`,
                    `- \`${ThisServerPrefix}setup roles\`: Give a list of every role saved.`,
                    `- \`${ThisServerPrefix}setup mute <role tag or ID/create> <can't see channel: true>\`: Setup or create a muted role, with the possibility to blind all channels to muted people.`
                ].join("\n"));
            }
        }
    }
};