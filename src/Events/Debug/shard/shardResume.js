const Event = require('../../../Structures/Event');
const { Shard } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {Shard} shard
    */
    async run(shard) {
        return console.log(this.name);
        console.log("Shard resume.");
        return console.log(shard);
    }
}