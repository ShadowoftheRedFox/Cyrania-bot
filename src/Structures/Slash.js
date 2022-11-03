const { PermissionsBitField, Message, ChatInputCommandInteraction } = require("discord.js");

/**
 * @type {Slash}
 */
module.exports = class Slash {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = name;
        this.data = options.data;
        this.isGlobal = options.isGlobal || false;
        this.guildSpecific = options.guildSpecific || [];

        this.userPerms = new PermissionsBitField(options.userPerms).freeze();
        this.botPerms = new PermissionsBitField(options.botPerms).freeze();
        this.guildOwnerOnly = options.guildOwnerOnly || false;
        this.adminOnly = options.adminOnly || false;
        this.managerOnly = options.managerOnly || false;
        this.modOnly = options.modOnly || false;
        this.staffOnly = options.staffOnly || false;

        this.nsfw = options.nsfw || false;
        this.cooldown = options.cooldown || 3000;

        // for the help menu only
        this.displayName = options.displayName || [name, name];
        this.description = options.description || ["No description provided.", "Pas de description donnée."];
        this.category = options.category || ["General", "Général"];
        this.usage = options.usage || ["No usage provided.", "Pas d'utilisation précisée."];
        this.validate(this, options, name);
    }

    validate(commandParam, options, name) {
        if (!options.data || typeof options.data.toJSON != "function") throw new TypeError("data is not defined or not an instance of SlashCommandBuilder.");
        console.log(typeof options.data);
        console.log(options.data);


        if (Array.isArray(options.displayName) && options.displayName.length == 1) {
            options.displayName.push(this.client.utils.capitalise(name));
        } else if (!options.displayName || !Array.isArray(options.displayName)) {
            options.displayName = [this.client.utils.capitalise(name), this.client.utils.capitalise(name)];
        }

        commandParam.usage = this.optionsToArray(options.usage);
        commandParam.description = this.optionsToArray(options.description);
        commandParam.category = this.optionsToArray(options.category);
        commandParam.displayName = this.optionsToArray(options.displayName);
    }

    /**
     * 
     * @param {any} param 
     * @returns {string[]}
     */
    optionsToArray(param) {
        if (!param) {
            return ["", ""];
        } else {
            if (!param.length || typeof param != "object" || param.length < 2) param = [param.toString(), param.toString()];
            return param;
        }
    }

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {...any} args 
     */
    async execute(interaction, ...args) {
        throw new Error(`Slash ${this.name} doesn"t provide a run method!`);
    }
};