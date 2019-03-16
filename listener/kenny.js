const bot = require('../bot.js');

function listener(message) {
  if (message.sender_id != process.env.KENNY_ID) {
    return;
  }

  console.log(`[Kenny.js] message from kenny. It says ~${message.text}~`);
  bot.postMessage("Like this message to dislike Kenny's message");
}

exports.listener = listener;
exports.name = 'kenny';