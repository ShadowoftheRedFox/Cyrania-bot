const Event = require('../../../Structures/Event');
const { StageInstance } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {StageInstance} stage
    */
    async run(stage) {
        return console.log(this.name);
    }
};