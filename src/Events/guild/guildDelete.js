const Event = require('../../Structures/Event');
const { Guild } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Guild} guild 
    */
    async run(guild) {
        console.log(this.name);
        console.log("Guild delete.");
        return console.log(guild);
    }
}