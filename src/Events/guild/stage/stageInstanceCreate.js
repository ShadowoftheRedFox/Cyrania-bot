const Event = require('../../../Structures/Event');
const { StageInstance } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {StageInstance} stage
    */
    async run(stage) {
        console.log(this.name);
        console.log("Guild stage create.");
        return console.log(stage);
    }
}