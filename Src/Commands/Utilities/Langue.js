const UserList = require("../../Data/User.json");
const GuildList = require("../../Data/Guild.json");
const Command = require('../../Structures/Command');
const fs = require("fs");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Change your language!', "Changez votre langue!"],
            category: ['Utilities', "Utilité"],
            aliases: ["language", "langage", "lang"],
            usage: ["<FR / EN>", "<FR / EN>"],
            displayName: ["Langage", "Langue"]
        });
    }

    async run(message) {
        const args = message.content.split(' ');
        const ID = message.author.id;
        let prefix = ",,";
        if (message.guild) prefix = GuildList[message.guildId].prefix;

        if (!args[1]) {
            if (UserList[ID].langue === "EN") return message.channel.send(`Send \`${prefix}language <EN/FR>\`.`);
            if (UserList[ID].langue === "FR") return message.channel.send(`Envoyez \`${prefix}langue <EN/FR>\`.`);
        }
        if (args[1] === "FR" || args[1] === "fr") {
            if (UserList[ID].langue === "FR") {
                return message.channel.send("La langue française est déjà ma langue de prédilection pour toi!!");
            }
            UserList[ID].langue = "FR";
            fs.writeFile("./src/Data/User.json", JSON.stringify(UserList, UserList, 3), function (err) {
                if (err) console.log(err);
            });
            return message.channel.send("Je parle français pour toi maintenant!");
        }

        if (args[1] === "EN" || args[1] === "en") {
            if (UserList[ID].langue === "EN") {
                return message.channel.send("I'm already talking english for you!!");
            }
            UserList[ID].langue = "EN";
            fs.writeFile("./src/Data/User.json", JSON.stringify(UserList, UserList, 3), function (err) {
                if (err) console.log(err);
            });
            return message.channel.send("I'm talking in english for you now!");
        }
    }
};