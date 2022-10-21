const Event = require('../../../Structures/Event');
const { ThreadMember } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {ThreadMember} member
    */
    async run(member) {
        console.log(this.name);
        console.log("Guild thread member update.");
        return console.log(member);
    }
}