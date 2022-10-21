const Event = require('../../../Structures/Event');
const { GuildScheduledEvent } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildScheduledEvent} event
    */
    async run(event) {
        console.log(this.name);
        console.log("Guild scheduled event delete.");
        return console.log(event);
    }
}