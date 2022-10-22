const Event = require('../../Structures/Event');
const { Guild } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Guild} guild 
    */
    async run(guild) {
        return console.log(this.name);
    }
};