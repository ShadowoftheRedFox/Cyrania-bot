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
            botPerms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ViewAuditLog],
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
                            if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as admin by the bot.");
                            if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme admin.");
                        }

                        console.log(`Before: ${GuildList[GID].admins}`);
                        const index = GuildList[GID].admins.indexOf(role.id);
                        if (index > -1) {
                            GuildList[GID].admins.splice(index, 1);
                            console.log(`After: ${GuildList[GID].admins}`);
                        } else {
                            if (User.langue === "EN") return message.channel.send("This role is already not considered as a admin role by the bot.");
                            if (User.langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme admin par le bot.");
                        }
                        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                            if (err) console.log(err);
                        });
                        if (User.langue === "EN") return message.channel.send(`This role is no longer considered admin by the bot.`);
                        if (User.langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme admin par le bot.");
                        break;
                    }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup admin <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup admin <add/remove> <role> [role]\``);
                    }
                }
                break;
            }
            case "manager":
            case "managers":
            case "manageur":
            case "manageurs": {
                const roles = args.concat(sub2);
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        break;
                    }
                    case "remove":
                    case "enlever": { break; }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup manageur <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup manager <add/remove> <role> [role]\``);
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
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        break;
                    }
                    case "remove":
                    case "enlever": { break; }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup moderateur <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup moderator <add/remove> <role> [role]\``);
                    }
                }
                break;
            }
            case "staff":
            case "equipe": {
                const roles = args.concat(sub2);
                switch (sub1) {
                    case "add":
                    case "ajout": {
                        break;
                    }
                    case "remove":
                    case "enlever": { break; }
                    default: {
                        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup equipe <ajout/enlever> <role> [roles]\``);
                        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup staff <add/remove> <role> [role]\``);
                    }
                }
                break;
            }
            case "role":
            case "roles": { break; }
            case "mute":
            case "muet": {
                switch (sub1) {
                    case "create":
                    default: {

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

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(`${args[2]}`) || message.guild.roles.cache.find(ch => ch.id.includes(`${args[2]}`));
        if (args[1] === "admin") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as admin by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme admin.");
                }

                console.log(`Before: ${GuildList[GID].admins}`);
                const index = GuildList[GID].admins.indexOf(role.id);
                if (index > -1) {
                    GuildList[GID].admins.splice(index, 1);
                    console.log(`After: ${GuildList[GID].admins}`);
                } else {
                    if (User.langue === "EN") return message.channel.send("This role is already not considered as a admin role by the bot.");
                    if (User.langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme admin par le bot.");
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send(`This role is no longer considered admin by the bot.`);
                if (User.langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme admin par le bot.");

            } else {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as admin by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme admin.");
                }
                if (GuildList[GID].admins.indexOf(role.id) !== -1) {
                    if (User.langue === "EN") return message.channel.send("This role is already considered as admin.");
                    if (User.langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme admin.");
                }
                GuildList[GID].admins.push(role.id);
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send("The role has been successfully added.");
                if (User.langue === "FR") return message.channel.send("Le rôle a bien été ajouté.");
            }
        }

        if (args[1] === "manager") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as manager by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme manager.");
                }

                console.log(`Before: ${GuildList[GID].managers}`);
                const index = GuildList[GID].managers.indexOf(role.id);
                if (index > -1) {
                    GuildList[GID].managers.splice(index, 1);
                    console.log(`After: ${GuildList[GID].managers}`);
                } else {
                    if (User.langue === "EN") return message.channel.send("This role is already not considered as a manager role by the bot.");
                    if (User.langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme manager par le bot.");
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send(`This role is no longer considered manager by the bot.`);
                if (User.langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme manager par le bot.");

            } else {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as manager by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme manager.");
                }
                if (GuildList[GID].managers.indexOf(role.id) !== -1) {
                    if (User.langue === "EN") return message.channel.send("This role is already considered as manager.");
                    if (User.langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme manager.");
                }
                GuildList[GID].managers.push(role.id);
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send("The role has been successfully added.");
                if (User.langue === "FR") return message.channel.send("Le rôle a bien été ajouté.");
            }
        }

        if (args[1] === "mod" || args[1] === "mods" || args[1] === "moderator") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as moderator by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme modérateur.");
                }

                console.log(`Before: ${GuildList[GID].mods}`);
                const index = GuildList[GID].mods.indexOf(role.id);
                if (index > -1) {
                    GuildList[GID].mods.splice(index, 1);
                    console.log(`After: ${GuildList[GID].mods}`);
                } else {
                    if (User.langue === "EN") return message.channel.send("This role is already not considered as a moderator role by the bot.");
                    if (User.langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme modérateur par le bot.");
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send(`This role is no longer considered staff by the bot.`);
                if (User.langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme staff par le bot.");

            } else {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as moderator by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme moderateur.");
                }
                if (GuildList[GID].mods.indexOf(role.id) !== -1) {
                    if (User.langue === "EN") return message.channel.send("This role is already considered as moderator.");
                    if (User.langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme modérateur.");
                }
                GuildList[GID].mods.push(role.id);
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send("The role has been successfully added.");
                if (User.langue === "FR") return message.channel.send("Le rôle a bien été ajouté.");
            }
        }

        if (args[1] === "staff") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as staff by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme staff.");
                }

                const index = GuildList[GID].staff.indexOf(role.id);
                if (index > -1) {
                    GuildList[GID].staff.splice(index, 1);
                } else {
                    if (User.langue === "EN") return message.channel.send("This role is already not considered as a staff role by the bot.");
                    if (User.langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme staff par le bot.");
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send(`This role is no longer considered staff by the bot.`);
                if (User.langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme staff par le bot.");

            } else {
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as staff by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme staff.");
                }
                if (GuildList[GID].admins.indexOf(role.id) !== -1) {
                    if (User.langue === "EN") return message.channel.send("This role is already considered as staff.");
                    if (User.langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme staff.");
                }
                GuildList[GID].staff.push(role.id);
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
                if (User.langue === "EN") return message.channel.send("The role has been successfully added.");
                if (User.langue === "FR") return message.channel.send("Le rôle a bien été ajouté.");
            }
        }

        if (args[1] === "roles") {
            const { EmbedBuilder /*TODO update the embeds*/ } = require("discord.js");

            let staffTab = [];
            let modTab = [];
            let adminTab = [];
            let managerTab = [];

            GuildList[GID].mods.forEach(element => {
                modTab.push(`<@&${element}>`);
            });
            GuildList[GID].managers.forEach(element => {
                managerTab.push(`<@&${element}>`);
            });
            GuildList[GID].admins.forEach(element => {
                adminTab.push(`<@&${element}>`);
            });
            GuildList[GID].staff.forEach(element => {
                staffTab.push(`<@&${element}>`);
            });

            const list = new EmbedBuilder()
                .addFields({
                    name: "List:", value: [
                        `**Admins:** ${adminTab.join(", ")}`,
                        `**Managers**: ${managerTab.join(", ")}`,
                        `**Moderators**: ${modTab.join(", ")}`,
                        `**Staff**: ${staffTab.join(", ")}`,
                    ].join("\n")
                })
                .setDescription("Admins are manager, moderators and staff at the same time. Managers are staff at the same time, moderator are staff too. So you don't need to put every role in every category.")
                .setTimestamp()
                .setTitle("Staff roles setup")
                .setColor(color);
            return message.channel.send({ embeds: [list] });
        }

        if (args[1] === "mute") {
            let cantSeeChannel = false;
            if (args[3] && args[3] === "true" || args[3] === "on" || args[3] === "blind") cantSeeChannel = true;
            if (!args[2]) {
                if (User.langue === "EN") return message.channel.send(`What do you want to do? \`${ThisServerPrefix}setup mute <role tag or ID/create> <can't see channel: true>\``);
                if (User.langue === "FR") return message.channel.send(`Que voulez vous faire? \`${ThisServerPrefix}setup mute <role tag or ID/create> <ne vera pas les salons: true>\``);
            }
            if (args[2] === "create") {
                let prev = `I will create a role named **Muted**. People who are muted will be given this role and they ${cantSeeChannel === true ? "won't be able to speak and see every channel (edit important channel, like rules channel for them to see)." : "won't be able to speak in every channel."} Are you ok with this?`;
                if (User.langue === "FR") prev = `Je vais créer un rôle **Muted**. Je donnerai au peronnes muettes ce rôle, et ils ${cantSeeChannel === true ? "ne seront pas capables de parler et de lire dans tout les salons du serveurs (modifiez les salons important, comme les règles, pour qu'ils puissent les voir)." : "ne seront pas capables de parler dans tout les salons du serveur."} Êtes vous d'accord avec cela?`;
                message.channel.send(prev).then(msg => {
                    msg.react("✅");
                    msg.react("❌");
                    const filter = (reaction, user) => user.id === ID;
                    const collector = msg.createReactionCollector({ filter, time: 20000 });
                    collector.on("collect", async (reaction, user) => {
                        if (reaction.emoji.name === "❌") {
                            collector.stop();
                            if (User.langue === "EN") return message.channel.send("Operation canceled. I you want to do it again, type the command again.");
                            if (User.langue === "FR") return message.channel.send("Opération annulée. Si vous voulez recommencez, refaites la même commande.");
                        }
                        if (reaction.emoji.name === "✅") {
                            collector.stop();
                            let firstEdit = "Creating the role...";
                            if (User.langue === "FR") firstEdit = "Création du rôle...";
                            await message.channel.send(firstEdit).then(async msg => {
                                try {
                                    const role = await message.guild.roles.create({
                                        name: '🔇 Muted',
                                        color: '#514f48',
                                        permissions: [],
                                        reason: 'Created role to mute member',
                                    });
                                    if (!GuildList[GID].other.mute) {
                                        GuildList[GID].other.mute = {
                                            role: role.id,
                                            mutedArray: [],
                                            mutedData: {}
                                        };
                                    } else {
                                        GuildList[GID].other.mute.role = role.id;
                                    }
                                    let secondEdit = "Role created, editing channels...";
                                    if (User.langue === "FR") secondEdit = "Rôle créé, modification des salons...";
                                    msg.edit(secondEdit).then(msg => {
                                        try {
                                            message.guild.channels.cache.forEach(async (channel, id) => {
                                                if (cantSeeChannel) {
                                                    await channel.permissionOverwrites.edit(role, {
                                                        SEND_MESSAGES: false,
                                                        SPEAK: false,
                                                        ADD_REACTIONS: false,
                                                        SEND_TTS_MESSAGES: false,
                                                        ATTACH_FILES: false,
                                                        VIEW_CHANNEL: false
                                                    });
                                                } else {
                                                    await channel.permissionOverwrites.edit(role, {
                                                        SEND_MESSAGES: false,
                                                        SPEAK: false,
                                                        ADD_REACTIONS: false,
                                                        SEND_TTS_MESSAGES: false,
                                                        ATTACH_FILES: false
                                                    });
                                                }
                                            });
                                        } catch (e) {
                                            if (User.langue === "FR") msg.edit(`Une erreur est survenue! L'erreur est ${e}, si cela n'as pas de rapport avec cette commande, veuillez dénoncer le bug`);
                                            if (User.langue === "EN") msg.edit(`An error happened! The error is ${e}, if it's not relativ with what you did, report the bug.`);
                                            return console.log(e.stack);
                                        }
                                    });
                                } catch (e) {
                                    if (User.langue === "FR") msg.edit(`Une erreur est survenue! L'erreur est ${e}, si cela n'as pas de rapport avec cette commande, veuillez dénoncer le bug`);
                                    if (User.langue === "EN") msg.edit(`An error happened! The error is ${e}, if it's not relativ with what you did, report the bug.`);
                                    return console.log(e.stack);
                                }
                            });
                            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                                if (err) console.log(err);
                            });
                            if (User.langue === "FR") return message.channel.send("Le rôle a été créé et les chaques salons a été mis à jour.");
                            if (User.langue === "EN") return message.channel.send("The Muted role has been created and every channel have been updated.");
                        }
                    });
                });
            } else {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(`${args[2]}`) || message.guild.roles.cache.find(ch => ch.id.includes(`${args[2]}`));
                if (!role) {
                    if (User.langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as the muted role by the bot.");
                    if (User.langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme le rôle muet par le bot.");
                }
                let prev = `I will use the role named **<@&${role.id}>**. People who are muted will be given this role and they ${cantSeeChannel === true ? "won't be able to speak and see every channel (edit important channel, like rules channel for them to see)." : "won't be able to speak in every channel."} Are you ok with this?`;
                if (User.langue === "FR") prev = `Je vais utiliser le rôle **<@&${role.id}>**. Je donnerai au peronnes muettes ce rôle, et ils ${cantSeeChannel === true ? "ne seront pas capables de parler et de lire dans tout les salons du serveurs (modifiez les salons important, comme les règles, pour qu'ils puissent les voir)." : "ne seront pas capables de parler dans tout les salons du serveur."} Êtes vous d'accord avec cela?`;
                message.channel.send(prev).then(msg => {
                    msg.react("✅");
                    msg.react("❌");
                    const filter = (reaction, user) => user.id === ID;
                    const collector = msg.createReactionCollector({ filter, time: 20000 });
                    collector.on("collect", async (reaction, user) => {
                        if (reaction.emoji.name === "❌") {
                            collector.stop();
                            if (User.langue === "EN") return message.channel.send("Operation canceled. I you want to do it again, type the command again.");
                            if (User.langue === "FR") return message.channel.send("Opération annulée. Si vous voulez recommencez, refaites la même commande.");
                        }
                        if (reaction.emoji.name === "✅") {
                            collector.stop();
                            let secondEdit = "Editing channels...";
                            if (User.langue === "FR") secondEdit = "Modification des salons...";
                            msg.edit(secondEdit).then(msg => {
                                if (!GuildList[GID].other.mute) {
                                    GuildList[GID].other.mute = {
                                        role: role.id,
                                        mutedArray: [],
                                        mutedData: {}
                                    };
                                } else {
                                    GuildList[GID].other.mute.role = role.id;
                                }
                                try {
                                    message.guild.channels.cache.forEach(async (channel, id) => {
                                        if (cantSeeChannel) {
                                            await channel.permissionOverwrites.edit(role, {
                                                SEND_MESSAGES: false,
                                                SPEAK: false,
                                                ADD_REACTIONS: false,
                                                SEND_TTS_MESSAGES: false,
                                                ATTACH_FILES: false,
                                                VIEW_CHANNEL: false
                                            });
                                        } else {
                                            await channel.permissionOverwrites.edit(role, {
                                                SEND_MESSAGES: false,
                                                SPEAK: false,
                                                ADD_REACTIONS: false,
                                                SEND_TTS_MESSAGES: false,
                                                ATTACH_FILES: false
                                            });
                                        }
                                    });
                                } catch (e) {
                                    if (User.langue === "FR") msg.edit(`Une erreur est survenue! L'erreur est ${e}, si cela n'as pas de rapport avec cette commande, veuillez dénoncer le bug`);
                                    if (User.langue === "EN") msg.edit(`An error happened! The error is ${e}, if it's not relativ with what you did, report the bug.`);
                                    return console.log(e.stack);
                                }
                            });

                            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                                if (err) console.log(err);
                            });
                            if (User.langue === "FR") return message.channel.send("Le rôle a été enregistré et les chaques salons a été mis à jour.");
                            if (User.langue === "EN") return message.channel.send("The Muted role has been saved and every channel have been updated.");
                        }
                    });
                });
            }
        }
    }
};