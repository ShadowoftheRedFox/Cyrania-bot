const Event = require('../Structures/Event');
const { version } = require("../../package.json");
const { ActivityType } = require('discord.js');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}

	async run() {

		await this.client.utils.registerSlashCommands();

		console.log([
			`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`,
			`Logged in as ${this.client.user.tag}`,
			`Version: v${version}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.slash.size} slashs!`,
			`Loaded ${this.client.events.size} events!`,
			`On ${this.client.guilds.cache.size} warzones!`,
			`Watching ${this.client.channels.cache.size} battlefields!`,
			`Dominating ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} warriors!`,
			`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`

		].join('\n'));

		const activities = [
			`${this.client.utils.abbrNum(this.client.guilds.cache.size, 1)} servers!`,
			"Why do you read this?",
			`${this.client.utils.abbrNum(this.client.channels.cache.size, 1)} channels!`,
			"Big sister of Kyrazaïl!",
			`${this.client.utils.abbrNum(this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0), 1)} users!`,
			"Look through your mails... 👀"
		];

		let i = 0;
		setInterval(() => this.client.user.setActivity({ name: `,,help | ${activities[i++ % activities.length]}`, type: ActivityType.Watching }), 60000);

		console.log("Online and fighting for her life.");
	}

};
