const Event = require('../../../Structures/Event');
const { GuildChannel } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildChannel} channel
    */
    async run(channel) {
        console.log(this.name);
        console.log("Guild channel create.");
        return console.log(channel);
    }
}