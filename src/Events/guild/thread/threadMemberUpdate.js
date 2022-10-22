const Event = require('../../../Structures/Event');
const { ThreadMember } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {ThreadMember} member
    */
    async run(member) {
        return console.log(this.name);
    }
};