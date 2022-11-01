const Command = require('../../Structures/Command');
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ["RATP/K++ Project. Optimised traject from station A to B in real time.", 'Projet RAPT/K++. Otpimisation de trajet d\'une station A à une station B en temps réel.'],
            category: ['RATP/K++', "RATP/K++"]
        });
    }
    async run(message, ...args) {

        /*
        TODO get the list of all line with api/static array to get the start station
        then display all in the menu
        then in interaction, get the list of all station
        then same step for end stattion

        then work with k++ to choose the best travel from start to end
        and display result
        & Add a warning if we find a better way during the journey
        */

        const row = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('ratpkpp_Ligne1')
                    .setPlaceholder('Nothing selected')
                    .addOptions(
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ),
            );

        message.reply({ content: 'Pong!', components: [row] });
    }
};

/**
 * @return {string[]}
 */
function getAllLine() { }

/**
 * @param {string} line
 * @return {string[]} 
 */
function getAllStationFromLine(line) { }