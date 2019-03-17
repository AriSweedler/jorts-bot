const bot = require('../bot.js');

const global = {
  target_id: process.env.Alan_Zisman_ID,
  message: null,
  timeout_ms:  process.env.timeout_ms || (20*1000)
}

let numMessages = 0;
let translation = '';

function listener(message) {
  global.msg = message;

  if (global.msg.sender_id === global.target_id) {
    targetMessage_callback();
    beginTimeout();
  } else {
    nonTargetMessage_callback();
    return;
  }

  console.log(`[Alan.js] processed message`);
}

const append = (text) => {
  if (numMessages === 1) {
    translation = text;
  } else {
    let lastChar = translation.slice(-1);
    let joiner = ', ';
    if ('.,!?'.includes(lastChar)) {
      joiner = ' ';
    }
    translation += joiner + text;
  }
}

const targetMessage_callback = () => {
  numMessages++;
  append(global.msg.text);

  if (numMessages === 1) {
    console.log(`[Alan.js] message from target's id. It says ~${global.msg.text}~ Transitioning from start to waiting`);
  }
  else if (numMessages === 2) {
    console.log(`[Alan.js] Another message from target's id. It says ~${global.msg.text}~ Transitioning from waiting to ready`);
  }
}

const nonTargetMessage_callback = () => {
  if (numMessages === 0) {
    console.log(`[Alan.js] Non-target message recv'd. Nothing to do.`);
  } else if (numMessages === 1) {
    console.log(`[Alan.js] Non-target message recv'd in waiting state. Nothing to do`);
  } else if (numMessages >= 2) {
    console.log(`[Alan.js] Sending translation. Transitioning from ready to start`);
    bot.postMessage(`
TRANSLATION (${numMessages} messages):
==== BEGIN TRANSLATION ====

${translation}

===== END TRANSLATION =====
Copyright 2019 LaviDidIt industries, brazilian translation v4.62.90

`);
  }

  state = 'start';
  translation = '';
  numMessages = 0;
}

/* Timeout stuff */
let timeoutVar;
function beginTimeout() {
  if (timeoutVar) clearTimeout(timeoutVar);
  console.log(`beginning a timeout for ${global.timeout_ms} milliseconds`);
  timeoutVar = setTimeout(timeout_expired_callback, global.timeout_ms);
}

function timeout_expired_callback() {
  console.log(`Timeout expired.`);
  nonTargetMessage_callback();
}

/* exports */
exports.listener = listener;
exports.name = 'alan';
