const Event = require('../../../Structures/Event');
const { GuildMember } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {GuildMember} member
    */
    async run(member) {
        return console.log(this.name);
    }
};