const bot = require('../bot.js');

let state = 'start';

function listener(message) {
  //TODO enter the callback corresponding to what state we're in
  console.log(`[Alan.js] message from alan. It says ~${message.text}~`);

  bot.postMessage("ALAN'S STUFF IS TODO");
}

exports.listener = listener;
exports.name = 'alan';