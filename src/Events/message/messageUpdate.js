const Event = require('../../Structures/Event');
const { Message } = require("discord.js");

//TODO message.old ?

module.exports = class extends Event {
    /**
    * @param {Message} message 
    */
    async run(message) {
        return console.log(this.name);
    }
};