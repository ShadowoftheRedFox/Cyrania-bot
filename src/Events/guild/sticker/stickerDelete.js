const Event = require('../../../Structures/Event');
const { Sticker } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Sticker} sticker
    */
    async run(sticker) {
        console.log(this.name);
        console.log("Guild sticker delete.");
        return console.log(sticker);
    }
}