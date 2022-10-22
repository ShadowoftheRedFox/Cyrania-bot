const Event = require('../../../Structures/Event');
const { Invite } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Invite} invite
    */
    async run(invite) {
        return console.log(this.name);
    }
};