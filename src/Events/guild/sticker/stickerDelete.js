const Event = require('../../../Structures/Event');
const { Sticker } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Sticker} sticker
    */
    async run(sticker) {
        return console.log(this.name);
    }
};