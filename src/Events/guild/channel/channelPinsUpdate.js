const Event = require('../../../Structures/Event');
const { GuildChannel, Message } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {GuildChannel} channel
    */
    async run(channel) {
        return console.log(this.name);
    }
};