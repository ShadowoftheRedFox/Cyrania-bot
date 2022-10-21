const Event = require('../../../Structures/Event');
const { } = require("discord.js");

//TODO type of response?

module.exports = class extends Event {
    /**
    * @param {}
    */
    async run(server) {
        console.log(this.name);
        console.log("Guild voice server update.");
        return console.log(server);
    }
}