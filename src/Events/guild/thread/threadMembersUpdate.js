const Event = require('../../../Structures/Event');
const { ThreadMember } = require("discord.js");

//TODO member[] ?

module.exports = class extends Event {
    /**
    * @param {ThreadMember} member
    */
    async run(member) {
        return console.log(this.name);
    }
};