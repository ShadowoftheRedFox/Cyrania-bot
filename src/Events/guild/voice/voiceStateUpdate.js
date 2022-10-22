const Event = require('../../../Structures/Event');
const { VoiceState } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {VoiceState} state
    */
    async run(state) {
        return console.log(this.name);
    }
};