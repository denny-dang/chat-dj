module.exports = {
    name: 'queue',
    description: 'displays all songs in queue',
    action: (message, serverQueue) => {
        if (!message.member.voice.channel)
            return message.channel.send(
                "Join the voice channel to view the song queue!"
            );
        if (!serverQueue.songs.length)
            return message.channel.send("The song queue is empty!");
        let queueString = `Songs in the queue:\n\n`;

        for (let i = 1; i <= serverQueue.songs.length; i++) {
            let song = serverQueue.songs[i - 1];
            queueString += `${i.toString()}. **${song.title}** requested by **${song.requestor}**\n`
        }
        return message.channel.send(queueString);
    }
}