const Event = require('../../Structures/Event');
var colors = require("colors");

module.exports = class extends Event {
    async run(warn) {
        const count = warn.count;
        const timeoutms = warn.remainingTime;
        const timeoutsec = Math.floor(timeoutms / 1000);
        const timeoutmin = Math.floor(timeoutsec / 60);

        if (timeoutmin * 100 <= count) {
            if (count >= 9000) return console.log(["[WARN INVALID REQUEST]".bgRed.black, `Invalid request is number is critical.\n[COUNT] ${count}\n[TIME LEFT] ${timeoutmin}:${timeoutsec}`.red].join(" "));
            return console.log(["[WARN INVALID REQUEST]".bgYellow.black, `Invalid request is bigger than recommended.\n[COUNT] ${count}\n[TIME LEFT] ${timeoutmin}:${timeoutsec}`.yellow].join(" "));
        }
    }
};