const bot = require('./bot.js');

const kenny_listener = (message) => {
  console.log(`in the body of kenny listener`);
  bot.postMessage('Yo do I hear kenny?');
}

export default kenny_listener;