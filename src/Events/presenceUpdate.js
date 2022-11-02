const Event = require('../Structures/Event');
const { InteractionResponse } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {InteractionResponse} interaction
    */
    async run(interaction) {
        return;
        // return console.log(this.name);
    }
};