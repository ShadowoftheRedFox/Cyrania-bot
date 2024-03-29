const { Client, Collection, GatewayIntentBits, PermissionsBitField, Partials } = require('discord.js');
const Command = require('./Command.js');
const Event = require('./Event.js');
const Util = require('./Util.js');

module.exports = class MenuDocsClient extends Client {

	constructor(options = {}) {
		super({
			partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.GuildScheduledEvent, Partials.ThreadMember],
			allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildEmojisAndStickers,
				GatewayIntentBits.GuildIntegrations,
				GatewayIntentBits.GuildWebhooks,
				GatewayIntentBits.GuildInvites,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildMessageTyping,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.DirectMessageReactions,
				GatewayIntentBits.DirectMessageTyping,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildScheduledEvents
			]
		});
		this.validate(options);

		/**
		 * @type {Collection<string, Command>}
		 */
		this.commands = new Collection();

		/**
		 * @type {Collection<string, SlashCommand>}
		 */
		this.slash = new Collection();

		/**
		 * @type {Collection<string, string>}
		 */
		this.aliases = new Collection();

		/**
		 * @type {Collection<string, Event>}
		 */
		this.events = new Collection();

		this.utils = new Util(this);

		/**
		 * @type {string[]}
		 */
		this.owners = options.owners;
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.token = options.token;

		if (!options.owners || !options.owners.length) console.log(["WARNING".bgYellow.black, " No owners provided."].join(""));

		if (!options.defaultPermsBot || !options.defaultPermsBot) throw new Error('You must pass default perm(s) for the Client.');

		this.defaultPerms = new PermissionsBitField(options.defaultPermsBot).freeze();
	}

	async start(token = this.token) {
		console.log("Loading...");
		// await this.utils.loadDataBase();
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		await this.utils.loadSlashCommands();
		super.login(token);
	}

};