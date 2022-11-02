const roles = args.concat(sub2);
let alreadyIn = [];
let toAdd = [];
let names = ["staff", "staff"];
switch (sub1) {
    case "add":
    case "ajout": {
        if (!existRole(roles)) {
            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra comme ${names[1]}.`);
            else return message.channel.send(`Please tag or type the id of a role you want to be considered as ${names[0]} by the bot.`);
        }
        //we now know that at least a role is present
        //go through all of them to check if there are duplicates
        roles.forEach((role, i) => {
            let r = message.mentions.roles.at(i) || message.guild.roles.cache.get(role) || message.guild.roles.cache.find(ch => ch.id.includes(role));
            if (r) {
                if (GuildList[ID].staff.includes(r.id)) alreadyIn.push(r.id);
                else toAdd.push(r.id);
            }
        });
        if (alreadyIn.length == 1) {
            if (User.langue === "FR") return message.channel.send(`Le rôle <@${alreadyIn[0]}> est déjà considéré comme ${names[1]}.`);
            else return message.channel.send(`The role <@${alreadyIn[0]}> is already considered as ${names[0]}.`);
        } else if (alreadyIn.length > 1) {
            if (User.langue === "FR") return message.channel.send(`<@${alreadyIn.join(">, <@")}> sont déjà considérés comme ${names[1]}s.`);
            else return message.channel.send(`<@${alreadyIn.join(" >, <@")}> are already considered as ${names[0]}s.`);
        }

        GuildList[GID].staff = GuildList[GID].staff.concat(toAdd);
        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
            if (err) console.log(err);
        });

        if (toAdd.length == 1) {
            if (User.langue === "FR") return message.channel.send(`Le rôle <@${toAdd[0]}> est désormais considéré comme ${names[1]}.`);
            else return message.channel.send(`The role <@${toAdd[0]}> is now considered as ${names[0]}.`);
        } else if (toAdd.length > 1) {
            if (User.langue === "FR") return message.channel.send(`<@${toAdd.join(">, <@")}> sont désormais considérés comme ${names[1]}s.`);
            else return message.channel.send(`<@${toAdd.join(" >, <@")}> are now considered as ${names[0]}s.`);
        }
        break;
    }
    case "remove":
    case "enlever": {
        if (!role) {
            if (User.langue === "FR") return message.channel.send(`Veuillez mentionnez un rôle ou mettre un ID que le bot considéra pas comme ${names[1]}.`);
            else return message.channel.send(`Please tag or type the id of a role you want to not be considered as ${names[0]} by the bot.`);
        }

        console.log(`Before: ${GuildList[GID].staff}`);
        const index = GuildList[GID].staff.indexOf(role.id);
        if (index > -1) {
            GuildList[GID].staff.splice(index, 1);
            console.log(`After: ${GuildList[GID].staff}`);
        } else {
            if (User.langue === "FR") return message.channel.send(`Ce rôle n'est déjà pas considéré comme ${names[1]} par le bot.`);
            else return message.channel.send(`This role is already not considered as a ${names[0]} role by the bot.`);
        }
        fs.writeFile("./src/Data/Guild.json", JSON.stringify(GuildList, GuildList, 3), function (err) {
            if (err) console.log(err);
        });
        if (User.langue === "FR") return message.channel.send(`Ce rôle n'est plus considéré comme ${names[1]} par le bot.`);
        else return message.channel.send(`This role is no longer considered ${names[0]} by the bot.`);
        break;
    }
    default: {
        if (User.langue == "FR") message.reply(`Que voulez vous faire? \`${ThisServerPrefix}setup staff <ajout/enlever> <role> [roles]\``);
        else message.reply(`What do you want to do? \`${ThisServerPrefix}setup staff <add/remove> <role> [roles]\``);
    }
}