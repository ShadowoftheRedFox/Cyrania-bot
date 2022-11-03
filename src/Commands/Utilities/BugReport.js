const Command = require('../../Structures/Command');
const UserList = require("../../Data/User.json");
const { MessageAttachment, Attachment } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Report a bug with this command!', "Rapportez un bug aux développeurs avec cette commande!"],
            category: ['Utilities', "Utilité"],
            usage: ["<text>", "<texte>"],
            aliases: ["br", "bug", "bugr", "rappbug", "rapportbug"],
            ownerOnly: true
        });
    }

    async run(message) {
        const args = message.content.split(" ");
        const msg = args.slice(1).join(" ");


        if (UserList[message.author.id].langue === "EN" && !msg) return message.reply("You need to type some text after the command!");
        if (UserList[message.author.id].langue === "FR" && !msg) return message.reply("Vous devez taper du texte après la commande!");

        if (message.content.length >= 1900) {
            //TODO docs
            const output = new Attachment(Buffer.from(`New bug reported by <@${message.author.id}>:\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n${msg}`), 'output.txt');


            await this.client.channels.cache.get("783000325954994216").send({ content: `New bug reported by <@${message.author.id}>:`, files: [output] });
        } else this.client.channels.cache.get("783000325954994216").send(`New bug reported by <@${message.author.id}>:\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n${msg}`);


        if (UserList[message.author.id].langue === "EN") return message.reply("Your bug has been successfully sended!");
        if (UserList[message.author.id].langue === "FR") return message.reply("Votre bug à bien été envoyé!");

    }
};