const Event = require('../../Structures/Event');
var colors = require("colors");
const ms = require("ms");

module.exports = class extends Event {
    async run(limit) {
        const timeout = limit.timeout;
        const limitation = limit.limit;
        const method = limit.method;
        const path = limit.path;
        const route = limit.route;
        const isGlobal = limit.global;

        return console.log([
            "RATELIMIT".bgBlue.black,
            `${isGlobal == true ? "[GLOBAL RATE LIMIT] This is a global rate limit, not due to your client especially.".blue : ""}[END IN] ${ms(timeout, { long: false })}`.blue,
            `[LIMIT] limited to ${limitation} of ${method}`.blue,
            `[PATH & ROUTE] ${path} -//- ${route}`
        ].join("\n"));
    }
};