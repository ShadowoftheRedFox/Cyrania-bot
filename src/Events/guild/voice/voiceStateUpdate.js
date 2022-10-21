const Event = require('../../../Structures/Event');
const { VoiceState } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {VoiceState} state
    */
    async run(state) {
        console.log(this.name);
        console.log("Guild voice state update.");
        return console.log(state);
    }
}