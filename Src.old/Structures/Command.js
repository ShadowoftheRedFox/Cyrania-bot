const { Permissions } = require('discord.js');

module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.nameFR = options.nameFR || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.descriptionFR = options.descriptionFR || 'Pas de description donnée.';
		this.category = options.category || 'General';
		this.categoryFR = options.categoryFR || 'Général';
		this.usage = `${this.name} ${options.usage || ''}\``.trim();
		this.usageFR = `${this.nameFR} ${options.usageFR || ''}\``.trim();
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
		this.cooldown = options.cooldown || "3s";
	}

	async run(message, args) {
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	}

};
