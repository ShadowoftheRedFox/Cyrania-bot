const Event = require('../../../Structures/Event');
const { Emoji } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Emoji} emoji
    */
    async run(emoji) {
        console.log(this.name);
        console.log("Guild emoji delete.");
        return console.log(emoji);
    }
}