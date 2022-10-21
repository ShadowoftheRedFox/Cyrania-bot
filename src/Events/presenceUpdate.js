const Event = require('../Structures/Event');
const { } = require("discord.js");

//TODO type of response?

module.exports = class extends Event {
    /**
    * @param {} 
    */
    async run(interaction) {
        console.log(this.name);
        console.log("User presence update.");
        return console.log(interaction);
    }
}