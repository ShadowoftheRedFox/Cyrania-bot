const Slash = require('../Structures/Slash');
const UserList = require("../Data/User.json");
const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = class extends Slash {

    constructor(...args) {
        super(...args, {
            isGlobal: false,
            data: new SlashCommandBuilder()
                .setName("ping")
                .setDescription("Pong! | Gives the latency of the bot.")
        });
    }

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const inter = await interaction.reply("Pinging...");

        const latency = inter.interaction.createdTimestamp - interaction.createdTimestamp;
        const choicesFR = ['C\'est vraiment ma latence?', 'C\'est mauvais? Je ne peut pas voir!', 'J\'éspère que ce n\'est pas si mal...'];
        const choicesEN = ['Is this really my ping?', 'Is this okay? I can\'t look!', 'I hope it isn\'t bad!'];
        const responseEN = choicesEN[Math.floor(Math.random() * choicesEN.length)];
        const responseFR = choicesFR[Math.floor(Math.random() * choicesFR.length)];

        if (UserList[interaction.user.id].langue === "FR") return interaction.editReply(`${responseFR} - Latence du bot: \`${latency}ms\`, Latence de l'API: \`${Math.round(this.client.ws.ping)}ms\``);
        else return interaction.editReply(`${responseEN} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(this.client.ws.ping)}ms\``);
    }
};







// const { SlashCommandBuilder } = require("@discordjs/builders");
// const wait = require("util").promisify(setTimeout);
// const UserList = require("../Data/User.json");

// // https://discordjs.guide/interactions/replying-to-slash-commands.html#subcommands

// /**
//  * @type {SlashCommand}
//  */
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("ping")
//         .setDescription("Pong! | Gives the latency of the bot."),
//     isGlobal: true,
//     guildSpecific: [],
//     async execute(client, interaction) {
//         const msg = await interaction.reply("Pinging...");

//         const latency = msg.interaction.createdTimestamp - interaction.createdTimestamp;
//         const choicesFR = ['C\'est vraiment ma latence?', 'C\'est mauvais? Je ne peut pas voir!', 'J\'éspère que ce n\'est pas si mal...'];
//         const choicesEN = ['Is this really my ping?', 'Is this okay? I can\'t look!', 'I hope it isn\'t bad!'];
//         const responseEN = choicesEN[Math.floor(Math.random() * choicesEN.length)];
//         const responseFR = choicesFR[Math.floor(Math.random() * choicesFR.length)];

//         if (UserList[interaction.user.id].langue === "FR") return interaction.editReply(`${responseFR} - Latence du bot: \`${latency}ms\`, Latence de l'API: \`${Math.round(client.ws.ping)}ms\``);
//         else return interaction.editReply(`${responseEN} - Bot Latency: \`${latency}ms\`, API Latency: \`${Math.round(client.ws.ping)}ms\``);

//         await interaction.deferReply({ ephemeral: true });
//         await wait(2000);
//         await interaction.editReply({
//             content: `Pong! API Latency: \`${Math.round(client.ws.ping)}ms\``,
//             ephemeral: true
//         });
//         await wait(2000);
//         await interaction.editReply({
//             content: "Magic, latency does not exist with me!",
//             ephemeral: true
//         });
//         await wait(1000);
//         await interaction.followUp({
//             content: `Pong again! API Latency: \`0ms\``,
//             ephemeral: true
//         });

//         //await interaction.deleteReply(); to delete reply
//         // /!\ you can't delete ephemeral message
//     }
// };