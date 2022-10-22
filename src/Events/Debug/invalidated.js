const Event = require('../../Structures/Event');
// const { } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {} invalidated
    */
    async run(invalidated) {
        return console.log(this.name);
    }
};