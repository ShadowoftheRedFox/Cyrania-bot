const Event = require('../../../Structures/Event');
const { GuildBan } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildBan} ban
    */
    async run(ban) {
        console.log(this.name);
        console.log("Guild ban remove.");
        return console.log(ban);
    }
}