const Event = require('../Structures/Event');
const { BaseInteraction, MessageComponentInteraction } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {BaseInteraction} interaction
    */
    async run(interaction) {
        if (interaction.isSelectMenu() && interaction.customId.includes("ratpkpp")) return await ratpProject(interaction);
        else if (interaction.isChatInputCommand()) {
            const command = this.client.slash.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                return await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
                return;
            }
        }
        return console.log(this.name);
    }
};

/**
 * 
 * @param {MessageComponentInteraction} interaction
 */
async function ratpProject(interaction) {
    return await interaction.update({ content: 'Something was selected!', components: [] });
}