const Command = require('../../Structures/Command');
const { EmbedBuilder, Message, AttachmentBuilder } = require("discord.js");

/**
 * @type {TrainStopMinifyV2}
 */
const StopObject = require("./arrets-lignes-min.v2.json");
/**
 * @type {LineStopMinifyV1}
 */
const LineObject = require("./lignes-min.v1.json");
const GuildList = require("../../Data/Guild.json");

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
    async run(message, [querry = "", type = ""]) {
        const FormatedQuerry = this.client.utils.formatString(querry);
        const StationKeyArray = Object.keys(StopObject);
        const LineKeyArray = Object.keys(LineObject);

        if (["autre", "other", "others", "autres", "alert", "alerte", "traffic", "traffique"].includes(FormatedQuerry)) {
            // display accidents and events on the network
            // using request from: https://github.com/pgrimaud/horaires-ratp-api
            const EventURL = "https://api-ratp.pierre-grimaud.fr/v4/traffic";
            message.channel.send("Getting data...").then(
                /**
                 * @param {Message} msg
                 */
                msg => {
                    this.client.utils.httpGetAsync(EventURL, async (res) => {
                        if (!res) return msg.edit("Something went wrong with the API. Try again later or contact support.");
                        // if there is a response, the text must be a json object
                        /**
                         * @type {RATP_API_TRAFFIC}
                         */
                        const API_Response = JSON.parse(res.responseText);

                        const state_abnormal = {
                            metros: [],
                            rers: [],
                            tramways: []
                        };

                        // true if something is abnormal
                        let flag = false;

                        // now check if a slug is not on "normal"
                        API_Response.result.metros.forEach(line => {
                            if (line.slug != "normal") {
                                state_abnormal.metros.push(line);
                                flag = true;
                            }
                        });
                        API_Response.result.rers.forEach(line => {
                            if (line.slug != "normal") {
                                state_abnormal.rers.push(line);
                                flag = true;
                            }
                        });
                        API_Response.result.tramways.forEach(line => {
                            if (line.slug != "normal") {
                                state_abnormal.tramways.push(line);
                                flag = true;
                            }
                        });

                        const embed = new EmbedBuilder()
                            .setColor("Green")
                            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                            .setTitle("Traffic");

                        if (!flag) {
                            embed.setDescription([
                                "The traffic is normal on all lines.",
                                `You can get traffic alert with the command \`alert\`.`
                            ].join("\n"))
                                .addFields({ name: "**Metros:**", value: "✅ All lines have normal traffic." })
                                .addFields({ name: "**RERs:**", value: "✅ All lines have normal traffic." })
                                .addFields({ name: "**Tramways:**", value: "✅ All lines have normal traffic." });
                            return msg.edit({ embeds: [embed] });
                        }

                        embed.setDescription([
                            "The traffic is abnormal on some lines. Look below to have the details.",
                            "You can get traffic alert with the command `alert`."
                        ].join("\n"));

                        if (state_abnormal.metros.length > 0) {
                            let result = [];
                            state_abnormal.metros.forEach(line => {
                                result.push(`${(line.slug == "alerte") ? "⛔" : "⚠️"} **Line ${line.line}**\n${line.message}`);
                            });
                            embed.addFields({ name: "**Metros:**", value: result.join("\n") });
                        } else {
                            embed.addFields({ name: "**Metros:**", value: "✅ All lines have normal traffic." });
                        }

                        if (state_abnormal.rers.length > 0) {
                            let result = [];
                            state_abnormal.metros.forEach(line => {
                                result.push(`${(line.slug == "alerte") ? "⛔" : "⚠️"} **Line ${line.line}**\n${line.message}`);
                            });
                            embed.addFields({ name: "**RERs:**", value: result.join("\n") });
                        } else {
                            embed.addFields({ name: "**RERs:**", value: "✅ All lines have normal traffic." });
                        }

                        if (state_abnormal.tramways.length > 0) {
                            let result = [];
                            state_abnormal.metros.forEach(line => {
                                result.push(`${(line.slug == "alerte") ? "⛔" : "⚠️"} **Line ${line.line}**\n${line.message}`);
                            });
                            embed.addFields({ name: "**Tramways:**", value: result.join("\n") });
                        } else {
                            embed.addFields({ name: "**Tramways:**", value: "✅ All lines have normal traffic." });
                        }

                        msg.edit({ embeds: [embed] });
                    });
                });

        } else if (["all", "tout", "full"].includes(FormatedQuerry)) {
            // give in a txt files all station name or line name
            if (["station", "stations", "stop", "stops"].includes(this.client.utils.formatString(type))) {
                const TxtFile = Buffer.from(StationKeyArray.join("\n"), "utf8");

                const StationAttachement = new AttachmentBuilder()
                    .setFile(TxtFile, "StationNameList.txt")
                    .setDescription("The list of all the station name currently supported.")
                    .setName("StationNameList.txt");

                return message.reply({ content: "Here is a list of all the station name currently supported:", files: [StationAttachement] });
            }
            if (["line", "lines", "ligne", "lignes"].includes(this.client.utils.formatString(type))) {
                const TxtFile = Buffer.from(LineKeyArray.join("\n"), "utf8");

                const LineAttachement = new AttachmentBuilder()
                    .setFile(TxtFile, "LineNameList.txt")
                    .setDescription("The list of all the line name currently supported.")
                    .setName("LineNameList.txt");

                return message.reply({ content: "Here is a list of all the station name currently supported:", files: [LineAttachement] });
            }
            return message.reply({ embeds: [helpEmbed(message, LineKeyArray, StationKeyArray)] });
        } else {
            // check if querry is a line or a station
            // if not found, display help message

            // check if querry is a line
            let QuerryResult = checkLine(querry);
            if (QuerryResult) {
                return message.channel.send("Line found. Getting data...").then(
                    /**
                     * @param {Message} msg
                     */
                    msg => {
                        return msg.edit("Not done yet.");
                    });
            }
            // no line found, checking if querry is a station
            QuerryResult = checkStation(querry);
            if (QuerryResult) {
                return message.channel.send("Station found. Getting data...").then(
                    /**
                     * @param {Message} msg
                     */
                    msg => {
                        return msg.edit("Not done yet.");
                    });
            }
            // no station found, displaying help message
            return message.reply({ embeds: [helpEmbed(message, LineKeyArray, StationKeyArray)] });
        }
    }
};

/**
 * @param {string} querry
 * @return {LineStopMinifyV1 | null} 
 */
function checkLine(querry) { }

/**
 * @param {string} querry
 * @return {TrainStopMinifyV2 | null} 
 */
function checkStation(querry) { }

/**
 * Display the help embed.
 * @param {Message} message 
 * @param {string[]} LineKeyArray 
 * @param {string[]} StationKeyArray 
 * @return {Embed}
 */
function helpEmbed(message, LineKeyArray, StationKeyArray) {
    const ExampleStationName = [];
    const ExampleLineName = [];

    let GuildPrefix = ",,";
    if (message.guild) GuildPrefix = GuildList[message.guildId].prefix;

    for (let step = 0; step < 5; step++) {
        ExampleLineName.push(LineKeyArray[Math.floor(Math.random() * LineKeyArray.length)]);
        ExampleStationName.push(StationKeyArray[Math.floor(Math.random() * StationKeyArray.length)]);
    }

    const HelpEmbed = new EmbedBuilder()
        .setTitle("Infos Help")
        .setColor("Green")
        .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
        .setDescription([
            "This message explain how to use the infos command.",
            `You can get traffic alert with the command \`${GuildPrefix}alert\`.`
        ].join("\n"))
        .addFields({
            name: "**Command help:**", value: [
                `Get traffic infos: \`${GuildPrefix}infos other\``,
                `Get station infos: \`${GuildPrefix}infos Argentine\``,
                `Get traffic line: \`${GuildPrefix}infos 1\``,
                `Get all station names: \`${GuildPrefix}infos all stations\``,
                `Get all line names: \`${GuildPrefix}infos all lines\``,
            ].join("\n")
        })
        .addFields({ name: "**Station:**", value: "✅ All lines have normal traffic." })
        .addFields({ name: "**Lines:**", value: "✅ All lines have normal traffic." })
        .addFields({ name: "**Other:**", value: "Gives data about traffic, such as normal or alert on some lines or station." })
        .addFields({
            name: "**Examples:**", value: [
                `**Station name:** ${ExampleStationName.join(", ")}.`,
                `**Line name:** ${ExampleLineName.join(", ")}.`
            ].join("\n")
        });

    return HelpEmbed;
}