const { MessageAttachment } = require('discord.js');
const Command = require('../../Structures/Command');
const { inspect } = require('util');
const { Type } = require('@anishshobith/deeptype');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['per'],
            description: ['Perform some codes', "Execute du code."],
            category: ['Owner', "Propriétaire"],
            ownerOnly: true
        });
    }

    async run(message) {
        const args = message.content.split(" ");
        const msg = message;
        if (!args[1]) return msg.channel.send("I need code to perform.");
        let code = args.slice(1).join(' ');

        code = code.replace(/[""]/g, "'").replace(/['']/g, "'");
        let evaled;
        try {
            evaled = eval(code);
            if (evaled instanceof Promise) {
                evaled = await evaled;
            }
            await msg.channel.send("Done");
        } catch (err) {
            return message.channel.send(`Error: \`\`\`xl\n${this.clean(err)}\n\`\`\``);
        }
    }

    clean(text) {
        if (typeof text === 'string') {
            text = text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`)
                .replace(new RegExp(this.client.token, 'gi'), '****');
        }
        return text;
    }

};
