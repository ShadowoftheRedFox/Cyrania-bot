const profile = require("../../Data/profile.json");
const Command = require('../../Structures/Command');
const fs = require("fs")

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Change your language!',
            category: 'Utilities',
            aliases: ["language", "langage", "lang"],
            categoryFR: "Utilité",
            descriptionFR: "Changez votre langue!",
            usage: "<FR / EN>"
        });
    }

    async run(message) {
        const args = message.content.split(' ')
        const ID = message.author.id;

        if (!args[1]) {
            if (profile[ID].langue === "EN") return message.channel.send(`Send \`\`!!language EN/FR\`\`.`)
            if (profile[ID].langue === "FR") return message.channel.send(`Envoyez \`\`!!langue EN/FR\`\`.`)
        }
        if (args[1] === "FR" || args[1] === "fr") {
            if (profile[ID].langue === "FR") {
                return message.channel.send("La langue française est déjà ma langue de prédilection pour toi!!")
            }
            profile[ID].langue = "FR"
            fs.writeFile("./src/Data/profile.json", JSON.stringify(profile, profile, 3), function(err) {
                if (err) console.log(err)
            })
            return message.channel.send("Je parle français pour toi maintenant!\n**Notez que seul le setup est traduit en français pour faciliter la mise en place. Tout le reste est entièrement en anglais.**")
        }

        if (args[1] === "EN" || args[1] === "en") {
            if (profile[ID].langue === "EN") {
                return message.channel.send("I'm already talking english for you!!")
            }
            profile[ID].langue = "EN"
            fs.writeFile("./src/Data/profile.json", JSON.stringify(profile, profile, 3), function(err) {
                if (err) console.log(err)
            })
            return message.channel.send("I'm talking in english for you now!")
        }
    }
}