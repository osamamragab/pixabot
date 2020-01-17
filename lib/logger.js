'use strict';

module.exports = (type, msg) => {
  const date = new Date();

  if (typeof msg === 'object') msg = msg.message || msg.stack;

  const text = `[${type}]: ${
    msg ? (msg.endsWith('.') ? msg : msg + '.') : 'no message.'
  } at ${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  console.log(text);
  return text;
};
