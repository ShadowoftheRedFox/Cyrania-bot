const Event = require('../../Structures/Event');
const { } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {} cache
    */
    async run(cache) {
        console.log(this.name);
        console.log("Debug cache sweep.");
        return console.log(cache);
    }
}