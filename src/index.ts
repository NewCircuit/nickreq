import { CommandoClient } from "discord.js-commando"

const client = new CommandoClient({
    commandPrefix: ".nick"
})

client.on("ready", () => {
    console.log(`Ready as ${client.user?.tag}`)
})

client.login("");