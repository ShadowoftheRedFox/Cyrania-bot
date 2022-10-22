const Event = require('../../../Structures/Event');
const { GuildChannel } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildChannel} channel
    */
    async run(channel) {
        return console.log(this.name);
    }
};