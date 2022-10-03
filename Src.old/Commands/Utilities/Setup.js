const Command = require('../../Structures/Command');
const ConfigFile = require('../../Data/ConfigFile.json');
const fs = require("fs");
const profile = require("../../Data/User.json");
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Setup the bot in your server.',
            category: 'Utilities',
            guildOnly: true,
            categoryFR: "Utilité",
            descriptionFR: "Modifie le bot pour l'adapter à votre serveur.",
            managerOnly: true,
            botPerms: ["MANAGE_CHANNELS", "MANAGE_ROLES", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES"]
        });
    }

    async run(message) {
        const GID = message.guild.id;
        const args = message.content.toLowerCase().split(' ')
        const ID = message.author.id

        const ThisServerPrefix = ConfigFile[GID].prefix;
        if (!args[1] || args[1] === "help") {

            if (profile[ID].langue === "EN") return message.channel.send([
                `- \`${ThisServerPrefix}setup prefix\`: Change the prefix for this guild.`,
                `- \`${ThisServerPrefix}setup logs <on/off>\`: Enable or disable the logs module.`,
                `- \`${ThisServerPrefix}setup channel <channel id/channel tag>\`: Set a channel for the logs.`,
                `- \`${ThisServerPrefix}setup <admin/mod/manager/staff> <role tag>\`: Add a role and the bot will consider user with it admin/manager/moderator/staff.`,
                `- \`${ThisServerPrefix}setup roles\`: Give a list of every role saved.`,
                `- \`${ThisServerPrefix}setup mute <role tag or ID/create> <can't see channel: true>\`: Setup or create a muted role, with the possibility to blind all channels to muted people.`
            ].join("\n"))
            if (profile[ID].langue === "FR") return message.channel.send([
                `- \`${ThisServerPrefix}setup prefix\`: Change le préfix pour le serveur.`,
                `- \`${ThisServerPrefix}setup logs <on/off>\`: Active ou désactive le module de logs.`,
                `- \`${ThisServerPrefix}setup channel <channel id/channel tag>\`: Précise le salon pour les logs.`,
                `- \`${ThisServerPrefix}setup <admin/mod/manager/staff> <role tag>\`: Ajoute un rôle que le bot considéra comme admin/manager/moderateur/staff.`,
                `- \`${ThisServerPrefix}setup roles\`: Donne une liste de tout les rôles sauvegardés.`,
                `- \`${ThisServerPrefix}setup mute <role tag or ID/create> <ne vera pas les salons: true>\`: Met en place ou crée un rôle pour les personnes muettes, avec la possibilité de ne voir aucun salon.`
            ].join("\n"))

        }
        if (args[1] === "prefix") {
            if (!args[2]) {

                if (profile[ID].langue === "EN") return message.channel.send(`The prefix for this server is: **${ThisServerPrefix}**.\n You want a different prefix? Send this without the **[]**: \`\`!!setup prefix [New Prefix]\`\`\n You want to reset the prefix? Send: \`\`!!setup prefix reset\`\``)
                if (profile[ID].langue === "FR") return message.channel.send(`Le préfix pour ce serveur est: **${ThisServerPrefix}**.\n Vous voulez un préfix différent? Envoyez ceci sans les **[]**: \`\`!!setup prefix [New Prefix]\`\`\n Vous voulez remettre le préfix par défaut? Envoyez: \`\`!!setup prefix reset\`\``)

            }
            if (args[2]) {
                ConfigFile[GID].prefix = args[2]
                fs.writeFile("./src/Data/ConfigFile.json", JSON.stringify(ConfigFile, ConfigFile, 3), function (err) {
                    if (err) console.log(err)
                })
            }

            if (profile[ID].langue === "EN") return message.channel.send(`Successfully change the prefix from **${ThisServerPrefix}** to **${args[2]}**.`)
            if (profile[ID].langue === "FR") return message.channel.send(`Le préfix a bien été changé de **${ThisServerPrefix}** à **${args[2]}**.`)
        }

        if (args[1] === "channel") {
            if (!args[2]) {
                if (profile[ID].langue === "EN") return message.channel.send("Please provide the ID of the channel where the logs will be sent or tag the channel.")
                if (profile[ID].langue === "FR") return message.channel.send("Veuillez donnez l'ID du salon où vont être envoyés les logs ou le mentionner.")
            }
            const logChannel = message.mentions.channels.first() || message.guild.channels.cache.get(`${args[2]}`) || message.guild.channels.cache.find(ch => ch.id.includes(`${args[2]}`))
            if (!logChannel) {
                if (profile[ID].langue === "EN") return message.channel.send("I can't found this channel on this server.")
                if (profile[ID].langue === "FR") return message.channel.send("Je ne trouve pas ce salon sur le serveur.")
            }
            GL[GID].logs.channel = logChannel.id
            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                if (err) console.log(err)
            })
            if (profile[ID].langue === "EN") return message.channel.send(`The log channel is now <#${logChannel.id}>.`)
            if (profile[ID].langue === "FR") return message.channel.send(`Le salon des logs est désormais <#${logChannel.id}>.`)
        }

        if (args[1] === "logs") {
            if (!args[2] && args[2] !== "on" && args[2] !== "off") {
                if (profile[ID].langue === "EN") return message.channel.send("Do you want to turn on or off the logs?")
                if (profile[ID].langue === "FR") return message.channel.send("Vous voulez mettre sur on ou off l'activation des logs?")
            }
            if (args[2] === "on") {
                if (GL[GID].logs.logging === "on") {
                    if (profile[ID].langue === "EN") return message.channel.send("This feature is already on \"on\"!")
                    if (profile[ID].langue === "FR") return message.channel.send("Cette fonctionnalité est déjà sur \"on\"!")
                } else {
                    GL[GID].logs.logging = true
                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                        if (err) console.log(err)
                    })
                    if (profile[ID].langue === "EN") return message.channel.send('This feature is now on "on".')
                    if (profile[ID].langue === "FR") return message.channel.send('Cette fonctionnalité est maintenant sur "on".')
                }

            } else {
                if (GL[GID].logs.logging === "off") {
                    if (profile[ID].langue === "EN") return message.channel.send("This feature is already on \"off\"!")
                    if (profile[ID].langue === "FR") return message.channel.send("Cette fonctionnalité est déjà sur \"off\"!")
                } else {
                    GL[GID].logs.logging = false
                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                        if (err) console.log(err)
                    })
                    if (profile[ID].langue === "EN") return message.channel.send('This feature is now on "off".')
                    if (profile[ID].langue === "FR") return message.channel.send('Cette fonctionnalité est maintenant sur "off".')
                }
            }
        }

        const role = message.mentions.roles.first() || message.guild.roles.cache.get(`${args[2]}`) || message.guild.roles.cache.find(ch => ch.id.includes(`${args[2]}`))
        if (args[1] === "admin") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as admin by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme admin.")
                }

                console.log(`Before: ${GL[GID].admins}`)
                const index = GL[GID].admins.indexOf(role.id)
                if (index > -1) {
                    GL[GID].admins.splice(index, 1)
                    console.log(`After: ${GL[GID].admins}`)
                } else {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already not considered as a admin role by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme admin par le bot.")
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send(`This role is no longer considered admin by the bot.`)
                if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme admin par le bot.")

            } else {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as admin by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme admin.")
                }
                if (GL[GID].admins.indexOf(role.id) !== -1) {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already considered as admin.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme admin.")
                }
                GL[GID].admins.push(role.id)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send("The role has been successfully added.")
                if (profile[ID].langue === "FR") return message.channel.send("Le rôle a bien été ajouté.")
            }
        }

        if (args[1] === "manager") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as manager by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme manager.")
                }

                console.log(`Before: ${GL[GID].managers}`)
                const index = GL[GID].managers.indexOf(role.id)
                if (index > -1) {
                    GL[GID].managers.splice(index, 1)
                    console.log(`After: ${GL[GID].managers}`)
                } else {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already not considered as a manager role by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme manager par le bot.")
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send(`This role is no longer considered manager by the bot.`)
                if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme manager par le bot.")

            } else {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as manager by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme manager.")
                }
                if (GL[GID].managers.indexOf(role.id) !== -1) {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already considered as manager.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme manager.")
                }
                GL[GID].managers.push(role.id)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send("The role has been successfully added.")
                if (profile[ID].langue === "FR") return message.channel.send("Le rôle a bien été ajouté.")
            }
        }

        if (args[1] === "mod" || args[1] === "mods" || args[1] === "moderator") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as moderator by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme modérateur.")
                }

                console.log(`Before: ${GL[GID].mods}`)
                const index = GL[GID].mods.indexOf(role.id)
                if (index > -1) {
                    GL[GID].mods.splice(index, 1)
                    console.log(`After: ${GL[GID].mods}`)
                } else {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already not considered as a moderator role by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme modérateur par le bot.")
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send(`This role is no longer considered staff by the bot.`)
                if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme staff par le bot.")

            } else {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as moderator by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme moderateur.")
                }
                if (GL[GID].mods.indexOf(role.id) !== -1) {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already considered as moderator.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme modérateur.")
                }
                GL[GID].mods.push(role.id)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send("The role has been successfully added.")
                if (profile[ID].langue === "FR") return message.channel.send("Le rôle a bien été ajouté.")
            }
        }

        if (args[1] === "staff") {
            if (args[3] && args[3] === "remove") {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to not be considered as staff by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme staff.")
                }

                const index = GL[GID].staff.indexOf(role.id)
                if (index > -1) {
                    GL[GID].staff.splice(index, 1)
                } else {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already not considered as a staff role by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est déjà pas considéré comme staff par le bot.")
                }
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send(`This role is no longer considered staff by the bot.`)
                if (profile[ID].langue === "FR") return message.channel.send("Ce rôle n'est plus considéré comme staff par le bot.")

            } else {
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as staff by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme staff.")
                }
                if (GL[GID].admins.indexOf(role.id) !== -1) {
                    if (profile[ID].langue === "EN") return message.channel.send("This role is already considered as staff.")
                    if (profile[ID].langue === "FR") return message.channel.send("Ce rôles est déjà considéré comme staff.")
                }
                GL[GID].staff.push(role.id)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                if (profile[ID].langue === "EN") return message.channel.send("The role has been successfully added.")
                if (profile[ID].langue === "FR") return message.channel.send("Le rôle a bien été ajouté.")
            }
        }

        if (args[1] === "roles") {
            const { MessageEmbed } = require("discord.js")

            let staffTab = []
            let modTab = []
            let adminTab = []
            let managerTab = []

            GL[GID].mods.forEach(element => {
                modTab.push(`<@&${element}>`)
            });
            GL[GID].managers.forEach(element => {
                managerTab.push(`<@&${element}>`)
            });
            GL[GID].admins.forEach(element => {
                adminTab.push(`<@&${element}>`)
            });
            GL[GID].staff.forEach(element => {
                staffTab.push(`<@&${element}>`)
            });

            const list = new MessageEmbed()
                .addField("List:", [
                    `**Admins:** ${adminTab.join(", ")}`,
                    `**Managers**: ${managerTab.join(", ")}`,
                    `**Moderators**: ${modTab.join(", ")}`,
                    `**Staff**: ${staffTab.join(", ")}`,
                ].join("\n"))
                .setDescription("Admins are manager, moderators and staff at the same time. Managers are staff at the same time, moderator are staff too. So you don't need to put every role in every category.")
                .setTimestamp()
                .setTitle("Staff roles setup")
                .setColor(message.guild.me.displayHexColor)
            return message.channel.send({ embeds: [list] })
        }

        if (args[1] === "mute") {
            let cantSeeChannel = false
            if (args[3] && args[3] === "true" || args[3] === "on" || args[3] === "blind") cantSeeChannel = true
            if (!args[2]) {
                if (profile[ID].langue === "EN") return message.channel.send(`What do you want to do? \`${ThisServerPrefix}setup mute <role tag or ID/create> <can't see channel: true>\``)
                if (profile[ID].langue === "FR") return message.channel.send(`Que voulez vous faire? \`${ThisServerPrefix}setup mute <role tag or ID/create> <ne vera pas les salons: true>\``)
            }
            if (args[2] === "create") {
                let prev = `I will create a role named **Muted**. People who are muted will be given this role and they ${cantSeeChannel === true ? "won't be able to speak and see every channel (edit important channel, like rules channel for them to see)." : "won't be able to speak in every channel."} Are you ok with this?`
                if (profile[ID].langue === "FR") prev = `Je vais créer un rôle **Muted**. Je donnerai au peronnes muettes ce rôle, et ils ${cantSeeChannel === true ? "ne seront pas capables de parler et de lire dans tout les salons du serveurs (modifiez les salons important, comme les règles, pour qu'ils puissent les voir)." : "ne seront pas capables de parler dans tout les salons du serveur."} Êtes vous d'accord avec cela?`
                message.channel.send(prev).then(msg => {
                    msg.react("✅")
                    msg.react("❌")
                    const filter = (reaction, user) => user.id === ID
                    const collector = msg.createReactionCollector({ filter, time: 20000 });
                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name === "❌") {
                            collector.stop()
                            if (profile[ID].langue === "EN") return message.channel.send("Operation canceled. I you want to do it again, type the command again.")
                            if (profile[ID].langue === "FR") return message.channel.send("Opération annulée. Si vous voulez recommencez, refaites la même commande.")
                        }
                        if (reaction.emoji.name === "✅") {
                            collector.stop()
                            let firstEdit = "Creating the role..."
                            if (profile[ID].langue === "FR") firstEdit = "Création du rôle..."
                            await message.channel.send(firstEdit).then(async msg => {
                                try {
                                    const role = await message.guild.roles.create({
                                        name: '🔇 Muted',
                                        color: '#514f48',
                                        permissions: [],
                                        reason: 'Created role to mute member',
                                    });
                                    if (!GL[GID].other.mute) {
                                        GL[GID].other.mute = {
                                            role: role.id,
                                            mutedArray: [],
                                            mutedData: {}
                                        }
                                    } else {
                                        GL[GID].other.mute.role = role.id
                                    }
                                    let secondEdit = "Role created, editing channels..."
                                    if (profile[ID].langue === "FR") secondEdit = "Rôle créé, modification des salons..."
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
                                                    })
                                                } else {
                                                    await channel.permissionOverwrites.edit(role, {
                                                        SEND_MESSAGES: false,
                                                        SPEAK: false,
                                                        ADD_REACTIONS: false,
                                                        SEND_TTS_MESSAGES: false,
                                                        ATTACH_FILES: false
                                                    })
                                                }
                                            })
                                        } catch (e) {
                                            if (profile[ID].langue === "FR") msg.edit(`Une erreur est survenue! L'erreur est ${e}, si cela n'as pas de rapport avec cette commande, veuillez dénoncer le bug`)
                                            if (profile[ID].langue === "EN") msg.edit(`An error happened! The error is ${e}, if it's not relativ with what you did, report the bug.`)
                                            return console.log(e.stack);
                                        }
                                    })
                                } catch (e) {
                                    if (profile[ID].langue === "FR") msg.edit(`Une erreur est survenue! L'erreur est ${e}, si cela n'as pas de rapport avec cette commande, veuillez dénoncer le bug`)
                                    if (profile[ID].langue === "EN") msg.edit(`An error happened! The error is ${e}, if it's not relativ with what you did, report the bug.`)
                                    return console.log(e.stack);
                                }
                            })
                            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                                if (err) console.log(err)
                            })
                            if (profile[ID].langue === "FR") return message.channel.send("Le rôle a été créé et les chaques salons a été mis à jour.")
                            if (profile[ID].langue === "EN") return message.channel.send("The Muted role has been created and every channel have been updated.")
                        }
                    })
                })
            } else {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(`${args[2]}`) || message.guild.roles.cache.find(ch => ch.id.includes(`${args[2]}`))
                if (!role) {
                    if (profile[ID].langue === "EN") return message.channel.send("Please tag or type the id of a role you want to be considered as the muted role by the bot.")
                    if (profile[ID].langue === "FR") return message.channel.send("Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme le rôle muet par le bot.")
                }
                let prev = `I will use the role named **<@&${role.id}>**. People who are muted will be given this role and they ${cantSeeChannel === true ? "won't be able to speak and see every channel (edit important channel, like rules channel for them to see)." : "won't be able to speak in every channel."} Are you ok with this?`
                if (profile[ID].langue === "FR") prev = `Je vais utiliser le rôle **<@&${role.id}>**. Je donnerai au peronnes muettes ce rôle, et ils ${cantSeeChannel === true ? "ne seront pas capables de parler et de lire dans tout les salons du serveurs (modifiez les salons important, comme les règles, pour qu'ils puissent les voir)." : "ne seront pas capables de parler dans tout les salons du serveur."} Êtes vous d'accord avec cela?`
                message.channel.send(prev).then(msg => {
                    msg.react("✅")
                    msg.react("❌")
                    const filter = (reaction, user) => user.id === ID
                    const collector = msg.createReactionCollector({ filter, time: 20000 });
                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name === "❌") {
                            collector.stop()
                            if (profile[ID].langue === "EN") return message.channel.send("Operation canceled. I you want to do it again, type the command again.")
                            if (profile[ID].langue === "FR") return message.channel.send("Opération annulée. Si vous voulez recommencez, refaites la même commande.")
                        }
                        if (reaction.emoji.name === "✅") {
                            collector.stop()
                            let secondEdit = "Editing channels..."
                            if (profile[ID].langue === "FR") secondEdit = "Modification des salons..."
                            msg.edit(secondEdit).then(msg => {
                                if (!GL[GID].other.mute) {
                                    GL[GID].other.mute = {
                                        role: role.id,
                                        mutedArray: [],
                                        mutedData: {}
                                    }
                                } else {
                                    GL[GID].other.mute.role = role.id
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
                                            })
                                        } else {
                                            await channel.permissionOverwrites.edit(role, {
                                                SEND_MESSAGES: false,
                                                SPEAK: false,
                                                ADD_REACTIONS: false,
                                                SEND_TTS_MESSAGES: false,
                                                ATTACH_FILES: false
                                            })
                                        }
                                    })
                                } catch (e) {
                                    if (profile[ID].langue === "FR") msg.edit(`Une erreur est survenue! L'erreur est ${e}, si cela n'as pas de rapport avec cette commande, veuillez dénoncer le bug`)
                                    if (profile[ID].langue === "EN") msg.edit(`An error happened! The error is ${e}, if it's not relativ with what you did, report the bug.`)
                                    return console.log(e.stack);
                                }
                            })

                            fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                                if (err) console.log(err)
                            })
                            if (profile[ID].langue === "FR") return message.channel.send("Le rôle a été enregistré et les chaques salons a été mis à jour.")
                            if (profile[ID].langue === "EN") return message.channel.send("The Muted role has been saved and every channel have been updated.")
                        }
                    })
                })
            }
        }
    }
};