const Event = require('../../Structures/Event');
const { Webhook } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Webhook} webhook 
    */
    async run(webhook) {
        console.log(this.name);
        console.log("Webhoo.");
        return console.log(webhook);
    }
}