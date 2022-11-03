
export { }

import { BaseInteraction, BitFieldResolvable, ChatInputCommandInteraction, Client, ColorResolvable, Message, PermissionsBitField, SlashCommandBuilder, Snowflake } from "discord.js";

import UserList from "../src/Data/User.json";

import MenuDocsClient from "../src/Structures/MenuDocsClient";
import Util from "../src/Structures/Util";
import Command from "../src/Structures/Command";
import Slash from "../src/Structures/Slash";

declare global {
    interface MenuDocsClient extends Client {
        commands: Map<string, Command>
        aliases: Map<string, string>
        events: Map<string, Event>
        slash: Map<string, Slash>
        utils: Util
        owners: Snowflake[]
        debugChannel: Snowflake[]
        defaultPerms: Readonly<PermissionsBitField>
    }

    type CommandOptions = {
        displayName: [string, string]
        aliases: string[]
        description: [string, string] | ["No description provided.", "Pas de description donnée."]
        category: [string, string] | ["General", "Général"]
        usage: [string, string] | ["No usage provided.", "Pas d'utilisation précisée."]
        userPerms: BitFieldResolvable
        botPerms: BitFieldResolvable
        guildOnly: boolean
        ownerOnly: boolean
        nsfw: boolean
        args: boolean
        guildOwnerOnly: boolean
        adminOnly: boolean
        managerOnly: boolean
        modOnly: boolean
        staffOnly: boolean
        cooldown: number
        guildWhiteList: Snowflake[]
        slash: boolean
    }

    class Command {
        constructor(client: MenuDocsClient, name: string, options: CommandOptions): {
            client: MenuDocsClient;
            name: string;
            displayName: [string, string]
            aliases: string[]
            description: [string, string] | ["No description provided.", "Pas de description donnée."]
            category: [string, string] | ["General", "Général"]
            usage: [string, string] | ["No usage provided.", "Pas d'utilisation précisée."]
            userPerms: BitFieldResolvable
            botPerms: BitFieldResolvable
            guildOnly: boolean
            ownerOnly: boolean
            nsfw: boolean
            args: boolean
            guildOwnerOnly: boolean
            adminOnly: boolean
            managerOnly: boolean
            modOnly: boolean
            staffOnly: boolean
            cooldown: number
            guildWhiteList: Snowflake[]
            slash: boolean

            closed: false
            reason: string | null
            openTime: 0
            error: Error[]
        }
        run(message: Message, ...args: any): any | void
    }

    type SlashCommand = {
        execute(client: MenuDocsClient, interaction: ChatInputCommandInteraction, ...args: any)
        data: SlashCommandBuilder
        isGlobal: boolean
        guildSpecific: Snowflake[]
    }

    class Slash {
        constructor(client: MenuDocsClient, name: string, options: CommandOptions): {
            client: MenuDocsClient
            name: string
            data: SlashCommandBuilder
            isGlobal: boolean
            guildSpecific: Snowflake[]

            userPerms: BitFieldResolvable
            botPerms: BitFieldResolvable
            guildOwnerOnly: boolean
            adminOnly: boolean
            managerOnly: boolean
            modOnly: boolean
            staffOnly: boolean

            nsfw: boolean
            cooldown: number

            // for the help menu only
            displayName: [string, string]
            description: [string, string] | ["No description provided.", "Pas de description donnée."];
            category: [string, string] | ["General", "Général"];
            usage: [string, string] | ["No usage provided.", "Pas d'utilisation précisée."];
        }
        async execute(interaction: ChatInputCommandInteraction, ...args: any): any | void
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
        datasetid: "arrets-lignes",
        recordid: string,
        fields: {
            pointgeo: [number, number],
            stop_id: string,
            stop_name: string,
            operatorname: string,
            nom_commune: string,
            /** Number in a string */
            route_long_name: string,
            id: string,
            /** Number in a string */
            stop_lat: string,
            /** Number in a string */
            stop_lon: string,
            /** Number in a string */
            code_insee: string
        }, geometry: {
            type: "Point",
            coordinates: [number, number]
        }
    }

    type TrainStopMinifyV1 = {
        stop_name: string,
        operatorname: string,
        nom_commune: string,
        route_long_name: string
    }

    type TrainStopMinifyV2 = {
        [stop_name: string]: {
            stop_name: string,
            operatorname: string[],
            nom_commune: string[],
            route_long_name: string[]
        }
    }

    type LineStopMinifyV1 = {
        [route_long_name: string]: {
            stop_name: string[],
            operatorname: string[],
            nom_commune: string[],
            route_long_name: string
        }
    }

    /**
     * @author {Pierre Grimaud}
     * @source https://github.com/pgrimaud/horaires-ratp-api
     */
    type RATP_API_TRAFFIC = {
        result: {
            metros: {
                line: string,
                slug: "normal" | "normal_trav" | "alerte",
                title: string,
                message: string
            }[],
            rers: {
                line: string,
                slug: "normal" | "normal_trav" | "alerte",
                title: string,
                message: string
            }[],
            tramways: {
                line: string,
                slug: "normal" | "normal_trav" | "alerte",
                title: string,
                message: string
            }[]
        },
        _metadata: {
            call: "GET /traffic",
            date: Date,
            version: number
        }
    }
}
