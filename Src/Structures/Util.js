const save = require("../../Save.json")
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const Command = require('./Command');
const Event = require('./Event.js');
var colors = require("colors")
const fs = require("fs")

module.exports = class Util {

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
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
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
		return (date + ' ' + time).toString()
	}

	async loadCommands() {
		console.log(`[${this.exactDate()}] Loading commands`.red)
		return glob(`${this.directory}commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "))
					throw new TypeError(`Command ${name} doesn't export a class.`);
				}
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "))
					throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`);
				}
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						if (this.client.aliases.get(alias)) throw new SyntaxError(`Command ${command.name} have an already used aliases (${alias}) as ${this.client.aliases.get(alias)}!`)
						this.client.aliases.set(alias, command.name);
					}
				}
				console.log(`[${this.exactDate()}] Name: ${name}`.yellow)
			}
		});
	}

	async loadEvents() {
		console.log(`[${this.exactDate()}] Loading events`.red)
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "))
					throw new TypeError(`Event ${name} doesn't export a class!`);
				}
				const event = new File(this.client, name);
				if (!(event instanceof Event)) {
					console.log([
						`[${this.exactDate()}]`.red,
						"ERROR".bgRed.black
					].join(" "))
					throw new TypeError(`Event ${name} doesn't belong in Events`);
				}
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
				console.log(`[${this.exactDate()}] Name: ${name}`.yellow)
			}
		});
	}

	async loadDataBase() {
		console.log(`[${this.exactDate()}] Loading databases`.red)
		return glob(`${this.directory}Data/**/*.json`).then(db => {
			for (var dataFile of db) {
				delete require.cache[dataFile];
				const { name } = path.parse(dataFile);
				try {
					var File = require(dataFile);
				} catch (e) {
					const dataEmited = { database: name, oldDataTime: save[name].time }
					if (save[name]) {
						console.log(["WARNING".bgYellow.black, ` Rolled back ${name} database from it old version from ${save[name].time}.`.magenta].join(""))
						/*
						this.client.emit("databaseRollback", dataEmited)
						*/
						dataFile = save[name].data

						fs.writeFile(`./Src/Data/${name}.json`, JSON.stringify(dataFile, 3), function (err) {
							if (err) console.log(err)
						})

					} else {
						console.log([
							`[${this.exactDate()}]`.red,
							"ERROR".bgRed.black,
							name.red
						].join(" "))
						throw new TypeError(`Database ${name} doesn't export a database!`);
					}
				}
				if (File && !save[name] && name != "Save") {
					save[name] = { data: File, time: this.exactDate() }
					fs.writeFile("./Save.json", JSON.stringify(save, save, 3), function (err) {
						if (err) console.log(err)
					})
				}
				console.log(`[${this.exactDate()}] Name: ${name}`.yellow)
			}
		});
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

};
