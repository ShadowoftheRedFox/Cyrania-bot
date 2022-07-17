const Event = require('../../Structures/Event');
var colors = require("colors")

module.exports = class extends Event {
    async run(beat) {
        try {
            if (beat.includes("Sending") || beat.includes("Setting")) return
            const args = beat.split(" ")
            const shardNumber = args[3].toString()
            const latency = args[8].toString().split(".")
            return console.log(["HeartBeat".bgMagenta.black, `[Shard ${shardNumber}: ${latency[0]} of latency.`].join(" "));
        } catch (e) {
            return console.log(["HeartBeat".bgRed.black, `beat`].join(" "));
        }
    }
}