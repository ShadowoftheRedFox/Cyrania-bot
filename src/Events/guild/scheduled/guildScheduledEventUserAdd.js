const Event = require('../../../Structures/Event');
const { } = require("discord.js");

//TODO response type ?

module.exports = class extends Event {
    /**
    * @param {} 
    */
    async run(user) {
        console.log(this.name);
        console.log("Guild scheduled event user add.");
        return console.log(user);
    }
}