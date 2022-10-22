const Event = require('../../../Structures/Event');
const { Role } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Role} role
    */
    async run(role) {
        return console.log(this.name);
    }
};