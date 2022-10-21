const Event = require('../Structures/Event');
const { } = require("discord.js");

//TODO type of response?

module.exports = class extends Event {
    /**
    * @param {} 
    */
    async run(interaction) {
        console.log(this.name);
        console.log("Interaction creation.");
        return console.log(interaction);
    }
}