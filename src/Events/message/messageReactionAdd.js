const Event = require('../../Structures/Event');
const { Message } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Message} message 
    */
    async run(message) {
        console.log(this.name);
        console.log("Message reaction add.");
        return console.log(message);
    }
}