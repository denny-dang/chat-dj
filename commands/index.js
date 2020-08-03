const skip = require("./skip.js");
const stop = require("./stop.js");
const play = require("./play.js");
const queue = require("./queue.js");
const current = require("./current.js");
const help = require("./help.js");

module.exports = {
    play: play,
    current: current,
    skip: skip,
    stop: stop,
    queue: queue,
    help: help,
}