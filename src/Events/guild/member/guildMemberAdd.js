const Event = require('../../../Structures/Event');
const { GuildMember } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildMember} member
    */
    async run(member) {
        console.log(this.name);
        console.log("Guild member add.");
        return console.log(member);
    }
}