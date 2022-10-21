const Event = require('../../Structures/Event');
const { Message } = require("discord.js");

//TODO message[] ?

module.exports = class extends Event {
    /**
    * @param {Message} message 
    */
    async run(message) {
        console.log(this.name);
        console.log("Message delete bulk.");
        return console.log(message);
    }
}