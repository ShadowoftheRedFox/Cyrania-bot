const Event = require('../Structures/Event');
const { User } = require("discord.js");

//TODO type of response?

module.exports = class extends Event {
    /**
    * @param {User} user
    */
    async run(user) {
        console.log(this.name);
        console.log("User update.");
        return console.log(user);
    }
}