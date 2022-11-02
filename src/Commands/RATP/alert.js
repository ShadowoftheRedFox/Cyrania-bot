const Command = require('../../Structures/Command');
const { EmbedBuilder, Message } = require("discord.js");
/**
 * @type {TrainStop[]}
 */
const StopRawDataArray = require("./arrets-lignes-raw.json");
/**
 * @type {TrainStopMinifyV1[]}
 */
const StopArray = require("./arrets-lignes-min.v1.json");
/**
 * @type {TrainStopMinifyV2}
 */
const StopObject = require("./arrets-lignes-min.v2.json");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ["RATP/K++ Project. Get alert of the traffic.", 'Projet RAPT/K++. Recevez des alertes du traffic.'],
            category: ['RATP/K++', "RATP/K++"],
            usage: ["<on/off>", "<on/off>"]
        });
    }

    /**
     * @param {Message} message 
     * @param {string[]} param1 
     */
    async run(message, [querry]) {
        const FormatedQuerry = this.client.utils.formatString(querry);
        return message.reply("COming soon.");
    }
};