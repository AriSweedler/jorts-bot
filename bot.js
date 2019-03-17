var HTTPS = require('https');
const known_sender_ids = {};
const people_listeners = [
  require('./listener/kenny'),
  require('./listener/alan')
];

/* callback to respond to all POST requests (GroupMe messages send POSTS
 * requests to the bot) */
function respond() {
  /* get the message data from the raw HTTP request */
  var message = JSON.parse(this.req.chunks[0]);

  /* If the message was sent by the bot, don't do anything (don't even log it) */
  if (String(message.sender_id) == process.env.MY_ID) {
    return;
  }

  /* Log the name and sender_id of the message */
  console.log(`We have a message from ${message.name}. (sender ID = ${message.sender_id}): ${message.text}`);
  if (!(message.name in known_sender_ids)) {
    known_sender_ids[message.name] = message.sender_id;
  }

  /* Send the message through each "require"d module's "listener" callback */
  people_listeners.map(person => person.listener(message));

  /* We don't send an HTTP response to the request at all, as our listener callbacks will handle responses. */
  this.res.end();
}

/* when GET requested, describe what you do */
const known_ids = {
  ...process.env,
  "BOT_ID": "redacted"
}
function describe() {
  console.log(`Someone asked me to describe myself.`);
  this.res.writeHead(200);
  this.res.end(`
Our callbacks: ${people_listeners.map(person => person.name).join(', ')}.
newly learned sender ids:
${JSON.stringify(known_sender_ids, null, '\t')}

already known sender ids:
${JSON.stringify(known_ids, null, '\t')}
  `);
}

function postMessage(botResponse) {
  const options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  const body = {
    "bot_id" : process.env.BOT_ID,
    "text" : botResponse
  };

  console.log(`sending ~${botResponse}~ to ${process.env.BOT_ID}`);

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