const Event = require('../../../Structures/Event');
const { GuildScheduledEvent } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildScheduledEvent} scheduled
    */
    async run(scheduled) {
        return console.log(this.name);
    }
};