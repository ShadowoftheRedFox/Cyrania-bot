const { PermissionsBitField, Message, SnowflakeUtil } = require("discord.js");
const colors = require("colors");

module.exports = class Command {

	/**
	 * 
	 * @param {MenuDocsClient} client 
	 * @param {string} name 
	 * @param {{displayName: string[], 
	 * aliases: 	string[], 
	 * category: 	string[], 
	 * usage: 		string[],
	 * userPerms:	string[],
	 * botPerms: 	string[], 
	 * ownerOnly:	boolean, 
	 * guildOnly:	boolean
	 * adminOnly:	boolean,
	 * managerOnly: boolean,
	 * staffOnly: 	boolean,
	 * cooldown: 	number,
	 * guildWhiteList: string[]}} options 
	 */
	constructor(client, name, options = {}) {
		this.client = client;
		this.name = name;
		this.displayName = options.displayName || [name, name];
		this.aliases = options.aliases || [];
		this.description = options.description || ["No description provided.", "Pas de description donnée."];
		this.category = options.category || ["General", "Général"];
		this.usage = options.usage || ["No usage provided.", "Pas d'utilisation précisée."];
		this.userPerms = new PermissionsBitField(options.userPerms).freeze();
		this.botPerms = new PermissionsBitField(options.botPerms).freeze();
		this.guildOnly = options.guildOnly || false;
		this.ownerOnly = options.ownerOnly || false;
		this.nsfw = options.nsfw || false;
		this.args = options.args || false;
		this.guildOwnerOnly = options.guildOwnerOnly || false;
		this.adminOnly = options.adminOnly || false;
		this.managerOnly = options.managerOnly || false;
		this.modOnly = options.modOnly || false;
		this.staffOnly = options.staffOnly || false;
		this.cooldown = options.cooldown || 3000;
		this.guildWhiteList = options.guildWhiteList || [];
		this.slash = options.slash || false;

		this.closed = false;
		this.reason = null;
		this.openTime = 0;
		this.error = [];
		this.validate(this, options, name);
	}

	validate(commandParam, options, name) {
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
	 * @param {Message} message 
	 * @param {...any} args 
	 */
	async run(message, ...args) {
		throw new Error(`Command ${this.name} doesn"t provide a run method!`);
	}

};