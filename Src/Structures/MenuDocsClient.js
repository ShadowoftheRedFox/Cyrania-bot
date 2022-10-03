const { Client, Collection, Permissions, Intents } = require('discord.js');
const Util = require('./Util.js');

module.exports = class MenuDocsClient extends Client {

	constructor(options = {}) {
		super({
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', "USER", "GUILD_MEMBER"],
			allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES]
		});
		this.validate(options);

		this.commands = new Collection();

		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);

		this.owners = options.owners;
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.token = options.token;

		if (!options.owners || options.owners.length == 0) console.log(["WARNING".bgYellow.black, " No owners provided."].join(""));

		if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();
	}

	async start(token = this.token) {
		console.log("Loading...");
		// await this.utils.loadDataBase();
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		super.login(token);
	}

};