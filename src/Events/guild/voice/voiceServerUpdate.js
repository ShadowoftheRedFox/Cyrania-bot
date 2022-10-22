const Event = require('../../../Structures/Event');
// const { } = require("discord.js");

//TODO type of response?

module.exports = class extends Event {
    /**
    * @param {}
    */
    async run(server) {
        return console.log(this.name);
    }
};