const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js");
const profile = require("../../Data/User.json");
const GL = require("../../Data/Guild.json");
const config = require('../../Data/ConfigFile.json');
const fs = require("fs")
const db = require("quick.db")
const color = require("colors")
const ms = require("ms")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            category: 'Event',
            guildOnly: true,
            categoryFR: "Evenement",
            ownerOnly: true
        });
    }

    async run(message) {
        const ID = message.author.id
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        if (!profile[ID].data.mail) {
            profile[ID].data.mail = {
                mailSend: {
                    number: 0,
                    mails: {}
                },
                mailReceived: {
                    read: [],
                    unread: [],
                    favorite: [],
                    saved: [],
                    global: [],
                    guild: [],
                    number: 0,
                    mails: {},
                },
                notif: {
                    remind: false,
                    totalNewMail: 0,
                    notUserRemind: false,
                    notUserTotalNewMail: 0
                },
                blockedUsers: [],
                whiteListUsers: [],
                allBlocked: false,
                status: "online"
            }
            console.log([
                "==============[Mail]==============",
                `ID: ${ID}`,
                "Added mail box",
                `At: ${dateTime}`,
                "=================================="
            ].join("\n").cyan)
            fs.writeFile("./src/Data/User.json", JSON.stringify(profile, 3), function (err) {
                if (err) console.log(err)
            })
        }

        //if !guild.other.mail

        var value = 0
        var valueNotUser = 0
        try {
            const tab = db.all()
            tab.forEach(element => {
                const { ID } = element
                const argsID = ID.split(" ")
                if (argsID[0]) {
                    if (argsID[0] !== "MailCyra" || !argsID[1] || argsID[1] !== message.author.id) return
                    if (argsID[2] && !argsID[3]) {
                        if (value < parseInt(argsID[2])) value = parseInt(argsID[2])
                    }
                    if (argsID[3] && args[3] === "notUser") {
                        if (valueNotUser < parseInt(argsID[3])) valueNotUser = parseInt(argsID[3])
                    }
                }
            })
        } catch (e) { console.error(e) }

        const userMail = profile[ID].data.mail
        const userStatus = userMail.status
        const unreadNewMail = userMail.notif.totalNewMail
        const notUserTotalNewMail = userMail.notif.notUserTotalNewMail
        if (userMail.notif.remind === true) {

            if (userStatus === "online") {
                if (value < unreadNewMail) {
                    console.log([
                        "==============[Mail]==============",
                        `ID: ${ID}`,
                        `Status: ${userStatus}`,
                        `At: ${dateTime}`,
                        "=================================="
                    ].join("\n").cyan)

                    const mailEmbed = new MessageEmbed()
                        .setTitle(`📩 You have ${unreadNewMail} mail${unreadNewMail > 1 ? "s" : ""} in your mail box!`)

                    db.delete(`MailCyra ${ID} ${value}`)
                    if (!db.has(`MailCyra ${ID} ${unreadNewMail}`)) {
                        userMail.notif.remind = false
                        fs.writeFile("./src/Data/User.json", JSON.stringify(profile, 3), function (err) {
                            if (err) console.log(err)
                        })

                        let timeuser = "1h"
                        db.set(`MailCyra ${ID} ${unreadNewMail}`, Date.now() + ms(timeuser))
                        const interval = setInterval(function () {
                            if (Date.now() > db.fetch(`MailCyra ${ID} ${unreadNewMail}`)) {
                                db.delete(`MailCyra ${ID} ${unreadNewMail}`)
                                clearInterval(interval)
                                userMail.notif.remind = true
                                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, 3), function (err) {
                                    if (err) console.log(err)
                                })
                            }
                        }, 5000)
                    }
                    return message.channel.send(`New mail <@${ID}>!`, { embeds: [mailEmbed] })
                }
            } else if (userStatus === "dnd") {
                if (valueNotUser < notUserTotalNewMail) {
                    console.log([
                        "==============[Mail]==============",
                        `ID: ${ID}`,
                        `Status: ${userStatus}`,
                        `At: ${dateTime}`,
                        "=================================="
                    ].join("\n").cyan)

                    const mailEmbed = new MessageEmbed()
                        .setTitle(`📩 You have ${notUserTotalNewMail} urgent${notUserTotalNewMail > 1 ? "s" : ""} mail${notUserTotalNewMail > 1 ? "s" : ""} in your mail box!`)

                    db.delete(`MailCyra ${ID} ${valueNotUser}`)
                    if (!db.has(`MailCyra ${ID} ${notUserTotalNewMail}`)) {
                        userMail.notif.remind = false
                        fs.writeFile("./src/Data/User.json", JSON.stringify(profile, 3), function (err) {
                            if (err) console.log(err)
                        })

                        let timeuser = "1h"
                        db.set(`MailCyra ${ID} ${notUserTotalNewMail}`, Date.now() + ms(timeuser))
                        const interval = setInterval(function () {
                            if (Date.now() > db.fetch(`MailCyra ${ID} ${notUserTotalNewMail}`)) {
                                db.delete(`MailCyra ${ID} ${notUserTotalNewMail}`)
                                clearInterval(interval)

                                userMail.notif.remind = true
                                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, 3), function (err) {
                                    if (err) console.log(err)
                                })
                            }
                        }, 5000)
                    }
                    return message.channel.send(`New mail <@${ID}>!`, { embeds: [mailEmbed] })
                }
            }
        }
    }
}