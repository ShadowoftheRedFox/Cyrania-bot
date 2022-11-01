const Command = require('../../Structures/Command');
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Message } = require("discord.js");
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
const fs = require("fs");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ["RATP/K++ Project. Optimised traject from station A to B in real time.", 'Projet RAPT/K++. Otpimisation de trajet d\'une station A à une station B en temps réel.'],
            category: ['RATP/K++', "RATP/K++"],
            ownerOnly: true
        });
    }

    /**
     * @param {Message} message 
     * @param {string[]} param1 
     */
    async run(message, [stopStart, stopEnd]) {

        /*
        TODO get the list of all line with api/static array to get the start station
        then display all in the menu
        then in interaction, get the list of all station
        then same step for end stattion

        then work with k++ to choose the best travel from start to end
        and display result
        & Add a warning if we find a better way during the journey
        */

        const rowLine = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('ratpkpp_Ligne')
                    .setPlaceholder('Choose your starting line.')
                    .addOptions(
                        {
                            label: 'RER A',
                            description: 'Will display all stops of this line.',
                            value: 'rer_a',
                        },
                        {
                            label: 'RER B',
                            description: 'Will display all stops of this line.',
                            value: 'rer_b',
                        },
                    )
            );

        const rowStations = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('ratpkpp_Stop')
                    .setPlaceholder('Choose a line first!')
                    .addOptions({
                        label: 'Stop Name',
                        description: 'Here willbe all the stop of the choosen line.',
                        value: 'invalid_id' // name all options like this so that the even handler ignore them
                    })
            );

        message.reply({ content: 'Choose a station:', components: [rowLine, rowStations] });
    }
};