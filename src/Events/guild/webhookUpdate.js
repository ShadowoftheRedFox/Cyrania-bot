const Event = require('../../Structures/Event');
const { Webhook } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Webhook} webhook 
    */
    async run(webhook) {
        return console.log(this.name);
    }
};