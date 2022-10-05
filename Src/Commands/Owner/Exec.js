const Command = require('../../Structures/Command');
const { exec } = require("child_process");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: ['Evaluate code in the console.', "Evalue un code dans la console."],
            category: ['Owner', "Propriétaire"],
            usage: ["<query>", "<code>"],
            ownerOnly: true,
        });
    }

    // eslint-disable-next-line no-unused-vars
    async run(message) {
        const args = message.content.split(" ");
        if (!args[1]) return message.channel.send("No content to execute.");
        const content = args.slice(1).join(" ");
        message.channel.send("Running...").then(msg => {
            exec(content, (error, stdout) => {
                const response = stdout || error;
                msg.edit(response.toString(), { split: true, code: true });
            });
        });
    }
};