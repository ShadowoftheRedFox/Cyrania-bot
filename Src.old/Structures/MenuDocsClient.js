const { Client, Collection, Permissions, Intents } = require('discord.js');
const Util = require('./Util.js');
var colors = require("colors")

module.exports = class MenuDocsClient extends Client {

	constructor(options = {}) {
		super({
			partials: ['MESSAGE', 'CHANNEL', 'REACTION', "USER", "GUILD_MEMBER"],
			allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
			intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES]
			//["GUILD_CREATE", "GUILD_UPDATE", "GUILD_DELETE", "GUILD_ROLE_CREATE", "GUILD_ROLE_UPDATE", "GUILD_ROLE_DELETE", "CHANNEL_CREATE", "CHANNEL_UPDATE", "CHANNEL_DELETE", "CHANNEL_PINS_UPDATE", "THREAD_CREATE", "THREAD_UPDATE", "THREAD_DELETE", "THREAD_LIST_SYNC", "THREAD_MEMBER_UPDATE", "THREAD_MEMBERS_UPDATE", "STAGE_INSTANCE_CREATE", "STAGE_INSTANCE_UPDATE", "STAGE_INSTANCE_DELETE", "GUILD_MEMBER_ADD", "GUILD_MEMBER_UPDATE", "GUILD_MEMBER_REMOVE", "THREAD_MEMBERS_UPDATE", "GUILD_BAN_ADD", "GUILD_BAN_REMOVE", "GUILD_EMOJIS_UPDATE", "GUILD_STICKERS_UPDATE", "GUILD_INTEGRATIONS_UPDATE", "INTEGRATION_CREATE", "INTEGRATION_UPDATE", "INTEGRATION_DELETE", "WEBHOOKS_UPDATE", "INVITE_CREATE", "INVITE_DELETE", "VOICE_STATE_UPDATE", "PRESENCE_UPDATE", "MESSAGE_CREATE", "MESSAGE_UPDATE", "MESSAGE_DELETE", "MESSAGE_DELETE_BULK", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "MESSAGE_REACTION_REMOVE_EMOJI", "TYPING_START", "MESSAGE_CREATE", "MESSAGE_UPDATE", "MESSAGE_DELETE", "CHANNEL_PINS_UPDATE", "MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE", "MESSAGE_REACTION_REMOVE_ALL", "MESSAGE_REACTION_REMOVE_EMOJI", "TYPING_START"]
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

		if (!options.owners) console.log(["WARNING".bgYellow.black, " No owners provided."].join(""))

		if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();
	}

	async start(token = this.token) {
		console.log("Loading...")
		await this.utils.loadDataBase();
		await this.utils.loadCommands();
		await this.utils.loadEvents();
		super.login(token);
	}

};