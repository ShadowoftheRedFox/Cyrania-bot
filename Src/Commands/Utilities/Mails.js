const Command = require('../../Structures/Command');
const profile = require("../../Data/User.json");
const GuildList = require("../../Data/Guild.json");
const config = require('../../Data/ConfigFile.json');
const fs = require("fs");
const ms = require("ms");
var color = require("colors");
//TODO update embed
const { EmbedBuilder } = require("discord.js");

function embedFct(number) {
    const current = allMail.slice(number, number + 10);
    mailsEMbed.setTitle(`✉ Mails ${number + 1}-${number + current.length} out of ${allMail.length} (${categoryType})`);
    const thisTab = [];
    current.forEach(c => {
        thisTab.push(c);
    });
    mailsEMbed.addField(`Mail box:`, thisTab.join(""));
    return mailsEMbed;
}

function chooseMailType(str) {
    let toReturn = "";
    switch (str) {
        case "user":
            toReturn = "[Personnal mail]";
            break;
        case "server":
            toReturn = "[Server mail]";
            break;
        case "global":
            toReturn = "[Bot staff mail]";
            break;
        case "staff":
            toReturn = "[Server staff mail only]";
            break;
        case "mod":
            toReturn = "[Server mod mail only]";
            break;
        case "manager":
            toReturn = "[Server manager mail only]";
            break;
        case "admin":
            toReturn = "[Server admin mail only]";
            break;
        case "owner":
            toReturn = "[Bot staff to server owner mail only]";
            break;
        default:
            toReturn = "[Unknown mail type]";
    }
    return toReturn;
}

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Send a mail!', "Envoyez un mail!"],
            category: ['Utilities', "Utilité"],
            aliases: ["mail", "email", "emessage", "emsg", "msg", "message"],
            usage: ["[help]", "[aide]"]
        });
    }

    async run(message) {
        const ID = message.author.id;
        var GID = ID;
        if (message.guild) GID = message.guild.id;
        const args = message.content.split(" ");
        const globalUser = config.mail.globalUser;
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        function toLC(number) {
            if (!args[number]) return undefined;
            else return args[number].toLowerCase();
        }

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
            };
            fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                if (err) console.log(err);
            });
        }
        const userMail = profile[ID].data.mail;
        if (!toLC(1) || toLC(1) == "help") {
            let userTab = [
                "**[Mail help]**",
                "`,,mails send <id/tag> <text>`: send a mail to this user.", //done
                "`,,mails status <dnd/online>`: change your status to be notified or not from a mail.", //done
                "`,,mails box [read/favorite/unread/saved/sended/global]`: see all of your mail, or some of them.", //done
                "`,,mails <read/favorite/unread/delete/save> <number> [text]`: do something with a received email (if possible).", //nearly done
                "`,,mails <edit/delete> <number> <text>`: edit or delete a sended mail (the number must be from `,,mail box sended`).",
                "`,,mails <block/whitelist> <if/user mention> [remove]`: block or white list this user from sending you mails.", //done
                "`,,mails blockall <on/off>`: block all users from sending you mails except whitelisted users.", //done
                "`,,mails manage [page number]`: a list of everything you can do with mails."
            ];
            let globalTab = [
                "\n**[Global mail]**",
                "`,,mails globalsend <text>`: send a mail to every bot user.",
                "`,,mails box global`: get the list of global mails sended.",
                "`,,mails global <edit/delete> <number> [text]`: edit or delete a global mail (the number must be from `,,mail box global`).",
                "`,,mails restrict <ID/user mention> <time> [reason]`: restrict a user from sending mails."
            ];
            let adminTab = [
                "\n**[Admin mail]** ||In server only.||",
                "`,,mails serversend <text>`: send a mail to every server member.",
                "`,,mails servermod <text>`: send a mail to every server mod.",
                "`,,mails serverstaff <text>`: send a mail to every staff member.",
                "`,,mails servermanager <text>`: send a mail to every server manager.",
                "`,,mails serveradmin <text>`: send a mail to every server admin.",
                "`,,mails box [server/mod/staff/manager/admin]`: get the list of server mails sended, or a type of sended mails.",
                "`,,mails server <edit/delete> <number> [text]`: edit or delete a server mail (the number must be from `,,mail box server`)."
            ];
            let shadowTab = [
                "\n**[Bot owner mail]**",
                "`,,mails globaluser <add/remove> <ID>`: add or remove global user." //done
            ];

            let currentTab = userTab;
            if (globalUser.indexOf(ID) > -1) currentTab = currentTab.concat(globalTab);
            if (message.guild && message.member.permissions.has("ADMINISTRATOR")) currentTab = currentTab.concat(adminTab);
            if (ID == "431839245989183488") currentTab = currentTab.concat(shadowTab);

            return message.channel.send(currentTab.join('\n'));
        }

        if (toLC(1) == "send") {
            if (config.mail.restrictedUsers.tab.indexOf(ID) > -1) return message.channel.send("You are restricted from sending mails by the bot staff.\nYou have received a direct message specifying the reason and duration.");
            if (!args[2]) return message.channel.send("Please provide the mention or the ID of the user you want to send a mail.");
            const { users } = this.client;
            const member = message.guild ? message.mentions.members.first() || message.guild.members.cache.get(`${args[2]}`) : message.mentions.users.first() || users.cache.get(`${args[2]}`);

            if (!member) return message.channel.send("I wasn't able to find this user. Maybe I don't have a common server with him.");
            if (member.user && member.user.bot || member.bot) return message.channel.send("It seems useless to send a mail to a bot, isn't it?");
            if ((member.user && member.user.id == ID || member.id == ID) && ID != "431839245989183488") return message.channel.send("You can't send a mail to yourself!");
            if (!args[3]) return message.channel.send("You need to provide the content of you mail!");
            const content = args.slice(3).join(" ");
            const attaTab = [];
            if (message.attachments) {
                message.attachments.forEach(element => {
                    attaTab.push(element.attachment);
                });
            }
            //files
            if (content.length > 2000) return message.channel.send("Due to discord restrictions, bot can not send over 2000 caracters. Please reduce your mails to fiinto those 2000 caracters.");
            let preview = "";
            for (let pas = 0; pas <= content.length && pas <= 20; pas++) {
                preview += (content.split(""))[pas];
            }
            preview += "...";


            const mail = {
                content: content,
                preview: preview,
                authorID: ID,
                authorTag: message.author.tag,
                targetID: message.guild ? member.user.id : member.id,
                targetTag: message.guild ? member.user.tag : member.tag,
                sended: dateTime,
                sendedMS: Date.now(),
                type: "user",
                edited: false,
                file: {
                    filesNumber: attaTab.length,
                    links: attaTab
                }
            };

            const MID = message.guild ? member.user.id : member.id;

            if (!profile[MID].data.mail) {
                profile[MID].data.mail = {
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
                };
                fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
                    if (err) console.log(err);
                });
            }

            const memberMail = profile[MID].data.mail;

            if (memberMail.blockedUsers.indexOf(ID) > -1 || memberMail.allBlocked == true && memberMail.whiteListUsers.indexOf(ID) == -1) return message.channel.send("Unfortunately, this user blocked you. Send him this mail yourself of wait to be unblocked.");

            message.channel.send(`Are you sure about sending your mail to **${message.guild ? member.user.tag : member.tag}**?`).then(msg => {
                msg.react("✅");
                msg.react("❌");
                const filter = (reaction, user) => user.id === ID;
                const collector = msg.createReactionCollector({ filter, time: 20000 });
                collector.on('collect', (reaction, user) => {
                    if (reaction.emoji.name == "❌") {
                        collector.stop();
                        return message.channel.send("The postman has lost your mail. It will not be delivered.");
                    }
                    if (reaction.emoji.name == "✅") {
                        collector.stop();
                        message.channel.send("The postman is preparing your mail, it will be delivered shortly.");

                        userMail.mailSend.mails[userMail.mailSend.number] = mail;
                        userMail.mailSend.number++;

                        memberMail.mailReceived.mails[memberMail.mailReceived.number] = mail;
                        memberMail.mailReceived.unread.push(memberMail.mailReceived.number);
                        memberMail.mailReceived.number++;
                        memberMail.notif.remind = true;
                        memberMail.notif.totalNewMail++;
                        fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                            if (err) console.log(err);
                        });

                        const choices = [
                            "*The postman chooses the stamps.*",
                            "*The postman looks at the delivery list.*",
                            "*The postman thought he had lost an email.*",
                            "*The postman is looking for the user he has to deliver.*"
                        ];
                        const response = choices[Math.floor(Math.random() * choices.length)];
                        return message.channel.send(response).then(msg => {
                            setTimeout(() => {
                                return msg.edit("Mail sent!");
                            }, Math.floor(Math.random() * 8) * 1000);
                        });
                    }
                });
            });

        }

        if (toLC(1) == "status" || toLC(1) == "s" || toLC(1) == "statuts" || toLC(1) == "statut") {
            let userStatus = userMail.status;
            if (!args[2] || toLC(2) != "dnd" && toLC(2) != "donotdisturb" && toLC(2) != "online" && toLC(2) != "on") {
                return message.channel.send([
                    "Here is all the status you can have and what they do:",
                    " - **donotdisturb** (aka **dnd**): You won't get any ping from any user mail, but you will still get a ping when it's a global mail or a server mail.",
                    " - **online** (aka **on**): You get a ping from both user and server or global mails.",
                    "*If you get to many mails from users or a users spam you, check `,,mail block` and `,,mail blockall`.*",
                    `**__Actual status:__** ${userStatus}`
                ].join("\n"));
            }

            if (toLC(2) == "dnd" || toLC(2) == "donodisturb") {
                if (userStatus == "dnd") return message.channel.send("Your status is already on donotdisturb.");
                else {
                    userStatus = "dnd";
                    fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                        if (err) console.log(err);
                    });
                    return message.channel.send("Your status is now on donotdisturb.");
                }
            }
            if (toLC(2) == "on" || toLC(2) == "online") {
                if (userStatus == "online") return message.channel.send("Your status is already on online.");
                else {
                    userStatus = "online";
                    fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                        if (err) console.log(err);
                    });
                    return message.channel.send("Your status is now on online.");
                }
            }
        }

        if (toLC(1) == "block") {
            if (!args[2]) return message.channel.send("Please provide the mention or the ID of the user you want to block.");
            const { users } = this.client;
            const member = message.guild ? message.mentions.members.first() || message.guild.members.cache.get(`${args[2]}`) : message.mentions.users.first() || users.cache.get(`${args[2]}`);
            if (!member) return message.channel.send("I wasn't able to find this user. Maybe I don't have a common server with him.");
            if (member.user && member.user.bot || member.bot) return message.channel.send("It seems useless to block a bot, isn't it?");
            const MID = message.guild ? member.user.id : member.id;
            if (toLC(3) == "remove" || toLC(3) == "delete" || toLC(3) == "r" || toLC(3) == "d") {
                if (userMail.blockedUsers.indexOf(MID) == -1) return message.channel.send("This user is not blocked.");
                userMail.blockedUsers.splice(userMail.blockedUsers.indexOf(MID), 1);
                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send(`User unblocked: ${member.user.tag}`);
            } else {
                if (userMail.blockedUsers.indexOf(MID) > -1) return message.channel.send("This user is already blocked.");
                if (userMail.whiteListUsers.indexOf(MID) > -1) return message.channel.send("This user is whitelisted! You can't block him without removing him from the whitelist.");

                userMail.blockedUsers.push(MID);
                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send(`User blocked: ${member.user.tag}`);
            }
        }
        if (toLC(1) == "white" || toLC(1) == "whitelist" || toLC(1) == "wl") {
            if (!args[2]) return message.channel.send("Please provide the mention or the ID of the user you want to whitelist.");
            const { users } = this.client;
            const member = message.guild ? message.mentions.members.first() || message.guild.members.cache.get(`${args[2]}`) : message.mentions.users.first() || users.cache.get(`${args[2]}`);
            if (!member) return message.channel.send("I wasn't able to find this user. Maybe I don't have a common server with him.");
            if (member.user && member.user.bot || member.bot) return message.channel.send("It seems useless to block a bot, isn't it?");
            const MID = message.guild ? member.user.id : member.id;
            if (toLC(3) == "remove" || toLC(3) == "delete" || toLC(3) == "r" || toLC(3) == "d") {
                if (userMail.whiteListUsers.indexOf(MID) == -1) return message.channel.send("This user is not whitelisted.");
                userMail.whiteListUsers.splice(userMail.whiteListUsers.indexOf(MID), 1);
                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send(`User unblocked: ${member.user.tag}`);
            } else {
                if (userMail.blockedUsers.indexOf(MID) > -1) return message.channel.send("This user is already whitelisted.");
                if (userMail.whiteListUsers.indexOf(MID) > -1) return message.channel.send("This user is blocked! You can't whitelist him without removing him from the blocked list.");

                userMail.blockedUsers.push(MID);
                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send(`User blocked: ${member.user.tag}`);
            }
        }
        if (toLC(1) == "blockall" || toLC(1) == "ba" || toLC(1) == "ball" || toLC(1) == "allblock") {
            if (!args[2] || toLC(2) != "false" && toLC(2) != "true" && toLC(2) != "on" && toLC(2) != "off" && toLC(2) != "disable" && toLC(2) != "enable") {
                return message.channel.send(`Do you want to block every users who are not whitelisted? Do \`,,mails blockall <on/off>\`\nYou ${userMail.allBlocked == true ? "are currently blocking all users who are not whitelisted." : "are not blocking every users."}`);
            }

            if (toLC(2) == "false" || toLC(2) == "disable" || toLC(2) == "off") {
                if (userMail.allBlocked == true) return message.channel.send("You are already blocking every users who are not whitelisted.");
                userMail.allBlocked = false;
                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send("You are now blocking all users who are not whitelisted.");
            }
            if (toLC(2) == "true" || toLC(2) == "enable" || toLC(2) == "on") {
                if (userMail.allBlocked == false) return message.channel.send("You are already not blocking every users.");
                userMail.allBlocked = true;
                fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send("You are not blocking all users anymore.");
            }
        }

        if (ID == "431839245989183488" && toLC(1) == "globaluser") {
            if (!args[2] || toLC(2) != "add" && toLC(2) != "remove" && toLC(2) != "list") return message.channel.send("You want to add or remove a user? Do `,,mails globaluser <add/remove/list> <tag/ID>`.");
            if (toLC(2) == "list") try { return message.channel.send(`List: ${config.mail.globalUser.join("\n")}`); } catch (e) { return message.channel.send("Look at the console.").then(msg => { console.log(`List: ${config.mail.globalUser.join("\n")}`); }); }
            if (!args[3]) return message.channel.send(`Plase provide the mention or the IF of the user you want to ${toLC(2) == "add" ? "add in the globaluser list." : "remove from the globaluser list."}`);
            const { users } = this.client;
            const member = message.guild ? message.mentions.members.first() || message.guild.members.cache.get(`${args[2]}`) : message.mentions.users.first() || users.cache.get(`${args[2]}`);
            if (!member) return message.channel.send("I wasn't able to find this user.");
            const MID = message.guild ? member.user.id : member.id;
            const index = config.mail.globalUser.indexOf(MID);
            if (toLC(2) == "add") {
                if (index > -1) return message.channel.send("This user is already a globaluser.");
                config.mail.globalUser.push(MID);
                fs.writeFile("./src/Data/ConfigFile.json", JSON.stringify(config, config, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send("Added.");
            }
            if (toLC(2) == "remove") {
                if (index == -1) return message.channel.send("This user is not a globaluser.");
                config.mail.globalUser.splice(index, 1);
                fs.writeFile("./src/Data/ConfigFile.json", JSON.stringify(config, config, 3), function (err) {
                    if (err) console.log(err);
                });
                return message.channel.send("Removed.");
            }
        }

        if (toLC(1) == "box") {
            let allMail = [];
            let categoryType = "All mails";
            if (!args[2]) {
                let mailsValue = Object.values(userMail.mailReceived.mails);
                let countMails = 0;
                mailsValue.forEach(element => {
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else if (toLC(2) == "read") {
                categoryType = "Mails read";
                let countMails = 0;
                userMail.mailReceived.read.forEach(preElement => {
                    const element = userMail.mailReceived.mails[preElement];
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else if (toLC(2) == "favorite") {
                categoryType = "Favorite mails";
                let countMails = 0;
                userMail.mailReceived.favorit.forEach(preElement => {
                    const element = userMail.mailReceived.mails[preElement];
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else if (toLC(2) == "unread") {
                categoryType = "Unread mails";
                let countMails = 0;
                userMail.mailReceived.unread.forEach(preElement => {
                    const element = userMail.mailReceived.mails[preElement];
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else if (toLC(2) == "saved") {
                categoryType = "Saved mails";
                let countMails = 0;
                userMail.mailReceived.saved.forEach(preElement => {
                    const element = userMail.mailReceived.mails[preElement];
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else if (toLC(2) == "global") {
                categoryType = "Global mails";
                let countMails = 0;
                userMail.mailReceived.global.forEach(preElement => {
                    const element = userMail.mailReceived.mails[preElement];
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else if (toLC(2) == "sended") {
                categoryType = "Sended mails";
                let mailsValue = Object.values(userMail.mailSend.mails);
                let countMails = 0;
                mailsValue.forEach(element => {
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            } else {
                let mailsValue = Object.values(userMail.mailReceived.mails);
                let countMails = 0;
                mailsValue.forEach(element => {
                    countMails++;
                    const mailNumber = countMails;
                    const preview = element.preview;
                    const sender = element.authorTag;
                    const type = element.type;
                    const sendDate = element.sended;
                    const sendedTimeout = element.sendedMS ? ms(Date.now() - element.sendedMS, { long: true }) : "Unknown";
                    var filesText = "";
                    if (element.file && element.file.filesNumber > 0) {
                        filesText = `This mail have ${element.file.filesNumber} file${element.file.filesNumber > 1 ? "s" : ""} in it.`;
                    } else filesText = "No files attached to the mail.";
                    const edited = element.edited;
                    var typeMail = chooseMailType(type);

                    const fullMail = [
                        `\`Mail n°${mailNumber}\` from ${sender}`,
                        `**${typeMail}: ${preview}**`,
                        `Sended the ${sendDate} (\`${sendedTimeout} ago\`)`,
                        `${filesText}`,
                        `${edited == true ? "Edited mail." : "Original mail."}`
                    ].join("\n");

                    allMail.push(fullMail);
                });
            }

            //[read/favorite/unread/saved/sended/global]
            const mailsEMbed = new MessageEmbed()
                .setTimestamp()
                .setColor("WHITE")
                .setDescription([
                    "To read a mail, do `,,mails read <mail number>`.",
                    "If you want to see only some of the mails, do `,,mails box [read/favorite/unread/saved/sended/global]`.",
                    "You want to know more? do `,,mails help` or `,,mails manage`."
                ].join("\n"));


            if (allMail.length == 0) {
                mailsEMbed.setTitle(`✉ Mails `);
                mailsEMbed.addField(`Mail box:`, "You mail box is empty!");
                return message.channel.send({ embeds: [mailsEMbed] });
            }
            if (allMail.length <= 10) return message.channel.send({ embeds: [embedFct(0)] });

            return message.channel.send({ embeds: [embedFct(0)] }).then(message => {
                try { message.react("🗑️"); } catch (e) { console.log(e.stack); }
                try { message.react('➡️'); } catch (e) { console.log(e.stack); }
                const filter = (reaction, user) => user.id == ID;
                const collector = message.createReactionCollector({ filter, time: 60000 });

                let currentIndex = 0;
                collector.on('collect', reaction => {
                    try {
                        message.reactions.removeAll().then(async () => {
                            if (reaction.emoji.name == '⬅️') currentIndex -= 10;
                            if (reaction.emoji.name == "➡️") currentIndex += 10;
                            if (reaction.emoji.name == "🗑️") {
                                collector.stop();
                                return;
                            }
                            try { message.edit(embedFct(currentIndex)); } catch (e) {
                                console.log(e.stack);
                                collector.stop();
                            }
                            if (currentIndex !== 0) try { message.react('⬅️'); } catch (e) {
                                console.log(e.stack);
                                collector.stop();
                            }
                            try { message.react("🗑️"); } catch (e) {
                                console.log(e.stack);
                                collector.stop();
                            }
                            if (currentIndex + 10 < allMail.length) try { message.react('➡️'); } catch (e) {
                                console.log(e.stack);
                                collector.stop();
                            }
                        });
                    } catch (e) {
                        console.log(e.stack);
                        collector.stop();
                    }
                });
            });

        }
        if (toLC(1) == "manage") {

        }
        if (toLC(1) == "unread") {
            if (userMail.mailReceived.unread.length == 0) return message.channel.send("Your unread mail box is empty.");
            if (!toLC(2)) return message.channel.send(`Which mail do you want to read? Type \`,,mails box unread\` to see them all.`);
            if (isNaN(toLC(2))) return message.channel.send(`Which mail do you want to read? Type \`,,mails unread <number>\`.`);
            if (toLC(2) > userMail.mailReceived.unread.length) return message.channel.send(`This mail doesn't exist. You actually have ${userMail.mailReceived.number} mail${userMail.mailReceived.number > 1 ? "s" : ""} in your mail box.`);

            const prethisMail = userMail.mailReceived.unread[toLC(2) - 1];
            console.log(prethisMail); //number of the unread mail, between 0 and mailnumber
            const thisMail = userMail.mailReceived.mails[prethisMail]; //get the mail from all the mail received
            console.log(thisMail);

            const unreadMailTabPosition = userMail.mailReceived.unread.indexOf(prethisMail); //get the position of the mail in the unread tab
            userMail.mailReceived.unread.splice(unreadMailTabPosition, 1);
            userMail.mailReceived.read.push(prethisMail);
            fs.writeFile("./src/Data/User.json", JSON.stringify(profile, profile, 3), function (err) {
                if (err) console.log(err);
            });

            const mailContent = thisMail.content;
            let thisMailFiles = [];
            if (thisMail.file.number > 0) {
                thisMailFiles = thisMail.file.links;
            }
            const mailReadEmbed = new MessageEmbed()
                .setTitle(`Unread mail n°${toLC(2)}`)
                .setColor("WHITE")
                .setDescription([
                    `If you want to make it as one of your favorite, type \`,,mails read ${toLC(2)} favorite\``
                ].join("\n"))
                .addField(chooseMailType(thisMail.type), [
                    `Sended the ${thisMail.sended} (\`${thisMail.sendedMS ? ms(Date.now() - thisMail.sendedMS, { long: true }) : "Unknown"} ago\`)`,
                    `${thisMail.edited == true ? "Edited mail." : "Original mail."}`,
                    `By ${thisMail.authorTag} (<@${thisMail.authorID}>)`
                ].join("\n"))
                .setTimestamp()
                .setFooter("Thanks for using CyraMailServices");

            return message.channel.send({ content: mailContent, embeds: [mailReadEmbed], files: thisMailFiles });
        }
        // read/favorite/unread/delete/save
        if (toLC(1) == "read") {
            if (userMail.mailReceived.read.length == 0) return message.channel.send("Your read mail box is empty.");
            if (!toLC(2)) return message.channel.send(`Which mail do you want to read? Type \`,,mails box read\` to see them all.`);
            if (isNaN(toLC(2))) return message.channel.send(`Which mail do you want to read? Type \`,,mails read <number>\`.`);
            if (toLC(2) > userMail.mailReceived.read.length) return message.channel.send(`This mail doesn't exist. You actually have ${userMail.mailReceived.number} mail${userMail.mailReceived.number > 1 ? "s" : ""} in your mail box.`);

            const prethisMail = userMail.mailReceived.read[toLC(2) - 1];
            console.log(prethisMail); //number of the unread mail, between 0 and mailnumber
            const thisMail = userMail.mailReceived.mails[prethisMail]; //get the mail from all the mail received
            console.log(thisMail);

            const mailContent = thisMail.content;
            let thisMailFiles = [];
            if (thisMail.file.number > 0) {
                thisMailFiles = thisMail.file.links;
            }
            const mailReadEmbed = new MessageEmbed()
                .setTitle(`Read mail n°${toLC(2)}`)
                .setColor("WHITE")
                .setDescription([
                    `If you want to unread this mail, type \`,,mails read ${toLC(2)} unread\``,
                    `If you want to make it as one of your favorite, type \`,,mails read ${toLC(2)} favorite\``
                ].join("\n"))
                .addField(chooseMailType(thisMail.type), [
                    `Sended the ${thisMail.sended} (\`${thisMail.sendedMS ? ms(Date.now() - thisMail.sendedMS, { long: true }) : "Unknown"} ago\`)`,
                    `${thisMail.edited == true ? "Edited mail." : "Original mail."}`,
                    `By ${thisMail.authorTag} (<@${thisMail.authorID}>)`
                ].join("\n"))
                .setTimestamp()
                .setFooter("Thanks for using CyraMailServices");

            return message.channel.send({ content: mailContent, embeds: [mailReadEmbed], files: thisMailFiles });
        }
        if (toLC(1) == "favorite") {
            if (userMail.mailReceived.read.length == 0) return message.channel.send("Your favorite mail box is empty.\nType `,,mails <read/uread/save> <number> favorite` to make it a favorite.");
            if (!toLC(2)) return message.channel.send(`Which mail do you want to read? Type \`,,mails box read\` to see them all.`);
            if (isNaN(toLC(2))) return message.channel.send(`Which mail do you want to read? Type \`,,mails read <number>\`.`);
            if (toLC(2) > userMail.mailReceived.read.length) return message.channel.send(`This mail doesn't exist. You actually have ${userMail.mailReceived.number} mail${userMail.mailReceived.number > 1 ? "s" : ""} in your mail box.`);

            const prethisMail = userMail.mailReceived.read[toLC(2) - 1];
            console.log(prethisMail); //number of the unread mail, between 0 and mailnumber
            const thisMail = userMail.mailReceived.mails[prethisMail]; //get the mail from all the mail received
            console.log(thisMail);

            const mailContent = thisMail.content;
            let thisMailFiles = [];
            if (thisMail.file.number > 0) {
                thisMailFiles = thisMail.file.links;
            }
            const mailReadEmbed = new MessageEmbed()
                .setTitle(`Read mail n°${toLC(2)}`)
                .setColor("WHITE")
                .setDescription([
                    `If you want to remove this one as one of your favorite, type \`,,mails favorite ${toLC(2)} unfavorite\``
                ].join("\n"))
                .addField(chooseMailType(thisMail.type), [
                    `Sended the ${thisMail.sended} (\`${thisMail.sendedMS ? ms(Date.now() - thisMail.sendedMS, { long: true }) : "Unknown"} ago\`)`,
                    `${thisMail.edited == true ? "Edited mail." : "Original mail."}`,
                    `By ${thisMail.authorTag} (<@${thisMail.authorID}>)`
                ].join("\n"))
                .setTimestamp()
                .setFooter("Thanks for using CyraMailServices");

            return message.channel.send({ content: mailContent, embeds: [mailReadEmbed], files: thisMailFiles });
        }

        if (toLC(1) == "save" || toLC(1) == "saved") {

        }
    }
};