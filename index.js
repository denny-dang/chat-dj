const Discord = require("discord.js");
const commands = require("./commands/index.js");
const { prefix } = require("./data.json");
const client = new Discord.Client();

const chatDJMap = new Map();

client.once("ready", () => {
    console.log("Chat DJ is ready!");
});

client.on("message", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    /*
    We set up our DJMap to have appropriate information about 
    the server and channels we're connecting to.

    Our botData is unique per Guild ID.
    */
    if (!chatDJMap.get(message.guild.id)) {
        const botData = {
            textChannel: message.channel,
            voiceChannel: null,
            connection: null,
            songs: [],
            currentSong: null,
            volume: 5,
        };
        chatDJMap.set(message.guild.id, botData);
    }
    const serverQueue = chatDJMap.get(message.guild.id);

    /*
    Parse our command line arguments and check if it matches a valid command.
    */
    const args = message.content.split(" ");
    if (args[0].startsWith(`${prefix}`)) {
        const commandName = args[0].substring(1);
        if (Object.keys(commands).includes(commandName)) {
            commands[commandName].action(message, serverQueue);
            return;
        } else {
            message.channel.send(
                "You need to enter a valid command! Enter !help to list all valid commands."
            );
        }
    }
});

client.login(process.env.BOT_TOKEN);
