import { CommandoClient } from "discord.js-commando"
import { Message } from "discord.js"

const client = new CommandoClient({
    commandPrefix: ".nick"
})

client.on("ready", () => {
    console.log(`Ready as ${client.user?.tag}`)
})

client.on("message", (msg: Message) => {
    console.log(msg.content);
})


client.login("");