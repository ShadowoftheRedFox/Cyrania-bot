const Event = require('../Structures/Event');
const { BaseInteraction, MessageComponentInteraction } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {BaseInteraction} baseEvent
    */
    async run(baseEvent) {
        if (baseEvent.isSelectMenu() && baseEvent.customId.includes("ratpkpp")) return await ratpProject(baseEvent);
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