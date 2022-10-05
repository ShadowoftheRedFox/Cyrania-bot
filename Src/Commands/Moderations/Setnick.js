const Command = require('../../Structures/Command');
const { PermissionFlagsBits } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Change the nickname of someone.', "Change le surnom de quelqu'un."],
            category: ['Moderation', 'Modération'],
            usage: ["<user tag/user ID> <new nickname>", "<tag utilisateur/ID utilisateur> <nouveau pseudo>"],
            botPerms: [PermissionFlagsBits.ChangeNickname],
            modOnly: true,
            guildOnly: true
        });
    }

    async run(message, [target]) {
        const GID = message.guild.id;
        const args = message.content.split(' ');
        const AID = message.author.id;

        if (!args[1]) return message.author.send("Please tag or put the ID of the user you want to rename.");

        const member = message.mentions.members.first() || message.guild.members.cache.get(target);
        if (!member) return message.channel.send("I wasn't able to find this user.");

        const nick = args.slice(2).join(" ").toString();
        if (nick.length > 32) return message.author.send("You can't set a nick longer than 32 characters!");
        try {
            await member.setNickname(nick, `Command setnick fired by ${message.author.tag}`);
            return message.channel.send(`Changed the nickname of ${member.user.tag} to ${nick}.`);
        } catch (e) {
            console.log(e.stack);
            return message.channel.send(`I wasn't able to change the nick of ${member.user.tag}`);
        }
    }
};