const ytdl = require("ytdl-core");

const YouTube = require("discord-youtube-api");
const youtube = new YouTube(process.env.YT_TOKEN);

module.exports = {
    name: "play",
    description:
        "plays given song or adds to song queue if one is already playing",
    action: async (message, serverQueue) => {
        const playHelper = (serverQueue) => {
            const song = serverQueue.songs[0];
            if (!song) {
                serverQueue.voiceChannel.leave();
                serverQueue.currentSong = null;
                return message.channel.send(
                    "I left the voice chat. Play a song to add me back!"
                );
            }
            serverQueue.currentSong = song;
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    playHelper(serverQueue);
                })
                .on("error", (error) => {
                    console.error(error);
                });
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(
                `**${song.title}** has started playing!\nSong URL: ${song.url}`
            );
        };

        const index = message.content.indexOf(" ");
        if (index <= 0) {
            return message.channel.send(
                "Please enter a valid URL or search query."
            );
        }
        const args = message.content.substr(index + 1);
        let URL = null;
        if (args.includes(".com/")) {
            URL = args;
        } else {
            try {
                URL = (await youtube.searchVideos(args)).url;
            } catch (error) {
                return message.channel.send(error);
            }
        }
        serverQueue.voiceChannel = message.member.voice.channel;
        if (!serverQueue.voiceChannel)
            return message.channel.send(
                "Join the voice channel to play music!"
            );
        const permissions = serverQueue.voiceChannel.permissionsFor(
            message.client.user
        );
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "I need permission to join and speak in your voice channel to work!"
            );
        }
        let validate = await ytdl.validateURL(URL);
        if (!validate)
            return message.channel.send(
                "This URL doesn't seem to be valid. Please try again with a valid YouTube URL."
            );
        let songInfo = null;
        try {
            songInfo = await ytdl.getInfo(URL);
        } catch (error) {
            return message.channel.send(error);
        }
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            requestor: message.member.user.username,
        };

        if (!serverQueue.songs.length) {
            serverQueue.songs.push(song);
            try {
                serverQueue.connection = await serverQueue.voiceChannel.join();
                playHelper(serverQueue);
            } catch (error) {
                console.log(error);
                return message.channel.send(error);
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(
                `**${song.title}** has been added to the queue!`
            );
        }
    },
};
