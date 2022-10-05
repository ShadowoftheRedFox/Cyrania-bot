# If you cloned this repository:
================================

First, run in a command prompt, and choose the directory to be [this folder](./), then run `npm update` to download all the required dependencies. Make sure to have discord.js installed.

You will need a **ConfigFile.json** in [this folder (mainFolder/src/Data)](./src/Data/), that need to fill this requirements:
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