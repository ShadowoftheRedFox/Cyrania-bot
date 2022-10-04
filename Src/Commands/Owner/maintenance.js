const mtnce = require("../../Data/Maintenance.json");
const fs = require("fs");
const Command = require('../../Structures/Command');
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            description: 'Enable or disable the maintenance mode.',
            category: 'Owner',
            usage: "<on | off>",
            aliases: ["mtnce", "mtn"],
            ownerOnly: true,
            categoryFR: "Propriétaire",
            descriptionFR: "Active ou désactive le mode maintenance."
        });
    }
    async run(message) {
        const args = message.content.split(' ')
        let maintenance_mode = mtnce.maintenance
        if (!args[1]) return message.reply("Lequel? on/off/cc/ccc/dbclear")
        if (args[1] === "on" && maintenance_mode === 0) {
            mtnce.maintenance = 1
            fs.writeFile("./src/Data/Maintenance.json", JSON.stringify(mtnce, mtnce, 3), function (err) {
                if (err) console.log(err)
            })
            return message.reply("Le mode maintenance est maintenant activé.")
        }
        if (args[1] === "off" && maintenance_mode === 1) {
            mtnce.maintenance = 0
            fs.writeFile("./src/Data/Maintenance.json", JSON.stringify(mtnce, mtnce, 3), function (err) {
                if (err) console.log(err)
            })
            return message.reply("Le mode maintenance est maintenant desactivé.")
        }
        if (args[1] === "on" && maintenance_mode === 1) return message.reply("Le mode maintenance est déjà activé.")
        if (args[1] === "off" && maintenance_mode === 0) return message.reply("Le mode maintenance est déjà desactivé.")

        let closedCommand = require("../../Data/closedCommand.json");
        if (args[1] === "cc") {
            message.reply("I sended the data in your console.")
            return console.log(closedCommand)
        }
        if (args[1] === "clearCC" || args[1] === "ccc") {
            if (closedCommand[args[2]]) {
                delete closedCommand[args[2]]
                message.channel.send(`Cleared closed command ${args[2]}`)
            } else {
                closedCommand = {}
                message.channel.send("Cleared ClosedCommand")
            }
            fs.writeFile("./src/Data/closedCommand.json", JSON.stringify(closedCommand, closedCommand, 3), function (err) {
                if (err) console.log(err)
            })
            return
        }
        if (args[1] === "dbclear") {
            const db = null; //TODO replace with my own library
            try {
                const tab = db.all()
                tab.forEach(element => {
                    console.log(element)
                    const { ID } = element
                    console.log(ID)
                    db.delete(ID)
                })
            } catch (e) { console.error(e) }
            db.all()
            return message.reply("Check my console!")
        }
    }
};