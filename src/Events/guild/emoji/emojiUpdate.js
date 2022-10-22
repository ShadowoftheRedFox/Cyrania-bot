const Event = require('../../../Structures/Event');
const { Emoji } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Emoji} emoji
    */
    async run(emoji) {
        return console.log(this.name);
    }
};