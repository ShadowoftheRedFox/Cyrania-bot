const Event = require('../../Structures/Event');
const { Message } = require("discord.js");

//TODO message.old ?

module.exports = class extends Event {
    /**
    * @param {Message} message 
    */
    async run(message) {
        console.log(this.name);
        console.log("Message update.");
        return console.log(message);
    }
}