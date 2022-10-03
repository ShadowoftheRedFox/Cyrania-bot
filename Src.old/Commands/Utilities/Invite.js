const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'This gives an invitation to the bot support server.',
			category: 'Utilities',
			categoryFR: "Utilité",
			descriptionFR:"Donne un lien pour aller sur mon serveur officiel!"
		});
	}
	async run(message) {
		message.channel.send('Want to know more about me? Want to help me to become better?\nVous voulez en savoir plus sur moi? Voulez m\'aider dans mon développement?\n**Come here/Venez ici:** https://discord.gg/FVwnFP38P6');
	};

};
