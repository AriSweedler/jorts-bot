const kenny = require('./listener/kenny');
const alan = require('./listener/alan');
var HTTPS = require('https');

let msgs = 0;

/* callback to respond to all POST requests (GroupMe messages send POSTS
 * requests to the bot */
function respond() {
  console.log(`Someone sent me a message`);
  if (msgs >= 10) return;
  msgs++;

  /* get the message data from the raw HTTP request */
  var message = JSON.parse(this.req.chunks[0]);
  console.log(`We have a message from ${message.name}`);
  console.log(`\t(sender ID = ${message.sender_id}): ${message.text}`);

  /* don't respond to the bot's message */
  if (String(message.sender_id) == process.env.MY_ID) {
    return;
  }

  /* Send the message through each callback */
  kenny.listener(message);
  alan.listener(message);

  //TODO log this into an in-memory database or something if it isn't already
  console.log(`User by the name of ${message.name} has id ${message.sender_id}`);

  /* We don't respond to the request at all, because we just have to send a POST request */
  this.res.end();
}

/* when GET requested, describe what you do */
function describe() {
  console.log(`Someone asked me to describe myself.`);
  this.res.writeHead(200);
  this.res.end(`
kenny.listener;
alan.listener;
TODO STRINGIFY the {message.name --> sender_id} dictionary
  `);
}

function postMessage(botResponse) {
  const options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  const body = {
    "bot_id" : process.env.botID,
    "text" : botResponse
  };

  console.log('sending ~' + botResponse + '~ to ' + process.env.botID);

  const botReq = HTTPS.request(options, function(res) {
    if (res.statusCode != 202) {
      console.log('rejecting bad status code ' + res.statusCode);
    }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });

  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });

  botReq.end(JSON.stringify(body));
}

exports.postMessage = postMessage;
exports.respond = respond;
exports.describe = describe;