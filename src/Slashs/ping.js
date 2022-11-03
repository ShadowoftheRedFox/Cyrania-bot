const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, Client, Locale } = require("discord.js");

const wait = require("util").promisify(setTimeout);
// https://discordjs.guide/interactions/replying-to-slash-commands.html#subcommands

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong! | Gives the latency of the bot."),
    isGlobal: false,
    guildSpecific: [],

    /**
     * @param {MenuDocsClient} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: true });
        await wait(2000);
        await interaction.editReply({
            content: `Pong! API Latency: \`${Math.round(client.ws.ping)}ms\``,
            ephemeral: true
        });
        await wait(2000);
        await interaction.editReply({
            content: "Magic, latency does not exist with me!",
            ephemeral: true
        });
        await wait(1000);
        await interaction.followUp({
            content: `Pong again! API Latency: \`0ms\``,
            ephemeral: true
        });

        //await interaction.deleteReply(); to delete reply 
        // /!\ you can't delete ephemeral message
    }
};