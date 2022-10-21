const Event = require('../../../Structures/Event');
const { Invite } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Invite} invite
    */
    async run(invite) {
        console.log(this.name);
        console.log("Guild invite create.");
        return console.log(invite);
    }
}