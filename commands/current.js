module.exports = {
    name: "current",
    description: "displays the current song and its info",
    action: (message, serverQueue) => {
        if (!message.member.voice.channel)
            return message.channel.send(
                "Join the voice channel to see what song is playing!"
            );
        const song = serverQueue.currentSong;
        if (!song) return message.channel.send("There is no song playing!");
        return message.channel.send(
            `**${song.title}** is currently playing!\nSong requested by **${song.requestor}**!\nSong URL: ${song.url}`
        );
    },
};
