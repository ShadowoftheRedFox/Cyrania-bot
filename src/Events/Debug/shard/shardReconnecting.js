const Event = require('../../../Structures/Event');
const { Shard } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Shard} shard
    */
    async run(shard) {
        console.log(this.name);
        console.log("Shard reconnecting.");
        return console.log(shard);
    }
}