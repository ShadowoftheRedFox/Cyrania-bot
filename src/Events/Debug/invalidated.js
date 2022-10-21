const Event = require('../../Structures/Event');
const { } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {} invalidated
    */
    async run(invalidated) {
        console.log(this.name);
        console.log("Debug invalidated.");
        return console.log(invalidated);
    }
}