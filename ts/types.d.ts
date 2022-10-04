export { }

import { Client, Snowflake } from "discord.js"
import MenuDocsClient from "../src/Structures/MenuDocsClient"
import Util from "../src/Structures/Util"
import Command from "../src/Structures/Command"

declare global {
    interface MenuDocsClient extends Client {
        commands: Collection<string, Command>
        aliases: Collection<string, string>
        events: Collection<string, Event>
        utils: Util
        owners: Snowflake[]
        debugChannel: Snowflake[]
    }
}
