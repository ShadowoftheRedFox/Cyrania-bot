const Command = require('../../Structures/Command');
const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, Message } = require("discord.js");
/**
 * @type {TrainStop[]}
 */
const stopsArray = require("./arrets-lignes.json");
const minifiedStops = require("./arrets-lignes-min.json");
const fs = require("fs");

// example of a stop
// ? remove duplicate coordinates (saves space)?
const arretsExample = {
    "datasetid": "arrets-lignes",
    "recordid": "7f3a4a48c9b9acfb2c0e2e3b8c438e4bd16318d9",
    "fields": {
        "pointgeo": [48.87566737659971, 2.289435418542214],
        "stop_id": "IDFM:463121",
        "stop_name": "Argentine",
        "operatorname": "RATP",
        "nom_commune": "Paris",
        "route_long_name": "1",
        "id": "IDFM:C01371",
        "stop_lat": "48.87566737659971",
        "stop_lon": "2.289435418542214",
        "code_insee": "75056"
    }, "geometry": {
        "type": "Point",
        "coordinates": [2.289435418542214, 48.87566737659971]
    }
};

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

        const row = new ActionRowBuilder()
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
                    ),

                //! can't make too choice list in a single message
                /*
                new SelectMenuBuilder()
                    .setCustomId('ratpkpp_Station')
                    .setPlaceholder('Choose your starting station.')
                    //TODO all stations at start, alphabetic order, then filter by line choose
                    .addOptions(
                        {
                            label: 'Cergy le haut',
                            value: 'rer_a_cergy_le_haut',
                        },
                        {
                            label: 'Cergy préfecture',
                            value: 'rer_a_cergy_préfecture',
                        },
                    ),*/
            );

        message.reply({ content: 'Choose a station:', components: [row] });

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