const bot = require('../bot.js');

/* logic specific to Ari goes here. All that we will do is say "hi ari" when a message comes. */
function listener(message) {
  if (message.sender_id != process.env.ARI_ID) {
    return;
  }

  console.log(`[Ari.js] message from ari. It says ~${message.text}~`);
  bot.postMessage("Hi, ari");
}

exports.listener = listener;
exports.name = 'ari';