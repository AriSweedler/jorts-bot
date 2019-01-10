var HTTPS = require('https');

const botID = process.env.BOT_ID;

/* callback to respond to all GroupMe messages */
function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  console.log(`We have a message from ${request.name} (sender ID = ${request.sender_id}): ${request.text}`);

  /* If there's a request, and it matches the specified regex, then... */
  this.res.writeHead(200);
  const sender_id = String(request.sender_id);

  /* don't respond to the bot's message */
  if (sender_id == process.env.MY_ID || request.text.includes("said")) {
    return;
  }

  console.log(`What u said: ${request.text}. Did that have a ';' in it? ${request.text.includes(";")}.`);
  if (request.text.includes(";")) {
    postMessage(`Someone said ';'`);
  }

  if (sender_id == process.env.KENNY_ID && request.text.includes("🖤")) {
    postMessage(`like this message to dislike kenny’s message`);
  }
  else if (sender_id == process.env.JONATHAN_SCHULTZ_ID) postMessage(`do your house jobs you geeds`);
  else if (sender_id == process.env.CLAYTON_HO_ID) postMessage(`Oy. You soft CUNTS.`);
  else {
    console.log(`User by the name of ${request.name} has id ${sender_id}`);
  }
  this.res.end();
}

/* when GET requested, describe what you do */
function describe() {
  this.res.writeHead(200);
  this.res.end(`
Respond to specific users with a message.

Kenneth Nicholson (${process.env.KENNY_ID}): 'like this message to dislike kenny’s message'
Jonathan Schulz (${process.env.JONATHAN_SCHULTZ_ID}): 'do your house jobs you geeds'
Clayton Ho (${process.env.CLAYTON_HO_ID}): 'Oy. You soft CUNTS'
//Ari Sweedler (${process.env.ARI_ID}): '... dad?'
Christian Garcia (${process.env.CHRISTIAN_GARCIA_ID}): 'TODO'

This could do other stuff, too. But for now, it doesn't.
  `);
}

function postMessage(botResponse) {
  const options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  const body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ~' + botResponse + '~ to ' + botID);

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

exports.respond = respond;
exports.describe = describe;