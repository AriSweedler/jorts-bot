const bot = require('../bot.js');

function listener(message) {
  if (message.sender_id == process.env.ARI_ID) {
    console.log(`[Ari.js] message from ari. It says ${message.text}}`);
    console.log(JSON.stringify(message));
    console.log(`[Ari.js] end`);
    bot.postMessage("Hi, ari");
  }
}

exports.listener = listener;