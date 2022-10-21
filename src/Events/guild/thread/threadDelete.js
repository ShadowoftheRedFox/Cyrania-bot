const Event = require('../../../Structures/Event');
const { ThreadChannel } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {ThreadChannel} channel
    */
    async run(channel) {
        console.log(this.name);
        console.log("Guild thread channel delete.");
        return console.log(channel);
    }
}