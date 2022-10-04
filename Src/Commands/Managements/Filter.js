const Command = require('../../Structures/Command');
const { MessageEmbed, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");
const ms = require('ms');
const db = null; //TODO replace it with my own library
const GL = require("../../Data/Guild.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Manage the message filter.',
            category: 'Management',
            descriptionFR: "Gère le filtre des messages.",
            managerOnly: true,
            usage: "<warn/enable/word> <on/off/word(s)>",
            botPerms: [PermissionFlagsBits.ManageMessages],
            guildOnly: true
        });
    }
    async run(message) {
        const GID = message.guild.id;
        const args = message.content.toLowerCase().split(' ')
        const ID = message.author.id
        const filter = GL[GID].other.filter

        if (!args[1] || args[1] === "help") {
            return message.channel.send([
                "Staff role saved with setup are not affceted by the filter.",
                "Do `,,filter enable <on/off>` to enable or disable the word filter on this server.",
                "Do `,,filter warn <on/off>` to enable or disable the warning that can be sent after a message deletion.",
                "Do `,,filter zalgo <on/off>` to enable or disable the deletion of zalgo by the filter.",
                "Do `,,filter copypaste <on/off>` to enable or disable the deletion of copy paste by the filter.",
                "Do `,,filter emojis <on/off/number>` to enable or disable the deletion of too much emojis by the filter. Default is 5.",
                "Do `,,filter word <add/list/remove> <word>` to manage the banned words on this server.",
                "Do `,,filter channel <channel tag or id/list> <add/remove>` to manage channel ignored by the filter."
                //invitation links
                //links
            ].join("\n"))
        }

        if (args[1] === "enable") {
            if (!args[2] || (args[2] !== "on" && args[2] !== "off")) return message.channel.send(`Do you want to enable or disable the filter? \`,,filter enable <on/off>\`\nIt is currently on ${filter.enable === true ? "**ON**" : "**OFF**"}.`)
            if (args[2] === "on") {
                if (filter.enable === true) return message.channel.send("The filter is already enable!")
                filter.enable = true
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The filter is now enable!")
            }
            if (args[2] === "off") {
                if (filter.enable === false) return message.channel.send("The filter is already disable!")
                filter.enable = false
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The filter is now disable!")
            }
        }

        if (args[1] === "warn") {
            if (!args[2] || (args[2] !== "on" && args[2] !== "off")) return message.channel.send(`Do you want to enable or disable the warn? \`,,filter warn <on/off>\`\nIt is currently on ${filter.warn === true ? "**ON**" : "**OFF**"}.`)
            if (args[2] === "on") {
                if (filter.warn === true) return message.channel.send("The warn is already enable!")
                filter.warn = true
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The warn is now enable!")
            }
            if (args[2] === "off") {
                if (filter.warn === false) return message.channel.send("The warn is already disable!")
                filter.warn = false
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The warn is now disable!")
            }
        }

        if (args[1] === "zalgo") {
            if (!args[2] || (args[2] !== "on" && args[2] !== "off")) return message.channel.send(`Do you want to enable or disable the zalgo deletion? \`,,filter zalgo <on/off>\`\nIt is currently on ${filter.zalgo === true ? "**ON**" : "**OFF**"}.`)
            if (args[2] === "on") {
                if (filter.zalgo === true) return message.channel.send("The zalgo deletion is already enable!")
                filter.zalgo = true
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The zalgo deletion is now enable!")
            }
            if (args[2] === "off") {
                if (filter.zalgo === false) return message.channel.send("The zalgo deletion is already disable!")
                filter.zalgo = false
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The zalgo deletion is now disable!")
            }
        }

        if (args[1] === "copypaste" || args[1] === "cc") {
            if (!args[2] || (args[2] !== "on" && args[2] !== "off")) return message.channel.send(`Do you want to enable or disable the copy paste deletion? \`,,filter copypaste <on/off>\`\nIt is currently on ${filter.cc === true ? "**ON**" : "**OFF**"}.`)
            if (args[2] === "on") {
                if (filter.cc === true) return message.channel.send("The copy paste deletion is already enable!")
                filter.cc = true
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The copy paste deletion is now enable!")
            }
            if (args[2] === "off") {
                if (filter.cc === false) return message.channel.send("The copy paste deletion is already disable!")
                filter.cc = false
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The copy paste deletion is now disable!")
            }
        }

        if (args[1] === "emojis") {
            if (!args[2] || (args[2] !== "on" && args[2] !== "off" && isNaN(args[2]) === true)) return message.channel.send(`Do you want to enable or disable the emojis deletion? \`,,filter emojis <on/off/number>\`\nIt is currently on ${filter.emojis === true ? "**ON**" : "**OFF**"} and delete with ${filter.emojisNumber} emojis in the message.`)
            else if (args[2] === "on") {
                if (filter.emojis === true) return message.channel.send("The emojis deletion is already enable!")
                filter.emojis = true
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The emojis deletion is now enable!")
            } else if (args[2] === "off") {
                if (filter.emojis === false) return message.channel.send("The emojis deletion is already disable!")
                filter.emojis = false
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send("The emojis deletion is now disable!")
            } else {
                if (isNaN(args[2]) === true) return message.channel.send(`Please provide a number of emojis to be in a message for deletion. Current number is ${filter.emojisNumber}.`)
                if (args[2] <= 1) return message.channel.send("Please provide a number bigger than 1.")
                filter.emojisNumber = parseInt(args[2])
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send(`Messages will now be deleted if the have **${args[2]}** or more emojis in them.`)
            }
        }

        if (args[1] === "word" || args[1] === "words") {
            if (!args[2] || args[2] === "list") {
                let wordsTab = []
                for (let pas = 0; pas < filter.word.length; pas++) {
                    wordsTab.push(`**[${pas + 1}]** ${filter.word[pas]}`)
                }

                function embedFct(number) {
                    const current = wordsTab.slice(number, number + 20)
                    const thisTab = []
                    current.forEach(c => {
                        thisTab.push(c)
                    })
                    const modlogsEmbed = new MessageEmbed()
                        .setTitle(`Words ${number + 1}-${number + current.length} out of ${wordsTab.length}`)
                        .setTitle("Chat filter")
                        .setColor("#ff576c")
                        .setDescription("Words in the list below will be detected in a message, and the message will be deleted. Logs will be sent if a logs channel is saved. If warn have been enable, a warn for saying one of these words will be saved in the user modlogs.\n**The filter is not perfect!** The devs are trying to make it as efficient as possible, but the best way to moderate is still by having human moderators.\n**Do `,,filter word <add/remove> <word/number>` to manage the banned words on this server.**")
                        .setTimestamp()
                        .addField(`Words list:`, thisTab)
                    return modlogsEmbed
                }

                if (wordsTab.length <= 20) return message.channel.send({ embeds: [embedFct(0)] })

                return message.channel.send({ embeds: [embedFct(0)] }).then(message => {
                    message.react("🗑️")
                    message.react('➡️')
                    const filter = (reaction, user) => user.id === ID
                    const collector = message.createReactionCollector({ time: 60000 })

                    let currentIndex = 0
                    collector.on('collect', reaction => {
                        message.reactions.removeAll().then(async () => {
                            if (reaction.emoji.name === '⬅️') currentIndex -= 20
                            if (reaction.emoji.name === "➡️") currentIndex += 20
                            if (reaction.emoji.name === "🗑️") {
                                collector.stop()
                                return
                            }
                            message.edit(embedFct(currentIndex))
                            if (currentIndex !== 0) await message.react('⬅️')
                            message.react("🗑️")
                            if (currentIndex + 20 < wordsTab.length) message.react('➡️')
                        })
                    })
                })
            }
            if (args[2] === "add") {
                if (!args[3]) return message.channel.send("What word do you want to add? You can add multiple words by separating them with coma.")
                const preWordAdd = args.slice(3).join(" ")
                let wordsAdd = preWordAdd.toLowerCase().split(",")
                let pas = 0
                let someRemoved = ""
                const transitTab = [""]
                wordsAdd.forEach(element => {
                    wordsAdd[pas] = element.trim()
                    if (wordsAdd[pas] !== "") {
                        if (filter.word.indexOf(wordsAdd[pas]) === -1) {
                            transitTab.push(wordsAdd[pas])
                        } else {
                            someRemoved = "Some words have been removed because they already were in the current banned words list."
                        }
                    }
                    pas++
                })
                wordsAdd = transitTab.join("\n").toString()
                filter.word = filter.word.concat(wordsAdd)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send(`Words added are: "**${wordsAdd.join('**" , "**')}**"\n${someRemoved}`)
            }
            if (args[2] === "remove" || args[2] === "delete") {
                if (!args[3]) return message.channel.send("Please provide the world you want to delete from the banned words list.")
                const index = filter.word.indexOf(args[3])
                if (index > -1) {
                    filter.word.splice(index, 1)
                    fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                        if (err) console.log(err)
                    })
                    return message.channel.send(`Removed **${args[3]}** from the banned words list.`)
                } else {
                    return message.channel.send(`The word **${args[3]}** is not in the banned words list.`)
                }
            }
        }

        if (args[1] === "channel") {
            if (!args[2]) return message.channel.send("Please type the tag or the ID of the channel you want to add or remove from the ignored chat filter. `,,filter channel <channel tag or id/list> <add/remove>`")
            const ignoredChannel = message.mentions.channels.first() || message.guild.channels.cache.get(`${args[2]}`) || message.guild.channels.cache.find(ch => ch.id.includes(`${args[2]}`))
            if (!ignoredChannel && args[2] !== "list") return message.channel.send("I wansn't able to find this channel on this server.")
            if (args[2] === "list") {
                if (filter.ignoredChannel.length === 0) return message.channel.send("No ignored channel for the moment.")
                const tabChannel = []
                filter.ignoredChannel.forEach(element => {
                    tabChannel.push(`<#${element}>`)
                })
                return message.channel.send(`Following channel${filter.ignoredChannel.length > 1 ? "s are" : " is"} in the ignored channel:\n${tabChannel.join(", ")}.`)
            }
            if (!args[3] && args[3] !== "add" && args[3] !== "remove") return message.channel.send(`Do you want or remove <#${ignoredChannel.id}> from the ignored chat filter? \`,,filter channel <#${ignoredChannel.id}> <add/remove>\``)
            if (args[3] === "add") {
                if (filter.ignoredChannel.indexOf(ignoredChannel.id) > -1) return message.channel.send("This channel is already in the ignored chat filter.")
                filter.ignoredChannel.push(ignoredChannel.id)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send(`<#${ignoredChannel.id}> added to ignored channels.`)
            }
            if (args[3] === "remove") {
                if (filter.ignoredChannel.indexOf(ignoredChannel.id) === -1) return message.channel.send("This channel is not in the ignored chat filter.")
                filter.ignoredChannel.splice(filter.ignoredChannel.indexOf(ignoredChannel.id), 1)
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GL, GL, 3), function (err) {
                    if (err) console.log(err)
                })
                return message.channel.send(`<#${ignoredChannel.id}> removed to ignored channels.`)
            }
        }
    }
}