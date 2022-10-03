const Command = require('../../Structures/Command');
const { exec } = require("child_process");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Execute commands in the console.',
            category: 'Owner',
            usage: "<query>",
            ownerOnly: true,
            categoryFR: "Propriétaire",
            descriptionFR: "Exécute un code dans la console."
        });
    }

    // eslint-disable-next-line no-unused-vars
    async run(message) {
        const args = message.content.split(" ")
        if (!args[1]) return message.channel.send("No content to execute.")
        const content = args.slice(1).join(" ")
        message.channel.send("Running...").then(msg => {
            exec(content, (error, stdout) => {
                const response = stdout || error;
                msg.edit(response.toString(), { split: true, code: true });
            });
        })
    }

};