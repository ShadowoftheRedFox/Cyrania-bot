const Command = require('../../Structures/Command');
const { PermissionFlagsBits, Message } = require("discord.js");
const UserList = require("../../Data/User.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Add or remove the helper role from you.', "Vous ajoutes ou vous enlèves le rôle helper."],
            category: ['Specific', 'Spécifique'],
            botPerms: [PermissionFlagsBits.ManageRoles],
            guildOnly: true,
            guildWhiteList: []
        });
    }

    /**
     * @param {Message} message 
     */
    async run(message) {
        const helperRole = message.guild.roles.cache.get("");

        if (!helperRole) {
            if (UserList[ID].langue == "FR") return message.reply("Je n'arrive pas à trouvé le rôle helper!");
            else return message.reply("I can't find the helper role!");
        }

        if (message.member.roles.cache.has(helperRole.id)) {
            message.member.roles.remove(helperRole).then(res => {
                if (res) {
                    if (UserList[ID].langue == "FR") return message.reply("Votre rôle helper vous a été enlevé.");
                    else return message.reply("Your helper role has been removed.")
                } else {
                    if (UserList[ID].langue == "FR") return message.reply("Je n'ai pas pu vous enlevé le rôle.");
                    else return message.reply("I wasn't able to remove the role from you.");
                }
            });
        } else {
            message.member.roles.add(helperRole).then(res => {
                if (res) {
                    if (UserList[ID].langue == "FR") return message.reply("Le rôle helper vous a été ajouté.");
                    else return message.reply("You have now the helper role.")
                } else {
                    if (UserList[ID].langue == "FR") return message.reply("Je n'ai pas pu vous ajouter le rôle.");
                    else return message.reply("I wasn't able to give you the role.");
                }
            });
        }
    }
}