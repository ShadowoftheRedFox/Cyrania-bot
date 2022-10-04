const { Message } = require("discord.js");
const MenuDocsClient = require("./MenuDocsClient");

module.exports = class Event {

	/**
	 * 
	 * @param {MenuDocsClient} client 
	 * @param {string} name 
	 * @param {*} options 
	 */
	constructor(client, name, options = {}) {
		this.name = name;
		this.client = client;
		this.type = options.once ? 'once' : 'on';
		this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
	}

	// eslint-disable-next-line no-unused-vars
	/**
	 * 
	 * @param {Message} message 
	 * @param  {...any} args 
	 */
	async run(message, ...args) {
		throw new Error(`The run method has not been implemented in ${this.name}`);
	}

};
