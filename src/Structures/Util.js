const { Message, SlashCommandBuilder, REST, Routes, Guild } = require('discord.js');

const { testGuilds, token } = require('../Data/Config.json');
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));

var colors = require("colors");
const fs = require("fs");

const Command = require('./Command');
const Event = require('./Event.js');
const Slash = require("./Slash");

module.exports = class Util {

	/**
	 * @param {MenuDocsClient} client 
	 */
	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	capitalise(string) {
		string = string.toString();
		return string.split(' ').map(element => {
			return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
		});
	}

	checkOwner(target) {
		return this.client.owners.includes(target);
	}

	checkWlc(wlc) {
		return this.client.wlc.includes(wlc);
	}

	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position;
	}

	formatPerms(perm) {
		return perm
			.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
	}

	exactDate() {
		var today = new Date();
		var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		return (date + ' ' + time).toString();
	}

	async loadCommands() {
		console.log(`[${this.exactDate()}] Loading commands`.red);
		return glob(`${this.directory}commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "));
					throw new TypeError(`Command ${name} doesn't export a class.`);
				}
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "));
					throw new TypeError(`Command ${name} doesnt belong in Commands.`);
				}
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						if (this.client.aliases.get(alias)) throw new SyntaxError(`Command ${command.name} have an already used aliases (${alias}) as ${this.client.aliases.get(alias)}!`);
						this.client.aliases.set(alias, command.name);
					}
				}
				console.log(`[${this.exactDate()}] Name: ${name}`.yellow);
			}
		});
	}

	async loadEvents() {
		console.log(`[${this.exactDate()}] Loading events`.red);
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "));
					throw new TypeError(`Event ${name} doesn't export a class!`);
				}
				const event = new File(this.client, name);
				if (!(event instanceof Event)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "));
					throw new TypeError(`Event ${name} doesn't belong in Events`);
				}
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
				console.log(`[${this.exactDate()}] Name: ${name}`.yellow);
			}
		});
	}

	async loadSlashCommands() {
		//TODO edit that to handle slash class
		console.log(`[${this.exactDate()}] Loading slash commands`.red);
		return glob(`${this.directory}slashs/**/*.js`).then(slashs => {
			for (const slashCommandFile of slashs) {
				delete require.cache[slashCommandFile];
				const { name } = path.parse(slashCommandFile);
				const File = require(slashCommandFile);
				if (!this.isClass(File)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "));
					throw new TypeError(`Slash command ${name} doesn't export a class!`);
				}
				const slash = new File(this.client, name);
				if (!(slash instanceof Slash)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "));
					throw new TypeError(`Slash command ${name} doesn't belong in Slashs`);
				}
				this.client.slash.set(slash.data.name, slash);
				// no aliases for slash commands
				console.log(`[${this.exactDate()}] Name: ${name}`.yellow);
			}
		});
	}

	async registerSlashCommands() {
		// get all slash commands
		const commandsGuild = [];
		const commandsGlobal = [];
		const commandsGuildSpecific = [];

		const commandKeys = Array.from(this.client.slash.keys());

		//TODO need to delete already existing slash commands

		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (const key of commandKeys) {
			const command = this.client.slash.get(key);
			if (command.isGlobal) commandsGlobal.push(command.data.toJSON());
			else if (command.guildSpecific.length == 0) commandsGuild.push(command.data.toJSON());
			else commandsGuildSpecific.push(command);
		}

		// Construct and prepare an instance of the REST module
		const rest = new REST({ version: '10' }).setToken(token);

		// and deploy your commands!
		return await (async () => {
			try {
				// The put method is used to fully refresh all commands in the guild with the current set
				console.log(`Started refreshing ${commandsGlobal.length} application (/) test commands.`);
				for (const guildId of testGuilds) {
					const dataTest = await rest.put(
						Routes.applicationGuildCommands(this.client.user.id, guildId),
						{ body: commandsGuild },
					);
					console.log(`Successfully reloaded ${dataTest.length} application (/) test commands.`);
				}

				console.log(`Started refreshing ${commandsGlobal.length} application (/) global commands.`);
				const dataGlobal = await rest.put(
					Routes.applicationCommands(this.client.user.id),
					{ body: commandsGlobal },
				);
				console.log(`Successfully reloaded ${dataGlobal.length} application (/) global commands.`);

				console.log(`Started refreshing ${commandsGlobal.length} application (/) specific commands.`);
				commandsGuildSpecific.forEach(async commandSpecific => {
					for (const guildId of commandSpecific.guildSpecific) {
						const dataSpecific = await rest.put(
							Routes.applicationGuildCommands(this.client.user.id, guildId),
							{ body: commandSpecific.data.toJSON() },
						);
						console.log(`Successfully reloaded ${dataSpecific.length} application (/) specific commands.`);
					}
				});

			} catch (error) {
				// And of course, make sure you catch and log any errors!
				console.error(error);
			}
		})();
	}

	async deleteSlashCommands() {
		//! May not be the best to delete and register at each restart, but ¯\_(ツ)_/¯

		// Construct and prepare an instance of the REST module
		const rest = new REST({ version: '10' }).setToken(token);
		// for guild-based commands
		rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands.'))
			.catch(console.error);

		// for global commands
		rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);
	}

	/**
	 * 
	 * @param {number} number 
	 * @param {number} CAV chiffre après virgule
	 * @returns 
	 */
	abbrNum(number, CAV) {
		// 2 decimal places => 100, 3 => 1000, etc
		CAV = Math.pow(10, CAV);

		// Enumerate number abbreviations
		var abbrev = ["k", "m", "b", "t"];

		// Go through the array backwards, so we do the largest first
		for (var i = abbrev.length - 1; i >= 0; i--) {

			// Convert array index to "1000", "1000000", etc
			var size = Math.pow(10, (i + 1) * 3);

			// If the number is bigger or equal do the abbreviation
			if (size <= number) {
				// Here, we multiply by CAV, round, and then divide by CAV.
				// This gives us nice rounding to a particular decimal place.
				number = Math.round(number * CAV / size) / CAV;

				// Handle special case where we round up to the next abbreviation
				if ((number == 1000) && (i < abbrev.length - 1)) {
					number = 1;
					i++;
				}

				// Add the letter for the abbreviation
				number += abbrev[i];

				// We are done... stop
				break;
			}
		}

		return number;
	}

	/**
	 * @param {Message} message 
	 * @return {boolean} success or not
	 */
	addGuildToDB(message) {
		const GID = message.guildId;
		const GuildDB = require("../Data/Guild.json");

		GuildDB[GID] = {
			prefix: ",,",
			lang: "EN",
			owner: message.guild.id,
			raid: false,
			lockdown: false,
			mute: {
				role: null,
				users: []
			},
			logging: {
				enable: false,
				channel: null,
				type: {
					AutoMod: false,
					MessageEdit: false,
					MessageRemove: false,
					ModCommandUsed: false,
					UserBan: false,
					UserEdit: false,
					UserJoin: false,
					UserKick: false,
					UserLeave: false,
					UserMuted: false,
					UserUnBan: false,
					UserUnMuted: false
				}
			},
			filter: {
				word: ["fuck", "bitch"],
				warn: false,
				enable: false,
				zalgo: false,
				cc: false,
				emojis: false,
				emojisNumber: 5,
				ignoredChannel: []
			},
			automod: {
				enable: false,
				user: [],
				rules: {}
			},
			admins: [],
			managers: [],
			mods: [],
			staff: [],
			tags: []
		};
		var that = this;
		fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildDB), function (err) {
			if (err) {
				that.debugMessage(err, "Inner");
				return false;
			}
		});
		return true;
	}

	/**
	 * 
	 * @param {Error} error 
	 * @param {"Command"|"Event"|"Inner"} type 
	 */
	debugMessage(error, type) {
		console.log(`${type} Error:`.red, `${error}`);
		this.client.debugChannel.forEach(channelId => {
			this.client.channels.fetch(channelId).then((channel, err) => {
				if (err) console.error(`${err}`.bgRed.black);
				channel.send(`**Error:**
				**Date: ${this.exactDate()}**
				**Type: ${type}**
				**Name: ${error.name}**
				**Trace: ${error.message}**
				**Stack:** ${error.stack}`).catch(err => { console.log(err); });
			});
		});
	}

	/**
	 * @param {Message} message 
	 * @return {boolean} success or not
	 */
	addUserToDB(message) {
		const ID = message.author.id;
		const User = require("../Data/User.json");

		User[ID] = {
			langue: "EN",
			color: "role",
			premium: false,
			mail: {
				mailSent: [],
				mailReceived: [],
				notif: {
					remind: false,
					totalNewMail: 0,
					notUserRemind: false,
					notUserTotalNewMail: 0
				},
				blockedUsers: [],
				whiteListUsers: [],
				allBlocked: false,
				status: "online"
			}
		};

		var that = this;
		fs.writeFile("./src/Data/User.json", JSON.stringify(User), function (err) {
			if (err) {
				that.debugMessage(err, "Inner");
				return false;
			}
		});
		return true;
	}

	/**
	 * @async
	 * @param {Message} message 
	 * @return {Promise<import('discord.js').ColorResolvable>}
	 */
	getClientColorInGuild(message) {
		return new Promise(async (resolve, reject) => {
			if (!message.guild) return resolve("Burple");
			await message.guild.members.fetch(this.client.user.id).then(r => {
				if (r) {
					return resolve(r.displayHexColor);
				}
			}).catch(r => {
				resolve("Burple");
			});
		});
	}

	/**
	 * Format a string in lower case, also removing every accent or ponctuation
	 * @param {string} string 
	 * @return {string} the formated string
	 * @source https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
	 */
	formatString(string) {
		string = string.toLowerCase();
		return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	}

	/**
	 * Async get url.
	 * @param {string} theUrl 
	 * @param {(response: XMLHttpRequest | null) => any} callback 
	 * @return {XMLHttpRequest}
	 * @source https://stackoverflow.com/questions/247483/http-get-request-in-javascript
	 */
	httpGetAsync(theUrl, callback) {
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				return callback(xmlHttp);
		};
		xmlHttp.open("GET", theUrl, true); // true for asynchronous 
		xmlHttp.send(null);
	}
	/**
	 * Sync get url.
	 * @param {string} theUrl 
	 * @return {XMLHttpRequest}
	 * @source https://stackoverflow.com/questions/247483/http-get-request-in-javascript
	 */
	httpGet(theUrl) {
		var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, false); // false for synchronous request
		xmlHttp.send(null);
		return xmlHttp;
	}
};
