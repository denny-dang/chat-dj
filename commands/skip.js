module.exports = {
    name: 'skip',
    description: 'skips the current song',
    action: (message, serverQueue) => {
        if (!message.member.voice.channel)
            return message.channel.send(
                "Join the voice channel to skip music!"
            );
        if (!serverQueue.songs.length)
            return message.channel.send("There is no song to be skipped!");
        serverQueue.connection.dispatcher.end();
    }
}