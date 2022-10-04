const { PermissionsBitField, Client } = require("discord.js");

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
	 * cooldown: 	number}} options 
	 */
	constructor(client, name, options = {}) {
		this.client = client;
		this.name = name;
		this.displayName = options.name || [name, name];
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

		this.closed = false;
		this.reason = null;
		this.openTime = 0;
		this.error = [];
		this.validate(this, options);
	}

	validate(commandParam, options) {
		commandParam.usage = this.optionsToArray(options.usage);
		commandParam.description = this.optionsToArray(options.description);
		commandParam.category = this.optionsToArray(options.category);
		commandParam.displayName = this.optionsToArray(options.displayName);

		console.log(`Descriptoin: ${commandParam.description}\n`, `Category: ${commandParam.category}\n`, `Name: ${commandParam.displayName}\n`, `Usage: ${commandParam.usage}\n`);
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

	async run(message, args) {
		throw new Error(`Command ${this.name} doesn"t provide a run method!`);
	}

};