# If you cloned this repository:

First, run in a command prompt, and choose the directory to be [this folder](./), then run `npm update` to download all the required dependencies. Make sure to have discord.js installed.

You will need a **Config.json** in [this folder (mainFolder/src/Data)](./src/Data/), that need to fill this requirements:
```json
{
    "token": "YOUR BOT TOKEN HERE",
    "owners": [
        "YOUR ID HERE"
    ],
    "defaultPerms": [
        "PermissionFlagsBits FLAGS"
    ],
    "defaultPermsBot": [
        "PermissionFlagsBits FLAGS"
    ],
    "debugChannel": [
        "ID OF A CHANNEL HERE"
    ]
}
```

1. token: the token of your bot. **Keep this private!**
2. owners: your id. You can add more owners, but they will access owner only commands, that can be sensitiv.
3. defaultPerms: a list of PermissionFlagsBits that match the minimum permissions required by a user to use the bot.
4. defaultPermsBot: a list of PermissionFlagsBits that match the minimum amount of permissions needed for the bot to properly run.
5. debugChannel: the id of a channel where errors will be sent. If none is provided, it's fine. Errors can also be found in the console.

---------------------

# Commands

Commands should only be in [this folder](./src/Commands/), and export the command class. It's required because on the start of the bot, he happend all command to its client, and look into all files inside the folder.

---------------------

# Event

Same goes for events, they should only be inside [this folder](./src/Events/), and export the event class.


---------------------

# Slash commands

Not yet implemented but coming soon.

---------------------

# Other

Other file will be created under [the Data folder](./src/Data/), such as `User.json`, `Guild.json` and `Maintenance.json`. IF you encounter any problem with this, create them yourself, with an empty object inside them: `{}`. If the issue is still here, create an issue on the repository.

---------------------

# Quick.db

I encountered a lot of depencies problem with it. If at any moment you encounter a problem, check out [their website](https://www.npmjs.com/package/quick.db) and look for the [TroubleShooting](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/troubleshooting.md).

---------------------