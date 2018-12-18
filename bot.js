var HTTPS = require('https');

const botID = process.env.BOT_ID;
const kennyID = process.env.KENNY_ID;

/* callback to respond to all GroupMe messages */
function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  console.log();
  console.log(`We have a message from ${request.name} (sender ID = ${request.sender_id})`);
  console.log(`The message: ${request.text}`);

  /* If there's a request, and it matches the specified regex, then... */
  if(String(request.sender_id) === kennyID) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

/* when GET requested, describe what you do */
function describe() {
  this.res.writeHead(200);
  botReq.end(`
Whenever Kenneth Nicholson (sender_id == ${kennyID}) sends a message, respond with
'like this message to dislike kenny’s message'

This could do other stuff, too. But for now, it doesn't.
  `);
}

function postMessage() {
  const options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  const botResponse = "like this message to dislike kenny’s message";
  const body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ~' + botResponse + '~ to ' + botID);

  const botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat, no error
      } else {
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

exports.respond = respond;
exports.describe = describe;