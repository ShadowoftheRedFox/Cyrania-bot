const Event = require('../../../Structures/Event');
const { ThreadMember } = require("discord.js");

//TODO member[] ?

module.exports = class extends Event {
    /**
    * @param {ThreadMember} member
    */
    async run(member) {
        console.log(this.name);
        console.log("Guild thread members update.");
        return console.log(member);
    }
}