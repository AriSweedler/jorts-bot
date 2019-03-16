const bot = require('../bot.js');







function listener(message) {
  console.log(`in the body of kenny listener`);
  bot.postMessage('Yo do I hear kenny?');
}

exports.listener = listener;