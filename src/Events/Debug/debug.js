const Event = require("../../Structures/Event");
var colors = require("colors");

module.exports = class extends Event {
    async run(string) {
        if (string.toLowerCase().includes("heartbeat")) {
            return this.client.emit("heartbeat", string);
        }
        console.log(["DEBUG".bgGreen.black, string].join(" "));
    }
};