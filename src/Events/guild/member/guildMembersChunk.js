const Event = require('../../../Structures/Event');
const { GuildMember } = require("discord.js");

//TODO response type?

module.exports = class extends Event {
    /**
    * @param {GuildMember} member
    */
    async run(member) {
        console.log(this.name);
        console.log("Guild members chunk.");
        return console.log(member);
    }
}