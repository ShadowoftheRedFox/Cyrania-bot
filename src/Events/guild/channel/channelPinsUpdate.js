const Event = require('../../../Structures/Event');
const { GuildChannel, Message } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {GuildChannel} channel
    */
    async run(channel) {
        console.log(this.name);
        console.log("Guild channel pins update.");
        return console.log(channel);
    }
}