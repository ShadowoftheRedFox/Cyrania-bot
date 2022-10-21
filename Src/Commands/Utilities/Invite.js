const Command = require('../../Structures/Command');
const UserList = require("../../Data/User.json");

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: ['This gives an invitation to the bot support server.', "Donne un lien pour aller sur mon serveur officiel!"],
			category: ['Utilities', "Utilité"],
			displayName: ["Invite", "Invitation"]
		});
	}
	async run(message) {
		if (UserList[message.author.id].language == "FR") message.channel.send('Vous voulez en savoir plus sur moi? Voulez m\'aider dans mon développement?\n**Venez ici:** https://discord.gg/FVwnFP38P6');
		else message.channel.send('Want to know more about me? Want to help me to become better?\n**Come here:** https://discord.gg/FVwnFP38P6');
	}

};
