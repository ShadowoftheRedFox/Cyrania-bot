const Event = require('../../../Structures/Event');
const { Role } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Role} role
    */
    async run(role) {
        console.log(this.name);
        console.log("Guild role create.");
        return console.log(role);
    }
}