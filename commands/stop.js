module.exports = {
    name: 'stop',
    description: 'stops the current song and shuts down the Chat DJ',
    action: (message, serverQueue) => {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "Join the voice channel to stop the music!"
            );
        }
        if (!serverQueue.connection) {
            return message.channel.send(
                "I am not playing at the moment!"
            );
        }
        serverQueue.songs = [];
        serverQueue.currentSong = null;
        serverQueue.connection.dispatcher.end();
    }
}