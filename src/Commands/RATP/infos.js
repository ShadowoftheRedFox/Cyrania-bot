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
            description: ["RATP/K++ Project. Get infos on a line or a station.", 'Projet RAPT/K++. Prenez des informations sur une ligne ou une station.'],
            category: ['RATP/K++', "RATP/K++"],
            usage: ["<station name / line name / other>", "<nom d'une station / nom d'une ligne / autre>"],
            ownerOnly: true
        });
    }

    /**
     * @param {Message} message 
     * @param {string[]} param1 
     */
    async run(message, [querry]) {
        const FormatedQuerry = this.client.utils.formatString(querry);
        if (["autre", "other", "others", "autres"].includes(FormatedQuerry)) {
            // display accidents and events on the network
        } else {
            // check if querry is a line or a station
            // if not found, display help message
        }
    }
};