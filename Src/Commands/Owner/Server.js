const Command = require('../../Structures/Command.js');
//TODO update embed
const { EmbedBuilder } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Give the list of guilds the bot is in.', "Donne la liste des serveurs sur lesquels est le bot."],
            category: ['Owner', "Propriétaire"],
            ownerOnly: true,
            displayName: ["Server", "Serveur"]
        });
    }
    async run(message) {

        const guilds = Array.from(this.client.guilds.cache);
        const ID = message.author.id;

        /**
         * Creates an embed with guilds starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = guilds.slice(start, start + 10);

            const embed = new MessageEmbed()
                .setTitle(`Showing guilds ${start + 1}-${start + current.length} out of ${guilds.length}`)
                .setColor("BLUE");
            current.forEach(g => embed.addField(`${g[1].name}`, [
                `**ID:** ${g[0]}`,
                `**Owner:** ${g[1].ownerId}`,
                `**MemberCount:** ${g[1].memberCount}`
            ].join("\n")));

            return embed;
        };

        const author = message.author;

        message.channel.send({ embeds: [generateEmbed(0)] }).then(message => {
            if (guilds.length <= 10) return;
            message.react('➡️');
            const filter = (reaction, user) => user.id === ID;
            const collector = message.createReactionCollector({ filter, time: 60000 });

            let currentIndex = 0;
            collector.on('collect', reaction => {
                message.reactions.removeAll().then(async () => {
                    if (reaction.emoji.name === '⬅️') currentIndex -= 10;
                    else if (reaction.emoji.name === '⬅️') currentIndex += 10;
                    else if (reaction.emoji.name === '🗑️') return collector.stop();
                    message.edit({ embeds: [generateEmbed(currentIndex)] });
                    if (currentIndex !== 0) await message.react('⬅️');
                    message.react("🗑️");
                    if (currentIndex + 10 < guilds.length) message.react('➡️');
                });
            });
        });
    }
};