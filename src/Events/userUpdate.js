const Event = require('../Structures/Event');
const { User } = require("discord.js");

//TODO type of response?

module.exports = class extends Event {
    /**
    * @param {User} user
    */
    async run(user) {
        return console.log(this.name);
    }
};