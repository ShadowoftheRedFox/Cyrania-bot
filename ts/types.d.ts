export { }

import { Client, ColorResolvable, Message, Snowflake } from "discord.js"
import MenuDocsClient from "../src/Structures/MenuDocsClient"
import Util from "../src/Structures/Util"
import Command from "../src/Structures/Command"
import UserList from "../src/Data/User.json"

declare global {
    interface MenuDocsClient extends Client {
        commands: Map<string, Command>
        aliases: Map<string, string>
        events: Map<string, Event>
        utils: Util
        owners: Snowflake[]
        debugChannel: Snowflake[]
    }

    class Command {
        run(message: Message, ...args: any)
    }

    type UserList = {
        [ID: Snowflake | string]: {
            langue: "EN" | "FR",
            color: "role" | ColorResolvable,
            premium: boolean,
            mail: {
                mailSent: [],
                mailReceived: [],
                notif: {
                    remind: boolean,
                    totalNewMail: 0,
                    notUserRemind: boolean,
                    notUserTotalNewMail: number
                },
                blockedUsers: Snowflake[],
                whiteListUsers: Snowflake[],
                allBlocked: boolean,
                status: "online" | "dnd" | "urgent"
            }
        }
    }

    type TrainStop = {
        "datasetid": "arrets-lignes",
        "recordid": string,
        "fields": {
            "pointgeo": [number, number],
            "stop_id": string,
            "stop_name": string,
            "operatorname": string,
            "nom_commune": string,
            /** Number in a string */
            "route_long_name": string,
            "id": string,
            /** Number in a string */
            "stop_lat": string,
            /** Number in a string */
            "stop_lon": string,
            /** Number in a string */
            "code_insee": string
        }, "geometry": {
            "type": "Point",
            "coordinates": [number, number]
        }
    }

    type TrainStopMinifyV1 = {
        "stop_name": string,
        "operatorname": string,
        "nom_commune": string,
        "route_long_name": string
    }

    type TrainStopMinifyV2 = {
        [stop_name: string]: {
            "stop_name": string,
            "operatorname": string[],
            "nom_commune": string[],
            "route_long_name": string[]
        }
    }
}
