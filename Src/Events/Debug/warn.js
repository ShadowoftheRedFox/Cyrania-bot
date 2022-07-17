const Event = require('../../Structures/Event');
var colors = require("colors")

module.exports = class extends Event {
    async run(string) {
        return console.log(["WARN".bgYellow.black, string].join(" "));
    }
}