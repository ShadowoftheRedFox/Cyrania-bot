const { Permissions } = require("discord.js");

module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || [name, name];
		this.aliases = options.aliases || [];
		this.description = options.description || ["No description provided.", "Pas de description donnée."];
		this.category = options.category || ["General", "Général"];
		this.usage = [];
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.botPerms = new Permissions(options.botPerms).freeze();
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
		this.validate(this, options);
	}

	validate(commandParam, options) {
		if (!options.usage) {
			commandParam.usage = ["", ""];
		} else {
			options.usage.forEach((u, i) => {
				commandParam.usage[i] = `${commandParam.name[i]} ${u[i] || ""}\``.trim();
			});
		}
	}

	async run(message, args) {
		throw new Error(`Command ${this.name} doesn"t provide a run method!`);
	}

};
