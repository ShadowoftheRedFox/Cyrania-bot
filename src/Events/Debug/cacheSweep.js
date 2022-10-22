const Event = require('../../Structures/Event');
// const { } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {} cache
    */
    async run(cache) {
        return console.log(this.name);
    }
};