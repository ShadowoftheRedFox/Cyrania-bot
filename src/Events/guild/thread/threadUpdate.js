const Event = require('../../../Structures/Event');
const { ThreadChannel } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {ThreadChannel} channel
    */
    async run(channel) {
        return console.log(this.name);
    }
};