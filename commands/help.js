const commands = require('./util/helpUtil.js');
const { prefix } = require("../config.json");

module.exports = {
    name: 'help',
    description: 'show all possible commands and their functionality',
    action: (message, serverQueue) => {
        let helpString = `Commands that can be run:\n\n`;
        for (let command of Object.keys(commands)) {
            helpString += `**${prefix}${commands[command].name}** - ${commands[command].description}\n`
        }
        helpString += `**${prefix}help** - show all possible commands and their functionality\n`
        return message.channel.send(helpString);
    }
}