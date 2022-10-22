const Event = require('../../../Structures/Event');
const { GuildBan } = require("discord.js");

module.exports = class extends Event {
    /**
    * @param {GuildBan} ban
    */
    async run(ban) {
        return console.log(this.name);
    }
};